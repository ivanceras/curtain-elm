module Window exposing (..)

import Html.App as App
import Html exposing (..)
import Json.Decode as Decode exposing ((:=))

import Tab
import Field
import Row


type alias Model =
    { name: String
    , main_tab: Tab.Model
    , presentation: Field.Presentation
    , mode: Field.Mode
    , is_open: Bool
    , ext_tabs: List Tab.Model
    , has_many_tabs: List Tab.Model
    , has_many_indirect_tabs: List Tab.Model
    , window_id: Int
    }


create: Window -> Int -> Model
create window window_id =
    { empty | name = window.name
    , window_id = window_id
    , main_tab = Tab.create window.main_tab
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateMainTab Tab.Msg
    | WindowDetailReceived Window
    | WindowDataReceived (List TableDao)
    
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

type alias TableDao =
    { table: String
    , dao_list: List Row.DaoState
    }

table_dao_decoder =
    Decode.object2 TableDao
        ("table" := Decode.string)
        ("dao_list" := Decode.list Row.dao_state_decoder)



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

empty =
    { name = ""
    , main_tab = Tab.empty
    , presentation = Field.Form
    , mode = Field.Read
    , is_open = True
    , ext_tabs = []
    , has_many_tabs = []
    , has_many_indirect_tabs = []
    , window_id = 0
    }


init: (Model, Cmd Msg)
init = (empty, Cmd.none)

view: Model -> Html Msg
view model = 
    div [] [ text (model.name ++ (toString model.window_id))
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
        
        WindowDetailReceived window ->
            let _ = Debug.log "Window got: " window.table
                (mo, cmd) = Tab.update (Tab.TabReceived window.main_tab) 
                                    model.main_tab 
                -- include the ext_tabs, has_many_tabs, has_many_indirect_tabs
            in
            ({model | main_tab = mo}
            ,Cmd.none
            )

        WindowDataReceived list_table_dao ->
            let _ = Debug.log "Window data received" (List.length list_table_dao)
                main_tab = case (List.head list_table_dao) of
                    Just table_dao -> 
                        let (mo, cmd) = Tab.update (Tab.TabDataReceived table_dao.dao_list) model.main_tab
                        in mo
                    Nothing -> model.main_tab 
            in
            ({model | main_tab = main_tab}, Cmd.none)

        ChangeMode mode ->
            (model, Cmd.none)

        ChangePresentation presentation ->
            (model, Cmd.none)

