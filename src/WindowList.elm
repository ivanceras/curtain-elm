module WindowList exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing ((:=))

type alias Model =
    { windowList: List WindowName
    , searchText: String
    , activeWindow: Maybe String
    }
    

type alias WindowName =
    { name: String
    , description: Maybe String
    , table: String
    , schema: Maybe String
    }


type Msg
    = WindowSelected String
    | WindowListReceived (List WindowName)
    | UpdateActivated String

type OutMsg = LoadWindow String


empty =
    { windowList = []
    , searchText = ""
    , activeWindow = Nothing
    }


view: Model -> Html Msg
view model =
    nav [class "nav-group"]
        (h5 [class "nav-group-title"]
            [if List.length model.windowList > 0 then
                text "Window"
             else text "" 
            ] ::
            (List.map(\w ->
                let isActive =
                    case model.activeWindow of
                        Just activeWindow ->
                            activeWindow == w.table
                        Nothing -> False
                in
                a [classList [("nav-group-item", True),("active", isActive)]
                  , href ("#"++w.table)
                  , onClick (WindowSelected w.table)
                  ] 
                      [ span [class "icon icon-list"] []
                      , text w.name
                      ]
                ) model.windowList
            )
        )



update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    case msg of
        WindowListReceived windowList ->
            ({model | windowList = windowList}
            , Nothing
            )
        WindowSelected table -> 
            (model, Just (LoadWindow table))

        UpdateActivated table ->
            ({model | activeWindow = Just table}, Nothing)
 

windowNameDecoder =
    Decode.object4 WindowName
    ("name" := Decode.string)
    (Decode.maybe ("description" := Decode.string))
    ("table" := Decode.string)
    (Decode.maybe ("schema" := Decode.string))

windowListDecoder =
    Decode.list windowNameDecoder
