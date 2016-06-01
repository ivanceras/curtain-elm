module WindowList exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing ((:=))

type alias Model =
    { window_list: List WindowName
    , search_text: String
    }
    

type alias WindowName =
    { name: String
    , description: Maybe String
    , table: String
    , schema: Maybe String
    }


type Msg
    = OpenWindow String
    | WindowListReceived (List WindowName)


empty =
    { window_list = []
    , search_text = ""
    }


view: Model -> Html Msg
view model =
    nav [class "nav-group"]
        (h5 [class "nav-group-title"][text "Window"] ::
            (List.map(\w ->
                a [ class "nav-group-item"
                  , href ("#"++w.table)
                  , onClick (OpenWindow w.table)
                  ] 
                      [ span [class "icon icon-list"] []
                      , text w.name
                      ]
                ) model.window_list
            )
        )



update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        WindowListReceived window_list ->
            ({model | window_list = window_list}
            , Cmd.none
            )
        OpenWindow table -> -- will be caught by the main app
            let _ = Debug.log "did it opened" table
            in
            (model, Cmd.none)
 

window_name_decoder =
    Decode.object4 WindowName
    ("name" := Decode.string)
    (Decode.maybe ("description" := Decode.string))
    ("table" := Decode.string)
    (Decode.maybe ("schema" := Decode.string))

window_list_decoder =
    Decode.list window_name_decoder
