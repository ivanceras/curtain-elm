module Main exposing (..)

import Window
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


type alias Model =
    { title: String
    , dbUrl: String
    , apiServer: String
    , windowList: WindowList.Model
    , openedWindows: List Window.Model
    , error: List String
    , uid: Int -- id for the opened windows
    , activeWindow: Maybe Int
    }




type Msg
    = GetWindowList
    | WindowListReceived (List WindowList.WindowName) 
    | LoadWindow String
    | CloseWindow Int
    | ActivateWindow Int
    | UpdateWindow Int Window.Msg
    | UpdateWindowList WindowList.Msg
    | WindowDetailReceived Window.Window
    | GetWindowData String
    | WindowDataReceived Int (List Window.TableDao) 
    | LookupTabsReceived Int (List Tab.Tab)
    | LookupDataReceived Int (List Field.LookupData)
    | FetchError Http.Error

appModel =
    { title = "Curtain UI"
    , dbUrl = "postgres://postgres:p0stgr3s@localhost:5432/bazaar_v8"
    , apiServer = "http://localhost:8181"
    , windowList = WindowList.empty 
    , openedWindows = []
    , error = []
    , uid = 0
    , activeWindow = Nothing
    }


init: (Model, Cmd Msg)
init = (appModel, fetchWindowList appModel)

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
                         [ settings
                         , (App.map UpdateWindowList (WindowList.view model.windowList))
                         ]
                   , div [class "pane"] 
                         [ div [class "tab-group"] 
                                (model.openedWindows 
                                    |> List.map(
                                        \w ->
                                            div [ classList [("tab-item", True)
                                                            ,("active", w.isActive)
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
                                            Window.view w
                                                |> App.map (UpdateWindow w.windowId)
                                     ) 
                         )
                         ]
                   ]
                ]
          ,footer [class "toolbar toolbar-footer"]
                [span [class "pull-right"] [text (toString model.error)]]
          ]

settings: Html Msg
settings = 
    div [class "toolbar-actions"]
         [ button [class "btn btn-default"]
            [ span [class "icon icon-cancel icon-cog"] []
            , text " Settings"
            ]
         ]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateWindow windowId msg -> 
            let windowUpdates = List.map(\w ->
                        if w.windowId == windowId then
                           let (mr,cmd) = Window.update msg w in mr
                        else
                            w
                    ) model.openedWindows
            in
            ({model | openedWindows = windowUpdates}, Cmd.none)

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
                            let (mo, cmd) = Window.update (Window.WindowDataReceived tableDaoList) windowModel
                            in mo
                        else
                            windowModel
                ) model.openedWindows
            in
            ( {model | openedWindows = openedWindows} , fetchLookupTabs model windowId)
        
        LookupTabsReceived windowId tabList -> --update the window and propage the data down to the fields
            (updateWindow model (Window.LookupTabsReceived tabList) windowId
            , fetchLookupData model windowId
            )

        LookupDataReceived windowId lookupData ->
            (updateWindow model (Window.LookupDataReceived lookupData) windowId, Cmd.none)

        FetchError e ->
            ( { model | error = (toString e)::model.error }, Cmd.none )

main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions= (\_ -> Sub.none)
        }

addWindow: Model -> Window.Window -> Model
addWindow model window =
    let newWindow = Window.create window model.uid
        (mo, cmd) = Window.update (Window.WindowDetailReceived window) newWindow 
        allWindows = mo :: model.openedWindows
    in
    { model | openedWindows = allWindows 
    , activeWindow = Just mo.windowId
    , uid = model.uid + 1
    } 
        

displayWindowDetail: Model -> Window.Window -> Model
displayWindowDetail model window =
    addWindow model window
        |> updateActivatedWindows
        

closeWindow: Model -> Int -> Model
closeWindow model windowId =
    let openedWindows = List.filter (\w -> w.windowId /= windowId ) model.openedWindows
    in
    {model | openedWindows =  openedWindows
    }


updateWindow: Model -> Window.Msg -> Int -> Model
updateWindow model windowMsg windowId =
    let updatedWindows = 
        List.map(
            \w ->
                if w.windowId == windowId then
                    let (mo, cmd) = Window.update windowMsg w
                    in mo
                else
                    w
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}

activateFirstWindow: Model -> Model
activateFirstWindow model =
    case List.head model.openedWindows of
        Just window ->
            let (updatedWindow, cmd) = Window.update Window.ActivateWindow window
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
                                    let (mo, cmd) = Window.update Window.ActivateWindow w
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
                let (mo, cmd) = Window.update Window.DeactivateWindow w
                in mo
        ) model.openedWindows
    in
    {model | openedWindows = updatedWindows}
    
getActiveWindow: Model -> Maybe Window.Model
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
                let (mo, cmd) = WindowList.update (WindowList.UpdateActivated window.mainTab.table) model.windowList
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

-- get the table name of this windowId
getWindowTable: Model -> Int -> Maybe String
getWindowTable model windowId =
    let window = List.filter (\w -> w.windowId == windowId ) model.openedWindows
        |> List.head
    in
    case window of
        Just window ->
            Just window.mainTab.table
        Nothing -> Nothing


httpGet model url =
    let _ = Debug.log "Requesting" url
    in
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
        |> Http.fromJson Window.windowDecoder
        |> Task.perform FetchError WindowDetailReceived

getWindowData: Model -> String -> Int -> Cmd Msg
getWindowData model mainTable windowId =
    httpGet model ("/app/" ++ mainTable)
        |> Http.fromJson (Decode.list Window.tableDaoDecoder)
        |> Task.perform FetchError (WindowDataReceived windowId)

fetchLookupTabs: Model -> Int -> Cmd Msg
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

fetchLookupData: Model -> Int -> Cmd Msg
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

