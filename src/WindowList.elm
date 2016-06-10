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
    = LoadWindow String
    | WindowListReceived (List WindowName)
    | UpdateActivated String


empty =
    { windowList = []
    , searchText = ""
    , activeWindow = Nothing
    }


view: Model -> Html Msg
view model =
    nav [class "nav-group"]
        (h5 [class "nav-group-title"][text "Window"] ::
            (List.map(\w ->
                let isActive =
                    case model.activeWindow of
                        Just activeWindow ->
                            activeWindow == w.table
                        Nothing -> False
                in
                a [classList [("nav-group-item", True),("active", isActive)]
                  , href ("#"++w.table)
                  , onClick (LoadWindow w.table)
                  ] 
                      [ span [class "icon icon-list"] []
                      , text w.name
                      ]
                ) model.windowList
            )
        )



update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        WindowListReceived windowList ->
            ({model | windowList = windowList}
            , Cmd.none
            )
        LoadWindow table -> -- will be caught by the main app
            let _ = Debug.log "did it opened" table
            in
            (model, Cmd.none)

        UpdateActivated table ->
            ({model | activeWindow = Just table}, Cmd.none)
 

windowNameDecoder =
    Decode.object4 WindowName
    ("name" := Decode.string)
    (Decode.maybe ("description" := Decode.string))
    ("table" := Decode.string)
    (Decode.maybe ("schema" := Decode.string))

windowListDecoder =
    Decode.list windowNameDecoder
