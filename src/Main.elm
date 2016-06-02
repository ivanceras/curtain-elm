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


type alias Model =
    { title: String
    , db_url: String
    , api_server: String
    , window_list: WindowList.Model
    , focused_window: Maybe String -- table of the window currently in focused/active
    , opened_windows: List Window.Model
    , error: List String
    , uid: Int -- id for the opened windows
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
    | FetchError Http.Error

app_model =
    { title = "Curtain UI"
    , db_url = "postgres://postgres:p0stgr3s@localhost:5432/bazaar_v8"
    , api_server = "http://localhost:8181"
    , window_list = WindowList.empty 
    , focused_window = Just "person"
    , opened_windows = []
    , error = []
    , uid = 0
    }


init: (Model, Cmd Msg)
init = (app_model, fetch_window_list app_model)

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
                         , (App.map UpdateWindowList (WindowList.view model.window_list))
                         ]
                   , div [class "pane"] 
                         [ div [class "tab-group"] 
                                (model.opened_windows 
                                    |> List.map(
                                        \w ->
                                            div [ classList [("tab-item", True)
                                                            ,("active", w.is_active)
                                                            ]
                                                       ,onClick (ActivateWindow w.window_id)
                                                  ]
                                                [ span [ onClick (CloseWindow w.window_id)
                                                        ,class "icon icon-cancel icon-close-tab"] []
                                                  ,text w.name
                                                ]
                                    )
                                )
                         , div []
                         (model.opened_windows
                              |> List.map (
                                        \w -> 
                                            Window.view w
                                                |> App.map (UpdateWindow w.window_id)
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
        UpdateWindow window_id msg -> --todo: window identification should be added here, else all windows are updated
            let window_updates = List.map(\w ->
                        if w.window_id == window_id then
                           let (mr,cmd) = Window.update msg w in mr
                        else
                            w
                    ) model.opened_windows
            in
            ({model | opened_windows = window_updates}, Cmd.none)

        CloseWindow window_id ->
            let opened_windows = List.filter (\w -> w.window_id /= window_id ) model.opened_windows
                first_opened = 
                    case List.head opened_windows of
                        Just window -> 
                           let first  = {window | is_active = True}
                           in
                           first :: Maybe.withDefault [] (List.tail opened_windows)
                        Nothing -> opened_windows
            in
            ({model | opened_windows = first_opened}
            , Cmd.none
            )

        ActivateWindow window_id -> --set focus to the window
            let _ = Debug.log "activating window " window_id
            in
             ( { model | opened_windows = update_activated_window model.opened_windows window_id
               }
               ,Cmd.none
             )
        
        UpdateWindowList msg ->
            case msg of
                WindowList.LoadWindow table ->
                    (model, fetch_window_detail model table)
                _ ->
                    (model, Cmd.none)
        
        GetWindowList ->
            ( model, fetch_window_list model)

        WindowListReceived window_list ->
            let (wm, cmd) = WindowList.update (WindowList.WindowListReceived window_list) model.window_list 
            in
            ({model | window_list = wm}
            , Cmd.none
            )
       
        WindowDetailReceived window ->
            let _ = Debug.log "window detail" window.name
                new_window = Window.create window model.uid
                (mo, cmd) = Window.update (Window.WindowDetailReceived window) new_window 
                all_windows = mo :: model.opened_windows
                updated_windows = update_activated_window all_windows mo.window_id
            in
            ({ model | opened_windows = updated_windows
             , uid = model.uid + 1
             } 
            , get_window_data model window.table mo.window_id
            )

        LoadWindow table ->
            (model, fetch_window_detail model table)

        GetWindowData table ->
            ( model, Cmd.none)

        WindowDataReceived window_id table_dao_list ->
            let opened_windows =
                List.map(
                    \window_model ->
                        if window_model.window_id == window_id then
                            let (mo, cmd) = Window.update (Window.WindowDataReceived table_dao_list) window_model
                            in mo
                        else
                            window_model
                ) model.opened_windows
            in
            ( {model | opened_windows = opened_windows} , Cmd.none)

        FetchError e ->
            ( { model | error = (toString e)::model.error }, Cmd.none )

main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions= (\_ -> Sub.none)
        }


update_activated_window: List Window.Model -> Int -> List Window.Model
update_activated_window opened_windows window_id =
    if in_opened_windows opened_windows window_id then
        opened_windows
            |> List.map(
                \w ->
                    if w.window_id == window_id then
                        let (mo, cmd) = Window.update Window.ActivateWindow w
                        in mo
                    else
                        let (mo, cmd) = Window.update Window.DeactivateWindow w
                        in mo
            )
    else
        opened_windows
    
-- check to see if the window_id is in opened_windows
in_opened_windows opened_windows window_id =
    List.filter (\w -> w.window_id == window_id ) opened_windows
        |> List.isEmpty 
        |> not

http_get model url =
    Http.send Http.defaultSettings
    { verb = "GET"
    , headers = [("db_url", model.db_url)]
    , url = model.api_server ++ url
    , body = Http.empty
    }

fetch_window_list: Model -> Cmd Msg
fetch_window_list model = 
    http_get model "/window"
        |> Http.fromJson WindowList.window_list_decoder
        |> Task.perform FetchError WindowListReceived

fetch_window_detail: Model -> String -> Cmd Msg
fetch_window_detail model table =
    http_get model ("/window/"++table)
        |> Http.fromJson Window.window_decoder
        |> Task.perform FetchError WindowDetailReceived

get_window_data: Model -> String -> Int -> Cmd Msg
get_window_data model main_table window_id =
    http_get model ("/app/" ++ main_table)
        |> Http.fromJson (Decode.list Window.table_dao_decoder)
        |> Task.perform FetchError (WindowDataReceived window_id)
