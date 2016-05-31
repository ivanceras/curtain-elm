module Window exposing (..)

import Html.App as App
import Html exposing (..)
import Json.Decode as Decode exposing ((:=))

import Tab
import Field


type alias Model =
    { name: String
    , main_tab: Tab.Model
    , presentation: Field.Presentation
    , mode: Field.Mode
    , is_open: Bool
    , ext_tabs: List Tab.Model
    , has_many_tabs: List Tab.Model
    , has_many_indirect_tabs: List Tab.Model
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateMainTab Tab.Msg
    

type alias Window =
    { name: String
    , description: Maybe String
    , table: String
    , schema: Maybe String
    , main_tab: Tab.Tab
    , ext_tabs: List Tab.Tab
    , has_many_tabs: List Tab.Tab
    , has_many_indirect_tabs: List Tab.Tab
    }

to_model: Window -> Model
to_model window =
    { name = window.name
    , main_tab = Tab.to_model window.main_tab
    , presentation = Field.Form
    , mode = Field.Read
    , is_open = False
    , ext_tabs = []
    , has_many_tabs = []
    , has_many_indirect_tabs = []
    }


window_decoder =
    Decode.object8 Window
        ("name" := Decode.string)
        (Decode.maybe ("description" := Decode.string))
        ("table" := Decode.string)
        (Decode.maybe ("schema" := Decode.string))
        ("main_tab":= Tab.tab_decoder)
        ("ext_tabs" := Decode.list Tab.tab_decoder)
        ("has_many_tabs" := Decode.list Tab.tab_decoder)
        ("has_many_indirect_tabs" := Decode.list Tab.tab_decoder)

person_window = 
    { name = "Person Window"
     , main_tab = Tab.person_tab
     , presentation = Field.Form
     , mode = Field.Read
     , is_open = True
     , ext_tabs = []
     , has_many_tabs = []
     , has_many_indirect_tabs = []
     }

init: (Model, Cmd Msg)
init = (person_window, Cmd.none)

view: Model -> Html Msg
view model = 
    div [] [ text model.name
           , App.map UpdateMainTab(Tab.view model.main_tab)
           , text "extension tab here.."
           , text "has_many tabs here.. direct and indirect"
           ]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of 
        UpdateMainTab msg ->
            let (mr,cmd) = Tab.update msg model.main_tab
            in
            ({model | main_tab = mr}, Cmd.none)
        _ ->
            ( model, Cmd.none )

