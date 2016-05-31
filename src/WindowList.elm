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


to_model: List WindowName -> Model
to_model window_list =
    { window_list = window_list
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
    (model, Cmd.none)
 

window_name_decoder =
    Decode.object4 WindowName
    ("name" := Decode.string)
    (Decode.maybe ("description" := Decode.string))
    ("table" := Decode.string)
    (Decode.maybe ("schema" := Decode.string))

window_list_decoder =
    Decode.list window_name_decoder
