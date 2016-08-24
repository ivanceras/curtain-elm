port module Main exposing (..)

import DataWindow
import Html.App as App
import Html exposing (..)
import Html.Events exposing (..)
import WindowList
import Http
import Task
import Html.Attributes exposing (..)
import Json.Decode as Decode
import Tab
import Field
import Settings
import Row
import Window as BrowserWindow
import Dao
import Mouse


type alias Model =
    { title: String
    , dbUrl: Maybe String
    , apiServer: Maybe String
    , windowList: WindowList.Model
    , openedWindows: List DataWindow.Model
    , error: List String
    , uid: Int -- id for the opened windows
    , activeWindow: Maybe Int
    , isSettingsOpened: Bool
    , browserDimension: Tab.BrowserDimension
    , defaultPageSize: Int
    , settingsModel: Maybe Settings.Model
    }


type alias WindowId = Int
type alias RowId = Int



type Msg
    = GetWindowList
    | WindowListReceived (List WindowList.WindowName) 
    | LoadWindow String
    | CloseWindow WindowId
    | ActivateWindow WindowId
    | UpdateWindow WindowId DataWindow.Msg
    | UpdateWindowList WindowList.Msg
    | UpdateSettings Settings.Msg
    | ToggleSettingsWindow
    | WindowDetailReceived DataWindow.Window
    | GetWindowData String
    | WindowDataReceived WindowId (List Dao.TableDao) 
    | LookupTabsReceived WindowId (List Tab.Tab)
    | LookupDataReceived WindowId (List Field.LookupData)
    | FetchError Http.Error
    | FocusedRecordDataReceived WindowId RowId (List Dao.TableDao)
    | WindowResize BrowserWindow.Size
    | ReceivedScrollBarWidth Int 
    | ReceivedScrollBottomEvent String 
    | ReceivedSettingsDbUrl String
    | ReceivedSettingsApiServer String
    | WindowDataNextPageReceived WindowId (List Dao.TableDao)
    | CacheReset String
    | DbConnectionTested String
    | DbConnectionTestError Http.Error
    | DataUpdated String

appModel =
    { title = "Curtain UI"
    , dbUrl = Nothing
    , apiServer = Nothing
    , windowList = WindowList.empty 
    , openedWindows = []
    , error = []
    , uid = 0
    , activeWindow = Nothing
    , isSettingsOpened = True 
    , browserDimension = 
        { width=0
        , height=0
        , scrollBarWidth = 13
        }
    , defaultPageSize = 40
    , settingsModel = Nothing
    }


init: (Model, Cmd Msg)
init = 
    (appModel
        |> createSettingsModel
       ,Cmd.batch[getScrollbarWidth ()
                 ,setWindowSize
                 ,getSettingsDbUrl ()
                 ,getSettingsApiServer ()
                 ])

createSettingsModel: Model -> Model
createSettingsModel model =
    {model | settingsModel = Just (Settings.create model.dbUrl model.apiServer)}

updateSettings: Settings.Msg -> Model -> Model
updateSettings settingsMsg model =
    {model | settingsModel = 
        case model.settingsModel of
            Just settingsModel ->
                let (updatedSettings, _) = Settings.update settingsMsg settingsModel
                in Just updatedSettings
            Nothing -> Nothing
    }

saveSettings: Model -> Cmd msg 
saveSettings model =
   Cmd.batch[
     case model.dbUrl of
        Just dbUrl -> saveSettingsDbUrl dbUrl
        Nothing -> Cmd.none

    ,case model.apiServer of
        Just apiServer -> saveSettingsApiServer apiServer
        Nothing -> Cmd.none

   ] 

closeSettingsWindow: Model -> Model
closeSettingsWindow model =
   {model | isSettingsOpened = False}

cleanOpenedWindows: Model -> Model
cleanOpenedWindows model =
    {model | openedWindows = []}
    


setWindowSize: Cmd Msg
setWindowSize = 
    Task.perform (\a -> a) (\size -> WindowResize size) BrowserWindow.size
                

onClickNoPropagate: msg -> Attribute msg
onClickNoPropagate msg = 
    Decode.succeed msg
        |> onWithOptions "click" {defaultOptions | stopPropagation = True}

view: Model -> Html Msg
view model =
    div [class "window"] 
         [ header [class "toolbar toolbar-header"]
                [h1 [class "title"] [text "Curtain"]
                ]
          ,div [class "window-content"]
               [div [class "pane-group"] 
                   [ div [class "pane pane-sm sidebar"]
                         [ settingsButton
                         , (App.map UpdateWindowList (WindowList.view model.windowList))
                         ]
                   , if model.isSettingsOpened then
                        case model.settingsModel of
                            Just settingsModel ->
                                 Settings.view settingsModel
                                    |> App.map UpdateSettings
                            Nothing -> text "No settings.."
                     else
                        div [class "pane main_container"] 
                             [ div [class "tab-group"] 
                                        (model.openedWindows 
                                            |> List.map(
                                                \w ->
                                                    div [classList [("tab-item", True)
                                                                    ,("active", w.isActive)
                                                                    ,("flex", (List.length model.openedWindows) > 5)
                                                                    ]
                                                        ,onClick (ActivateWindow w.windowId)
                                                        ]
                                                        [ span [ onClickNoPropagate (CloseWindow w.windowId)
                                                                ,class "icon icon-cancel icon-close-tab"] []
                                                          ,text w.name
                                                        ]
                                            )
                                        )
                             , div []
                             (model.openedWindows
                                  |> List.map (
                                            \w -> 
                                                DataWindow.view w
                                                    |> App.map (UpdateWindow w.windowId)
                                         ) 
                             )
                         ]
                   ]
                ]
          ,footer [class "toolbar toolbar-footer"]
                [span [class "pull-right"] [text (toString model.error)]]
          ]

settingsButton: Html Msg
settingsButton = 
    div [class "toolbar-actions"]
         [ button 
            [class "btn btn-default"
            ,onClick ToggleSettingsWindow
            ]
            [ span [class "icon icon-text icon-cog"] []
            , text "Connection Settings"
            ]
         ]

shallLoadNextPage: Int -> Model -> Cmd Msg
shallLoadNextPage windowId model =
    case getWindow model windowId of
        Just window ->
            if not window.mainTab.loadingPage then
                loadNextPage windowId model
            else
                let _ = Debug.log "Ignoring LoadNextPage request" ""
                in Cmd.none
        Nothing ->
            Cmd.none

loadNextPage: Int -> Model -> Cmd Msg
loadNextPage windowId model =
    case getWindow model windowId of
        Just window -> 
            let table = window.mainTab.tab.table
                nextPage = 
                    case window.mainTab.page of
                        Just page -> page + 1
                        Nothing -> 0
                pageSize = 
                    case window.mainTab.pageSize of
                        Just pageSize -> pageSize
                        Nothing -> 0
                totalPage =
                    case window.mainTab.totalPage of
                        Just totalPage -> totalPage
                        Nothing -> 0
            in
            if nextPage < totalPage then
                getWindowDataPage table windowId nextPage pageSize model
            else
                let _ = Debug.log "Has reached the last page"
                in
                Cmd.none
        Nothing -> Cmd.none
    

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateWindow windowId windowMsg -> 
              case msg of 
                    UpdateWindow windowId (DataWindow.UpdateTab (Tab.UpdateRow rowId Row.FocusRecord)) ->
                        (updateWindow model windowMsg windowId
                        ,fetchFocusedRecordDetail model windowId rowId)

                    _ -> 
                        (updateWindow model windowMsg windowId, Cmd.none)

        CloseWindow windowId ->
            (closeWindow model windowId 
                |> updateActivatedWindows 
                |> updateActivatedWindowList
            , Cmd.none)

        ActivateWindow windowId -> --set focus to the window
             ( {model | activeWindow = Just windowId}
                |> updateActivatedWindows
                |> updateActivatedWindowList
             , Cmd.none)
        
        UpdateWindowList msg ->
            case msg of
                WindowList.LoadWindow table ->
                    (model, fetchWindowDetail model table)
                _ ->
                    (model, Cmd.none)
        
        GetWindowList ->
            ( model, fetchWindowList model)

        WindowListReceived windowList ->
            let (wm, cmd) = WindowList.update (WindowList.WindowListReceived windowList) model.windowList 
            in
            ({model | windowList = wm}
            , Cmd.none
            )
       
        WindowDetailReceived window ->
            ( displayWindowDetail model window
                |> activateFirstWindow
                |> updateActivatedWindowList
            , getWindowData model window.table model.uid
            )

        LoadWindow table ->
            (model, fetchWindowDetail model table)

        GetWindowData table ->
            ( model, Cmd.none)

        WindowDataReceived windowId tableDaoList ->
            (updateWindow model (DataWindow.WindowDataReceived tableDaoList) windowId
            ,fetchLookupTabs model windowId
            )
        
        LookupTabsReceived windowId tabList -> --update the window and propage the data down to the fields
            (updateWindow model (DataWindow.LookupTabsReceived tabList) windowId
            , fetchLookupData model windowId
            )

        LookupDataReceived windowId lookupData ->
            (updateWindow model (DataWindow.LookupDataReceived lookupData) windowId, Cmd.none)

        FetchError e ->
            ( { model | error = (toString e)::model.error }, Cmd.none )

        UpdateSettings settingsMsg ->
            let _ = Debug.log "settings" settingsMsg
            in
            case settingsMsg of
                Settings.CloseWindow ->
                    (closeSettingsWindow model
                        |> updateSettings settingsMsg
                    , Cmd.none)

                Settings.ChangeDbUrl dbUrl ->
                    ({model | dbUrl = Just dbUrl}
                        |> updateSettings settingsMsg
                    , Cmd.none)

                Settings.ChangeApiServer apiServer ->
                    ({model | apiServer = Just apiServer}
                        |> updateSettings settingsMsg
                    , Cmd.none)

                Settings.ApplySettings ->
                    let _ = Debug.log "Apllying the settings down...." ""
                    in
                    (model
                        |> updateSettings settingsMsg
                    ,Cmd.batch [testDbConnection model
                               ,saveSettings model
                               ])


        ToggleSettingsWindow ->
            ({model | isSettingsOpened = not model.isSettingsOpened}, Cmd.none)

        FocusedRecordDataReceived windowId rowId tableDaoList ->
            (updateWindow model (DataWindow.FocusedRecordDataReceived rowId tableDaoList) windowId, Cmd.none)

        WindowResize size ->
            let dimension = model.browserDimension
                updatedDimension = 
                    {dimension | width  = size.width
                    ,height = size.height
                    }
            in
            ({model | browserDimension = updatedDimension}
                |> updateAllWindow (DataWindow.BrowserDimensionChanged updatedDimension)
            , Cmd.none)

        ReceivedScrollBarWidth width ->
            let _ = Debug.log "received scrollbar width" width
                dimension = model.browserDimension
                updatedDimension =
                    {dimension | scrollBarWidth = width}
            in
            ({model | browserDimension = updatedDimension }
                |> updateAllWindow (DataWindow.BrowserDimensionChanged updatedDimension) 
            , Cmd.none)

        ReceivedScrollBottomEvent table ->
            let _ = Debug.log "main received scrollbottom event" table in
            case model.activeWindow of
                Just windowId ->
                    (updateActiveWindow (DataWindow.ReceivedScrollBottomEvent table) model
                     ,shallLoadNextPage windowId model
                    )

                Nothing -> 
                     (model,Cmd.none)

        WindowDataNextPageReceived windowId tableDaoList ->
            let _ = Debug.log "got next page for " windowId
            in
            (updateWindow model (DataWindow.WindowDataNextPageReceived tableDaoList) windowId
            ,Cmd.none
            )

        CacheReset str ->
            let _ = Debug.log "cache has been reset" ""
            in
            (closeSettingsWindow model
                |> cleanOpenedWindows
            , fetchWindowList model)

        ReceivedSettingsDbUrl dbUrl ->
            let _ = Debug.log "received settings db_url" dbUrl in
            ({model | dbUrl = Just dbUrl}
                |> createSettingsModel 
            , Cmd.none
            )

        ReceivedSettingsApiServer apiServer ->
            let _ = Debug.log "received settings api_server" apiServer in
            ({model | apiServer = Just apiServer}
                |> createSettingsModel
            , Cmd.none
            )
        
        DbConnectionTested result ->
            let _ = Debug.log "Database connection tested" result in
            if result == "OK" then
                (model, resetCache model)
            else
                let _ = Debug.log "Unable to connect to database"
                in
                (model, Cmd.none)

        DbConnectionTestError error ->
            let _ = Debug.log "There is an error with this request" "" in
            (model, Cmd.none)

        DataUpdated message ->
            let _ = Debug.log "Data has been updated" ""
            in
            (model, Cmd.none)


main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

subscriptions: Model -> Sub Msg 
subscriptions model = 
    let _ = Debug.log "setting up subscription" "" in
     Sub.batch [(BrowserWindow.resizes sizeToMsg)
               ,receiveScrollBarWidth ReceivedScrollBarWidth
               ,receiveScrollBottomEvent ReceivedScrollBottomEvent
               ,receiveSettingsDbUrl ReceivedSettingsDbUrl
               ,receiveSettingsApiServer ReceivedSettingsApiServer
               ]

sizeToMsg: BrowserWindow.Size -> Msg
sizeToMsg size = 
    WindowResize size

addWindow: Model -> DataWindow.Window -> Model
addWindow model window =
    let newWindow = DataWindow.create window model.uid
        (mo, _) = DataWindow.update (DataWindow.WindowDetailReceived window) newWindow 
        (mo1, _) = DataWindow.update (DataWindow.BrowserDimensionChanged model.browserDimension) mo 
        allWindows = mo1 :: model.openedWindows
    in
    { model | openedWindows = allWindows 
    , activeWindow = Just mo.windowId
    , uid = model.uid + 1
    } 
        

displayWindowDetail: Model -> DataWindow.Window -> Model
displayWindowDetail model window =
    addWindow model window
        |> updateActivatedWindows
        

closeWindow: Model -> WindowId -> Model
closeWindow model windowId =
    let openedWindows = List.filter (\w -> w.windowId /= windowId ) model.openedWindows
    in
    {model | openedWindows =  openedWindows
    }


updateWindow: Model -> DataWindow.Msg -> WindowId -> Model
updateWindow model windowMsg windowId =
    let updatedWindows = 
        List.map(
            \w ->
                if w.windowId == windowId then
                    let (mo, cmd) = DataWindow.update windowMsg w
                    in mo
                else
                    w
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}


updateAllWindow: DataWindow.Msg -> Model -> Model
updateAllWindow windowMsg model =
    let updatedWindows = 
        List.map(
            \w ->
                let (updatedWindow, _) = DataWindow.update windowMsg w
                in updatedWindow
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}

updateActiveWindow: DataWindow.Msg -> Model -> Model
updateActiveWindow windowMsg model =
    let updatedWindows = 
        List.map(
            \w ->
                if model.activeWindow == Just w.windowId then
                    let (updatedWindow, _) = DataWindow.update windowMsg w
                    in updatedWindow
                else
                    w 
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}

activateFirstWindow: Model -> Model
activateFirstWindow model =
    case List.head model.openedWindows of
        Just window ->
            let (updatedWindow, cmd) = DataWindow.update DataWindow.ActivateWindow window
                allWindows = updatedWindow :: Maybe.withDefault [] (List.tail model.openedWindows)
            in
            {model | activeWindow = Just window.windowId
            ,openedWindows = allWindows
            }
        Nothing -> 
            model


-- Note: closing a window activates it first since the click on the close button 
-- propagates to the the tabm thereby activating that window

updateActivatedWindows: Model -> Model
updateActivatedWindows model =
    let model = deactivateOpenedWindows model
    in
    case model.activeWindow of
        Just activeWindow ->
            if inOpenedWindows model activeWindow then
                let updatedWindows = 
                    model.openedWindows
                        |> List.map(
                            \w ->
                                if w.windowId == activeWindow then
                                    let (mo, cmd) = DataWindow.update DataWindow.ActivateWindow w
                                    in mo
                                else
                                    w
                        )
                in
                {model | openedWindows = updatedWindows}
            else
                activateFirstWindow model
        Nothing -> model


deactivateOpenedWindows: Model -> Model
deactivateOpenedWindows model =
    let updatedWindows = 
        List.map(
            \w ->
                let (mo, cmd) = DataWindow.update DataWindow.DeactivateWindow w
                in mo
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}
    
getActiveWindow: Model -> Maybe DataWindow.Model
getActiveWindow model =
    case model.activeWindow of
        Just activeWindow ->
            List.filter (\w -> w.windowId == activeWindow) model.openedWindows
            |> List.head
        Nothing -> Nothing

updateActivatedWindowList: Model -> Model
updateActivatedWindowList model =
    let windowList =
        case getActiveWindow model of
            Just window ->
                let (mo, cmd) = WindowList.update (WindowList.UpdateActivated window.mainTab.tab.table) model.windowList
                in mo
            Nothing ->
                model.windowList
    in
    {model | windowList = windowList}

-- check to see if the windowId is in openedWindows
inOpenedWindows model windowId =
    List.filter (\w -> w.windowId == windowId ) model.openedWindows
        |> List.isEmpty 
        |> not

getWindow: Model -> WindowId -> Maybe DataWindow.Model
getWindow model windowId =
    List.filter (\w -> w.windowId == windowId ) model.openedWindows
        |> List.head


-- get the table name of this windowId
getWindowTable: Model -> WindowId -> Maybe String
getWindowTable model windowId =
    case getWindow model windowId of
        Just window ->
            Just window.mainTab.tab.table
        Nothing -> Nothing


httpGet model url =
   let dbUrl = 
        case model.dbUrl of
            Just dbUrl ->   dbUrl
            Nothing -> ""

       apiServer = 
         case model.apiServer of
            Just apiServer -> apiServer
            Nothing -> ""
    in
    Http.send Http.defaultSettings
    { verb = "GET"
    , headers = [("db_url", dbUrl)]
    , url = apiServer ++ url
    , body = Http.empty
    }


httpPost model url =
   let dbUrl = 
        case model.dbUrl of
            Just dbUrl ->   dbUrl
            Nothing -> ""

       apiServer = 
         case model.apiServer of
            Just apiServer -> apiServer
            Nothing -> ""
    in
    Http.send Http.defaultSettings
    { verb = "POST"
    , headers = [("db_url", dbUrl)]
    , url = apiServer ++ url
    , body = Http.empty
    }


resetCache: Model -> Cmd Msg
resetCache model =
    httpDelete model "/cache"
        |> Http.fromJson Decode.string
        |> Task.perform FetchError CacheReset


testDbConnection model =
    httpGet model "/connection"
        |> Http.fromJson Decode.string
        |> Task.perform DbConnectionTestError DbConnectionTested

httpDelete model url =
   let dbUrl = 
        case model.dbUrl of
            Just dbUrl ->   dbUrl
            Nothing -> ""

       apiServer = 
         case model.apiServer of
            Just apiServer -> apiServer
            Nothing -> ""
    in
    Http.send Http.defaultSettings
    { verb = "DELETE"
    , headers = [("db_url", dbUrl)]
    , url = apiServer ++ url
    , body = Http.empty
    }


fetchWindowList: Model -> Cmd Msg
fetchWindowList model = 
    httpGet model "/window"
        |> Http.fromJson WindowList.windowListDecoder
        |> Task.perform FetchError WindowListReceived

fetchWindowDetail: Model -> String -> Cmd Msg
fetchWindowDetail model table =
    httpGet model ("/window/"++table)
        |> Http.fromJson DataWindow.windowDecoder
        |> Task.perform FetchError WindowDetailReceived

getWindowData: Model -> String -> WindowId -> Cmd Msg
getWindowData model mainTable windowId =
    httpGet model ("/app/" ++ mainTable ++ "?"++pageSizeQuery 0 model.defaultPageSize)
        |> Http.fromJson (Decode.list Dao.tableDaoDecoder)
        |> Task.perform FetchError (WindowDataReceived windowId)

getWindowDataWithQuery: Model -> String -> Int -> String -> Cmd Msg
getWindowDataWithQuery model mainTable windowId query =
    httpGet model ("/app/" ++ mainTable ++ "?"++query)
        |> Http.fromJson (Decode.list Dao.tableDaoDecoder)
        |> Task.perform FetchError (WindowDataNextPageReceived windowId)
 
getWindowDataPage: String -> Int -> Int -> Int -> Model -> Cmd Msg
getWindowDataPage mainTable windowId page pageSize model =
    getWindowDataWithQuery model mainTable windowId (pageSizeQuery page pageSize)

updateData: Model -> String -> Cmd Msg
updateData model mainTable =
    httpPost model  ("/app/"++mainTable)
        |> Http.fromJson Decode.string
        |> Task.perform FetchError DataUpdated
    

page: Int -> String
page p =
    "page="++(toString p)

pageSize: Int -> String
pageSize size =
    "page_size="++(toString size)

pageSizeQuery p size = 
    page p ++ "&" ++ pageSize size

fetchLookupTabs: Model -> WindowId -> Cmd Msg
fetchLookupTabs model windowId =
    let mainTable = getWindowTable model windowId
    in
    case mainTable of
        Just mainTable ->
            httpGet model ("/lookup_tabs/" ++ mainTable)
                |> Http.fromJson (Decode.list Tab.tabDecoder)
                |> Task.perform FetchError (LookupTabsReceived windowId)
        Nothing ->
           Debug.crash "Unable to get matching table" 

fetchLookupData: Model -> WindowId -> Cmd Msg
fetchLookupData model windowId =
    let mainTable = getWindowTable model windowId
    in
    case mainTable of
        Just mainTable ->
            httpGet model ("/lookup_data/" ++ mainTable)
               |> Http.fromJson (Decode.list Tab.lookupDataDecoder)
               |> Task.perform FetchError (LookupDataReceived windowId)
        Nothing ->
           Debug.crash "Unable to get matching table" 

fetchFocusedRecordDetail: Model -> WindowId -> RowId ->  Cmd Msg
fetchFocusedRecordDetail model windowId rowId =
    let mainTable = getWindowTable model windowId
    in
    case mainTable of
        Just mainTable ->
            case getWindow model windowId of
                Just window ->
                    case Tab.getRow window.mainTab rowId of
                        Just row ->
                            let focusedParam =  "[" ++ Row.focusedRecordParam row ++ "]"
                            in
                            httpGet model ("/app/focus/" ++ mainTable ++ "?focused_record=" ++ focusedParam )
                                |> Http.fromJson (Decode.list Dao.tableDaoDecoder)
                                |> Task.perform FetchError (FocusedRecordDataReceived windowId rowId)
                        Nothing ->
                            Debug.crash "No such row"
                Nothing ->
                    Debug.crash "No such window"

        Nothing ->
            Debug.crash "No matching table for focused record"


port getScrollbarWidth: () -> Cmd msg
port getSettingsDbUrl: () -> Cmd msg
port getSettingsApiServer: () -> Cmd msg

port saveSettingsDbUrl: String -> Cmd msg
port saveSettingsApiServer: String -> Cmd msg

port receiveScrollBarWidth: (Int -> msg) -> Sub msg
port receiveScrollBottomEvent: (String -> msg) -> Sub msg
port receiveSettingsDbUrl: (String -> msg) -> Sub msg
port receiveSettingsApiServer: (String -> msg) -> Sub msg


