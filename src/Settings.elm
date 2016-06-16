module Settings exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

type alias Model =
    { dbUrl: String
    , apiServer: String
    }


create: String -> String -> Model
create dbUrl apiServer =
    { dbUrl = dbUrl
    , apiServer = apiServer
    }



type Msg = CloseWindow 
         | OpenWindow
         | ChangeDbUrl String
         | ApplySettings

view: Model -> Html Msg
view model =
    div [class "pane"]
        [div [class "tab-group"]
            [div [class "tab-item active"]
                [span 
                    [class "icon icon-cancel icon-close-tab"
                    , onClick CloseWindow
                    ] []
                ,text "Settings"
                ]
            ]
        ,Html.form []
            [div []
                 [label [] [text "db_url"]
                 ,input [type' "text"
                        ,placeholder "db url"
                        ,style [("width", "400px")]
                        ,onInput ChangeDbUrl
                        ,value model.dbUrl
                        ] []
                 ]
            ,div []
                 [label [] [text "api_server"]
                 ,input [type' "text"
                        ,placeholder "api server"
                        ,style [("width", "400px")]
                        ,value model.apiServer
                        ] []
                   ]
            ,button [onClick ApplySettings] [text "Apply Settings"]
            ]
        ]


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeDbUrl dbUrl ->
            ({model | dbUrl = dbUrl}, Cmd.none)
        ApplySettings ->
            (model, Cmd.none)
        _ ->
            (model, Cmd.none)
