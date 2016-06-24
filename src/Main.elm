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


type alias Model =
    { title: String
    , dbUrl: String
    , apiServer: String
    , windowList: WindowList.Model
    , openedWindows: List DataWindow.Model
    , error: List String
    , uid: Int -- id for the opened windows
    , activeWindow: Maybe Int
    , isSettingsOpened: Bool
    , browserDimension: Tab.BrowserDimension
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
    | WindowDataReceived WindowId (List DataWindow.TableDao) 
    | LookupTabsReceived WindowId (List Tab.Tab)
    | LookupDataReceived WindowId (List Field.LookupData)
    | FetchError Http.Error
    | FocusedRecordDataReceived WindowId RowId (List DataWindow.TableDao)
    | WindowResize BrowserWindow.Size
    | ReceivedScrollBarWidth Int 
    | GetScrollBarWidth

appModel =
    { title = "Curtain UI"
    , dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/bazaar_v8"
    --, dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/gda"
    --, dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/adempiere"
    --, dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/guardian"
    , apiServer = "http://localhost:8181"
    , windowList = WindowList.empty 
    , openedWindows = []
    , error = []
    , uid = 0
    , activeWindow = Nothing
    , isSettingsOpened = False
    , browserDimension = 
        { width=0
        , height=0
        , scrollBarWidth = 13
        } --chrome 15, firefox 17
    }


init: (Model, Cmd Msg)
init = (appModel
       ,Cmd.batch[fetchWindowList appModel
                 ,getScrollbarWidth ()
                 ,setWindowSize
                 ])

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
                         Settings.view (Settings.create model.dbUrl model.apiServer)
                            |> App.map UpdateSettings
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
            [ span [class "icon icon-cancel icon-cog"] []
            , text " Settings"
            ]
         ]


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateWindow windowId windowMsg -> 
              case msg of 
                    -- TODO: a hacky long TAP? lazy
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
                |> updateActivatedWindowList
            , getWindowData model window.table model.uid
            )

        LoadWindow table ->
            (model, fetchWindowDetail model table)

        GetWindowData table ->
            ( model, Cmd.none)

        WindowDataReceived windowId tableDaoList ->
            let openedWindows =
                List.map(
                    \windowModel ->
                        if windowModel.windowId == windowId then
                            let (mo, cmd) = DataWindow.update (DataWindow.WindowDataReceived tableDaoList) windowModel
                            in mo
                        else
                            windowModel
                ) model.openedWindows
            in
            ( {model | openedWindows = openedWindows} , fetchLookupTabs model windowId)
        
        LookupTabsReceived windowId tabList -> --update the window and propage the data down to the fields
            (updateWindow model (DataWindow.LookupTabsReceived tabList) windowId
            , fetchLookupData model windowId
            )

        LookupDataReceived windowId lookupData ->
            (updateWindow model (DataWindow.LookupDataReceived lookupData) windowId, Cmd.none)

        FetchError e ->
            ( { model | error = (toString e)::model.error }, Cmd.none )

        UpdateSettings settingsMsg ->
            case settingsMsg of
                Settings.OpenWindow ->
                    ({model | isSettingsOpened = True}, Cmd.none)
                Settings.CloseWindow ->
                    ({model | isSettingsOpened = False}, Cmd.none)
                Settings.ChangeDbUrl dbUrl ->
                    ({model | dbUrl = dbUrl}, Cmd.none)
                Settings.ApplySettings ->
                    (model, fetchWindowList model)

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
            let dimension = model.browserDimension
                updatedDimension =
                    {dimension | scrollBarWidth = width}
            in
            ({model | browserDimension = updatedDimension }
                |> updateAllWindow (DataWindow.BrowserDimensionChanged updatedDimension) 
            , Cmd.none)

        GetScrollBarWidth ->
            (model, getScrollbarWidth () )


main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }

subscriptions: Model -> Sub Msg 
subscriptions model = 
     Sub.batch [(BrowserWindow.resizes sizeToMsg)
               ,receiveScrollBarWidth ReceivedScrollBarWidth
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
    Http.send Http.defaultSettings
    { verb = "GET"
    , headers = [("db_url", model.dbUrl)]
    , url = model.apiServer ++ url
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
    httpGet model ("/app/" ++ mainTable)
        |> Http.fromJson (Decode.list DataWindow.tableDaoDecoder)
        |> Task.perform FetchError (WindowDataReceived windowId)

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
                                |> Http.fromJson (Decode.list DataWindow.tableDaoDecoder)
                                |> Task.perform FetchError (FocusedRecordDataReceived windowId rowId)
                        Nothing ->
                            Debug.crash "No such row"
                Nothing ->
                    Debug.crash "No such window"

        Nothing ->
            Debug.crash "No matching table for focused record"


port receiveScrollBarWidth: (Int -> msg) -> Sub msg
port getScrollbarWidth: () -> Cmd msg


