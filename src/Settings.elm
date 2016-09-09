module Settings exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

type alias Model =
    { dbUrl: String
    , apiServer: String
    , error: Maybe String
    , processing: Bool
    }


init: String -> String -> Model
init dbUrl apiServer =
    { dbUrl = dbUrl
    , apiServer = apiServer
    , error = Nothing
    , processing = False
    }



type Msg = ChangeDbUrl String
         | ChangeApiServer String
         | ClickedConnect
         | ClickedCloseWindow
         | DbConnectionTested
         | DbConnectionTestError
         | NetworkError

type OutMsg = ApplySettings Model
    | CloseWindow

view: Model -> Html Msg
view model =
   let  
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
                    , onClick ClickedCloseWindow
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
                        ,value model.dbUrl
                        ] []
                 ]
            ,div []
                 [label [labelStyle] [text "API server"]
                 ,input [type' "text"
                        ,placeholder "api server"
                        ,textStyle
                        ,value model.apiServer
                        ,onInput ChangeApiServer
                        ] []
                   ]
            ,button [onClick ClickedConnect
                    ,style [("margin-top", "30px")]
                    ]
                    [text "Connect to Server"]
            , case model.processing of
                True ->
                    div [class "animated slideInLeft"]
                        [text "Connecting..."
                        ,i [class "fa fa-cog fa-spin fa-3x fa-fw"] []
                        ]
                False ->
                    text ""

            , case model.error of
                Just error ->
                    div [class "alert animated fadeIn"
                        ,style [("width", "300px")
                               ,("margin-top", "30px")
                               ]
                        ]
                        [text error]
                Nothing ->
                    span [] []

            ]
        ]





update: Msg -> Model -> (Model, List OutMsg)
update msg model =
    let _ = Debug.log "In Settings.update" "here..."
    in
    case msg of
        ChangeDbUrl dbUrl ->
            ({model | dbUrl = dbUrl}, [])
        ChangeApiServer apiServer ->
            ({model | apiServer = apiServer}, [])
        ClickedConnect ->
            ({ model | error = Nothing 
                ,processing = True
            }
            , [ApplySettings model])
        ClickedCloseWindow ->
            ( model, [CloseWindow])
        DbConnectionTested ->
            ({model | error = Nothing 
                ,processing = False
            }
            , [])
        DbConnectionTestError ->
            ( {model | error =
                Just "Error connecting to database" 
                , processing = False
              }
            , [])
        NetworkError ->
            ({model | error =
                Just "Unable to connect to api server"
                , processing = False
              }
            , [])
