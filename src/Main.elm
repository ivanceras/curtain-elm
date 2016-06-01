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
    }




type Msg
    = GetWindowList
    | WindowListReceived (List WindowList.WindowName) 
    | OpenWindow String
    | UpdateWindow Window.Msg
    | UpdateWindowList WindowList.Msg
    | WindowDetailReceived Window.Window
    | GetWindowData String
    | WindowDataReceived (List Window.TableDao) 
    | FetchError Http.Error

app_model =
    { title = "Curtain UI"
    , db_url = "postgres://postgres:p0stgr3s@localhost:5432/bazaar_v8"
    , api_server = "http://localhost:8181"
    , window_list = WindowList.empty 
    , focused_window = Just "person"
    , opened_windows = [Window.empty]
    , error = []
    }


init: (Model, Cmd Msg)
init = (app_model, fetch_window_list app_model)

view: Model -> Html Msg
view model =
    div [class "window"] 
         [ header [class "toolbar toolbar-header"]
                [button [onClick GetWindowList] [text "Refresh WindowList"]]
          ,div [class "window-content"]
               [div [class "pane-group"] 
                   [ div [class "pane pane-sm sidebar"]
                         [(App.map UpdateWindowList (WindowList.view model.window_list))]
                   , div [class "pane"] 
                         (List.map(\w ->App.map UpdateWindow (Window.view w)) model.opened_windows)
                   ]
                ]
          ,footer [class "toolbar toolbar-footer"]
                [span [class "pull-right"] [text (toString model.error)]]
          ]


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateWindow msg -> --todo: window identification should be added here, else all windows are updated
            let window_updates = List.map(\w ->
                        let (mr,cmd) = Window.update msg w in mr
                    ) model.opened_windows
            in
            ({model | opened_windows = window_updates}, Cmd.none)
        
        UpdateWindowList msg ->
            case msg of
                WindowList.OpenWindow table ->
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
                opened_windows = 
                List.map(\window_model ->
                            let (mo, cmd) = Window.update (Window.WindowDetailReceived window) window_model
                            in mo
                        ) model.opened_windows
            in
            ({model | opened_windows = opened_windows} 
            , get_window_data model window.table)

        OpenWindow table ->
            (model, fetch_window_detail model table)

        GetWindowData table ->
            ( model, Cmd.none)

        WindowDataReceived table_dao_list ->
            let opened_windows =
                List.map(
                    \window_model ->
                        let (mo, cmd) = Window.update (Window.WindowDataReceived table_dao_list) window_model
                        in mo
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

get_window_data: Model -> String -> Cmd Msg
get_window_data model main_table =
    http_get model ("/app/" ++ main_table)
        |> Http.fromJson (Decode.list Window.table_dao_decoder)
        |> Task.perform FetchError WindowDataReceived
