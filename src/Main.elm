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
import Utils


type alias Model =
    { title: String
    , windowList: WindowList.Model
    , openedWindows: List DataWindow.Model
    , error: Maybe String
    , uid: Int -- id for the opened windows
    , isSettingsOpened: Bool
    , browserDimension: Tab.BrowserDimension
    , defaultPageSize: Int
    , dragListenWindow: Maybe Int
    , settings: Settings.Model
    }



type Msg
    = GetWindowList
    | WindowListReceived (List WindowList.WindowName) 
    | CloseWindow Int
    | ActivateWindow Int
    | UpdateWindow Int DataWindow.Msg
    | UpdateWindowList WindowList.Msg
    | UpdateSettings Settings.Msg
    | ToggleSettingsWindow
    | WindowDetailReceived DataWindow.Window
    | GetWindowData String
    | WindowDataReceived Int (List Dao.TableDao) 
    | FetchError Http.Error
    | FocusedRecordDataReceived Int Int (List Dao.TableDao)
    | WindowResize BrowserWindow.Size
    | ReceivedScrollBarWidth Int 
    | ReceivedScrollBottomEvent String 
    | ReceivedSettingsDbUrl String
    | ReceivedSettingsApiServer String
    | WindowDataNextPageReceived Int (List Dao.TableDao)
    | CacheReset String
    | DbConnectionTested String
    | DbConnectionTestError Http.Error
    | RecordsUpdated Int (List Dao.UpdateResponse)
    | UpdateError Int Http.Error
    | DragAt Mouse.Position
    | DragEnd Mouse.Position


appModel =
    { title = "Curtain UI"
    , windowList = WindowList.empty 
    , openedWindows = []
    , error = Nothing 
    , uid = 0
    , isSettingsOpened = True 
    , browserDimension = 
        { width=0
        , height=0
        , scrollBarWidth = 13
        }
    , defaultPageSize = 40
    , dragListenWindow = Nothing
    , settings = Settings.init "" "" 
    }


init: (Model, Cmd Msg)
init = 
    (appModel
       ,Cmd.batch[getScrollbarWidth ()
                 ,setWindowSize
                 ,getSettingsDbUrl ()
                 ,getSettingsApiServer ()
                 ])



saveSettings: Model -> Cmd msg 
saveSettings model =
   Cmd.batch[
        saveSettingsDbUrl model.settings.dbUrl
       ,saveSettingsApiServer model.settings.apiServer
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
         [div [class "window-content"]
               [div [class "pane-group"] 
                   [ div [class "pane pane-sm sidebar"]
                         [ settingsButton
                         , (App.map UpdateWindowList (WindowList.view model.windowList))
                         ]
                   , if model.isSettingsOpened then
                         Settings.view model.settings
                            |> App.map UpdateSettings
                     else
                        div [class "pane main_container"] 
                             [ div [class "tab-group"] 
                                        (model.openedWindows 
                                            |> List.map(
                                                \w ->
                                                    div [classList [("tab-item", True)
                                                                    ,("active", w.isActive)
                                                                    ,("flex", (List.length model.openedWindows) > 3) -- if (tab-item-width * windowCount > allocatedWidth)
                                                                    ]
                                                        ,onClick (ActivateWindow w.windowId)
                                                        ]
                                                        [ text w.name
                                                         ,i [ onClickNoPropagate (CloseWindow w.windowId)
                                                                ,class "icon icon-cancel icon-close-tab"] []
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
            updateThenHandleWindowMsg model windowMsg windowId

        CloseWindow windowId ->
            (closeWindow model windowId 
            , Cmd.none)

        ActivateWindow windowId -> --set focus to the window
             ( activateWindow windowId model
             , Cmd.none)
        
        UpdateWindowList msg ->
            let (window_list, outmsg) =
                WindowList.update msg model.windowList
                model' = {model | windowList = window_list}
            in
            case outmsg of
                Nothing -> (model', Cmd.none)
                Just (WindowList.LoadWindow table) ->
                    (model', fetchWindowDetail model' table)
        
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
            , getWindowData model window.table model.uid
            )

        GetWindowData table ->
            ( model, Cmd.none)

        WindowDataReceived windowId tableDaoList ->
            (updateWindow model (DataWindow.WindowDataReceived tableDaoList) windowId
                |> fst
            , Cmd.none
            )
        
        FetchError e ->
            let _ = Debug.log "There was an error fetching records" e
            in
            ( { model | error = Just (toString e)}, Cmd.none )

        UpdateSettings settingsMsg ->
            let (updatedSettings, outmsgs) = Settings.update settingsMsg model.settings
                model' = {model | settings = updatedSettings}
            in
              handleSettingsOutMsg model' outmsgs 

        ToggleSettingsWindow ->
            ({model | isSettingsOpened = not model.isSettingsOpened}, Cmd.none)

        FocusedRecordDataReceived windowId rowId tableDaoList ->
            (updateWindow model (DataWindow.FocusedRecordDataReceived rowId tableDaoList) windowId
                |> fst
            , Cmd.none)

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
            updateActiveWindow model (DataWindow.ReceivedScrollBottomEvent table)

        WindowDataNextPageReceived windowId tableDaoList ->
            let _ = Debug.log "got next page for " windowId
            in
            (updateWindow model (DataWindow.WindowDataNextPageReceived tableDaoList) windowId
                |> fst
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
            ({model | settings =
                Settings.update (Settings.ChangeDbUrl dbUrl) model.settings
                |> fst
              }
            , Cmd.none
            )

        ReceivedSettingsApiServer apiServer ->
            let _ = Debug.log "received settings api_server" apiServer in
            ({model | settings =
                Settings.update (Settings.ChangeApiServer apiServer) model.settings  
                    |> fst
              }
            , Cmd.none
            )
        
        DbConnectionTested result ->
            let _ = Debug.log "Database connection tested" result in
            if result == "OK" then
                ({model | settings =
                    Settings.update Settings.DbConnectionTested model.settings
                        |> fst
                 }
                , resetCache model)
            else
                let _ = Debug.log "Unable to connect to database"
                in
                (model, Cmd.none)

        DbConnectionTestError error ->
            let _ = Debug.log "There is an error with this request" error in
            case error of
                Http.NetworkError ->
                    ({model | settings =
                        Settings.update Settings.NetworkError model.settings
                            |> fst
                      }
                     , Cmd.none)

                _ ->
                    ({model | settings = 
                        Settings.update Settings.DbConnectionTestError model.settings
                            |> fst
                     }
                     , Cmd.none)


        RecordsUpdated windowId updateResponse ->
               updateThenHandleWindowMsg model (DataWindow.RecordsUpdated updateResponse) windowId

        UpdateError windowId error ->
            let _ = Debug.log "Update error" error
            in
            (updateWindow model (DataWindow.SetAlert (toString error)) windowId
                |> fst
            , Cmd.none)
        
        DragAt position ->
            let _ = Debug.log "DragAt" position
            in
            (model, Cmd.none)

        DragEnd position ->
            let _ = Debug.log "DragEnd" position
            in
            (model, Cmd.none)

handleSettingsOutMsg: Model -> List Settings.OutMsg -> (Model, Cmd Msg)
handleSettingsOutMsg model outmsgs =           
    let
        (model'', newoutList) = 
            List.foldl
                (\outmsg (model', newout) ->
                    case outmsg of
                        Settings.CloseWindow ->
                            (closeSettingsWindow model'
                            , newout)

                        Settings.ApplySettings settings ->
                            let _ = Debug.log "Apllying the settings down...." ""
                            in
                            ( model' 
                            , newout ++
                                [testDbConnection model'
                                ,saveSettings model'
                                ]
                             )
                  ) (model, []) outmsgs
    in
        (model'', Cmd.batch newoutList)


updateThenHandleWindowMsg: Model -> DataWindow.Msg -> Int -> (Model, Cmd Msg)
updateThenHandleWindowMsg model windowMsg windowId =
    let (model', outmsg) = updateWindow model windowMsg windowId
    in 
        handleWindowOutMsg outmsg model' windowId

handleWindowOutMsg: List DataWindow.OutMsg -> Model -> Int -> ( Model, Cmd Msg)
handleWindowOutMsg outmsgs model windowId =
    let (model', cmdlist) =
        List.foldl
            (
            \ outmsg (model, cmds) ->
                case outmsg of
                    DataWindow.LoadNextPage tabModel ->
                        (model, cmds ++ [ loadNextPage windowId model ])
                    DataWindow.UpdateRecords mainTable body ->
                        (model, cmds ++ [httpUpdateRecords model windowId mainTable body])
                    DataWindow.FocusedRow focusedRow ->
                        (model, cmds ++ [fetchFocusedRecordDetail model windowId focusedRow.rowId])


            ) (model, []) outmsgs
      in
       (model', Cmd.batch cmdlist)


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
     Sub.batch [BrowserWindow.resizes sizeToMsg
               ,receiveScrollBarWidth ReceivedScrollBarWidth
               ,receiveScrollBottomEvent ReceivedScrollBottomEvent
               ,receiveSettingsDbUrl ReceivedSettingsDbUrl
               ,receiveSettingsApiServer ReceivedSettingsApiServer
               ,case model.dragListenWindow of
                    Just windowId ->
                        case getWindow model windowId of
                            Just windowModel ->
                                Sub.map (UpdateWindow windowId) (DataWindow.subscriptions windowModel)
                            Nothing ->
                                Sub.none
                    Nothing ->
                        Sub.none
               ]


sizeToMsg: BrowserWindow.Size -> Msg
sizeToMsg size = 
    WindowResize size

addWindow: Model -> DataWindow.Window -> Model
addWindow model window =
    let window' = DataWindow.create window model.uid (nextOpenSequence model)
        (window'', _) = DataWindow.update (DataWindow.WindowDetailReceived window) window' 
        (window''', _) = DataWindow.update (DataWindow.BrowserDimensionChanged model.browserDimension) window''
        allWindows = model.openedWindows ++ [window''']
    in
    { model | openedWindows = allWindows 
    , uid = model.uid + 1
    } 
        |> activateWindow window'''.windowId
        

displayWindowDetail: Model -> DataWindow.Window -> Model
displayWindowDetail model window =
    addWindow model window
        

closeWindow: Model -> Int -> Model
closeWindow model windowId =
    {model | openedWindows =  
            List.filter (\w -> w.windowId /= windowId ) model.openedWindows
    }
        |> openLastActivatedWindow

openLastActivatedWindow: Model -> Model
openLastActivatedWindow model =
    case lastOpenedWindow model of
        Just window ->
            activateWindow window.windowId model
        Nothing ->
            model

updateActiveWindow: Model -> DataWindow.Msg -> (Model, Cmd Msg)
updateActiveWindow model windowMsg =
    let activeWindow = 
            List.filter(
                \window ->
                    window.isActive
            ) model.openedWindows
        |> List.head
     in
        case activeWindow of
            Just activeWindow ->
                updateThenHandleWindowMsg model windowMsg activeWindow.windowId
            Nothing ->
                (model, Cmd.none)

updateWindow: Model -> DataWindow.Msg -> Int -> (Model, List DataWindow.OutMsg)
updateWindow model windowMsg windowId =
    let updated_outmsgs = 
        List.map(
            \w ->
                if w.windowId == windowId then
                    let (window', outmsg) = DataWindow.update windowMsg w
                        _ = Debug.log "Main outmsg" outmsg
                    in 
                        (window', outmsg) 
                                    
                else
                    (w, [])
        ) model.openedWindows

        (windows, outmsgs) = List.unzip updated_outmsgs
    in
    ({model | openedWindows = windows}
    , List.concat outmsgs)


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


lastOpenedWindow: Model -> Maybe DataWindow.Model
lastOpenedWindow model =
    List.sortBy .openSequence model.openedWindows
        |> List.head

highestOpenSequence: Model -> Int
highestOpenSequence model =
    case lastOpenedWindow model of
        Just lastOpened ->
            lastOpened.openSequence
        Nothing ->
            0
            

nextOpenSequence model =
    (highestOpenSequence model )+ 1


activateWindow: Int -> Model ->  Model
activateWindow windowId model =
    { model | openedWindows =
        List.map (
            \ window ->
                if window.windowId == windowId then
                    DataWindow.update (DataWindow.ActivateWindow (nextOpenSequence model)) window
                        |> fst
                else
                    DataWindow.update DataWindow.DeactivateWindow window
                        |> fst
        ) model.openedWindows
    }



-- check to see if the windowId is in openedWindows
inOpenedWindows model windowId =
    List.filter (\w -> w.windowId == windowId ) model.openedWindows
        |> List.isEmpty 
        |> not

getWindow: Model -> Int -> Maybe DataWindow.Model
getWindow model windowId =
    List.filter (\w -> w.windowId == windowId ) model.openedWindows
        |> List.head


-- get the table name of this windowId
getWindowTable: Model -> Int -> Maybe String
getWindowTable model windowId =
    case getWindow model windowId of
        Just window ->
            Just window.mainTab.tab.table
        Nothing -> Nothing


httpGet model url =
    httpRequest "GET" model Http.empty url


httpPost model body url =
     httpRequest "POST" model body url
    
httpDelete model body url =
    httpRequest "DELETE" model body url

httpRequest verb model body url =
    Http.send Http.defaultSettings
    { verb = verb
    , headers = [("db_url", model.settings.dbUrl)]
    , url = model.settings.apiServer ++ url
    , body = body
    }

resetCache: Model -> Cmd Msg
resetCache model =
    httpDelete model Http.empty "/cache"
        |> Http.fromJson Decode.string
        |> Task.perform FetchError CacheReset


testDbConnection model =
    httpGet model "/connection"
        |> Http.fromJson Decode.string
        |> Task.perform DbConnectionTestError DbConnectionTested

httpUpdateRecords: Model -> Int -> String -> String -> Cmd Msg
httpUpdateRecords model windowId mainTable body =
    Debug.log "httpUpdateRecords"
    httpPost model (Http.string body) ("/app/"++mainTable)
        |> Http.fromJson (Decode.list Dao.updateResponseDecoder)
        |> Task.perform (UpdateError windowId) (RecordsUpdated windowId)



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

getWindowData: Model -> String -> Int -> Cmd Msg
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



page: Int -> String
page p =
    "page="++(toString p)

pageSize: Int -> String
pageSize size =
    "page_size="++(toString size)

pageSizeQuery p size = 
    page p ++ "&" ++ pageSize size


fetchFocusedRecordDetail: Model -> Int -> Int ->  Cmd Msg
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


