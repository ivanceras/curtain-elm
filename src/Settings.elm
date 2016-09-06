module Settings exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

type alias Model =
    { dbUrl: Maybe String
    , apiServer: Maybe String
    , error: Maybe String
    , processing: Bool
    }


create: Maybe String -> Maybe String -> Model
create dbUrl apiServer =
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
   let  dbUrl = case model.dbUrl of
            Just dbUrl -> dbUrl
            Nothing -> ""
        
        apiServer = case model.apiServer of
            Just apiServer -> apiServer
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
                        ,value dbUrl
                        ] []
                 ]
            ,div []
                 [label [labelStyle] [text "API server"]
                 ,input [type' "text"
                        ,placeholder "api server"
                        ,textStyle
                        ,value apiServer
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





update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    let _ = Debug.log "In Settings.update" "here..."
    in
    case msg of
        ChangeDbUrl dbUrl ->
            ({model | dbUrl = Just dbUrl}, Nothing)
        ChangeApiServer apiServer ->
            ({model | apiServer = Just apiServer}, Nothing)
        ClickedConnect ->
            ({ model | error = Nothing
                ,processing = True
            }
            , Just (ApplySettings model))
        ClickedCloseWindow ->
            ( model, Just CloseWindow)
        DbConnectionTested ->
            ({model | error = Nothing
                ,processing = False
            }
            , Nothing)
        DbConnectionTestError ->
            ( {model | error =
                Just "Error connecting to database" 
                , processing = False
              }
            , Nothing)
        NetworkError ->
            ({model | error =
                Just "Unable to connect to api server"
                , processing = False
              }
            , Nothing)
