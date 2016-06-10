module Window exposing (..)

import Html.App as App
import Html exposing (..)
import Json.Decode as Decode exposing ((:=))
import Html.Attributes exposing (..)

import Tab
import Field
import Row


type alias Model =
    { name: String
    , mainTab: Tab.Model
    , presentation: Field.Presentation
    , mode: Field.Mode
    , isActive: Bool
    , extTabs: List Tab.Model
    , hasManyTabs: List Tab.Model
    , hasManyIndirectTabs: List Tab.Model
    , windowId: Int
    }


create: Window -> Int -> Model
create window windowId =
    { empty | name = window.name
    , windowId = windowId
    , mainTab = Tab.create window.mainTab
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateMainTab Tab.Msg
    | WindowDetailReceived Window
    | WindowDataReceived (List TableDao)
    | ActivateWindow
    | DeactivateWindow
    
type alias Window =
    { name: String
    , description: Maybe String
    , table: String
    , schema: Maybe String
    , mainTab: Tab.Tab
    , extTabs: List Tab.Tab
    , hasManyTabs: List Tab.Tab
    , hasManyIndirectTabs: List Tab.Tab
    }

type alias TableDao =
    { table: String
    , daoList: List Row.DaoState
    }

tableDaoDecoder =
    Decode.object2 TableDao
        ("table" := Decode.string)
        ("dao_list" := Decode.list Row.daoStateDecoder)



windowDecoder =
    Decode.object8 Window
        ("name" := Decode.string)
        (Decode.maybe ("description" := Decode.string))
        ("table" := Decode.string)
        (Decode.maybe ("schema" := Decode.string))
        ("main_tab":= Tab.tabDecoder)
        ("ext_tabs" := Decode.list Tab.tabDecoder)
        ("has_many_tabs" := Decode.list Tab.tabDecoder)
        ("has_many_indirect_tabs" := Decode.list Tab.tabDecoder)

empty =
    { name = ""
    , mainTab = Tab.empty
    , presentation = Field.Table
    , mode = Field.Read
    , isActive = True
    , extTabs = []
    , hasManyTabs = []
    , hasManyIndirectTabs = []
    , windowId = 0
    }


init: (Model, Cmd Msg)
init = (empty, Cmd.none)

view: Model -> Html Msg
view model = 
    if model.isActive then
        div [] [
                 App.map UpdateMainTab(Tab.view model.mainTab)
               , div [] [text "extension tab here.."]
               , div [] [text "has_many tabs here.. direct and indirect"]
               ]
    else div[] []

 


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of 
        UpdateMainTab msg ->
            let (mr,cmd) = Tab.update msg model.mainTab
            in
            ({model | mainTab = mr}, Cmd.none)
        
        WindowDetailReceived window ->
            let _ = Debug.log "Window got: " window.table
                (mo, cmd) = Tab.update (Tab.TabReceived window.mainTab) 
                                    model.mainTab 
                -- include the extTabs, hasManyTabs, hasManyIndirectTabs
            in
            ({model | mainTab = mo}
            ,Cmd.none
            )

        WindowDataReceived listTableDao ->
            let _ = Debug.log "Window data received" (List.length listTableDao)
                mainTab = case (List.head listTableDao) of
                    Just tableDao -> 
                        let (mo, cmd) = Tab.update (Tab.TabDataReceived tableDao.daoList) model.mainTab
                        in mo
                    Nothing -> model.mainTab 
            in
            ({model | mainTab = mainTab}, Cmd.none)

        ChangeMode mode ->
            (model, Cmd.none)

        ChangePresentation presentation ->
            (model, Cmd.none)

        ActivateWindow ->
            ({model | isActive = True}, Cmd.none)

        DeactivateWindow ->
            ({model | isActive = False}, Cmd.none)

