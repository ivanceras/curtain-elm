module Settings exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

type alias Model =
    { dbUrl: Maybe String
    , apiServer: String
    }


create: Maybe String -> String -> Model
create dbUrl apiServer =
    { dbUrl = dbUrl
    , apiServer = apiServer
    }



type Msg = ChangeDbUrl String
         | ApplySettings
         | CloseWindow

view: Model -> Html Msg
view model =
   let  dbUrl = case model.dbUrl of
            Just dbUrl -> dbUrl
            Nothing -> ""

        labelStyle = style [ ("width", "200px") 
                            , ("text-align", "left")
                            , ("padding-top", "5px")
                            , ("display", "block")
                            , ("margin-bottom", "0px")
                            , ("font-size", "0.8em")
                            ]
        textStyle = 
              style [("width","350px")
                    ,("border","0")
                    ,("outline", "0")
                    ,("border-bottom", "1px solid #ccc")
                    ,("background-color", "#fff")
                    ]
    in

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
        ,div [
                style [("padding", "50px")
                      ]
            ]
            [div []
                 [label [labelStyle] [text "DB Url"]
                 ,input [type' "text"
                        ,textStyle
                        ,placeholder "db url"
                        ,onInput ChangeDbUrl
                        ,value dbUrl
                        ] []
                 ]
            ,div []
                 [label [labelStyle] [text "API server"]
                 ,input [type' "text"
                        ,placeholder "api server"
                        ,textStyle
                        ,value model.apiServer
                        ] []
                   ]
            ,button [onClick ApplySettings
                    ,style [("margin-top", "30px")]
                    ]
                    [text "Connect to Server"]
            ]
        ]





update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    let _ = Debug.log "In Settings.update" "here..."
    in
    case msg of
        ChangeDbUrl dbUrl ->
            ({model | dbUrl = Just dbUrl}, Cmd.none)
        _ ->
            (model, Cmd.none)
