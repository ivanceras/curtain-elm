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
    | LookupTabsReceived (List Tab.Tab)
    | LookupDataReceived (List Field.LookupData)
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
                 ,extensionTabView model
                 ,hasManyTabView model
               ]
    else div[] []

extensionTabView: Model -> Html Msg
extensionTabView model =
    if model.presentation == Field.Form then
        div [] [text "extension tab here.."]
    else
        div [] [text "extenstion not displayed"]


hasManyTabView: Model -> Html Msg
hasManyTabView model =
    if model.presentation == Field.Form then
        (div [] [text "has_many tabs here.. direct and indirect"])
    else
        div [] [text "extenstion not displayed"]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of 
        UpdateMainTab tab_msg ->
            let _ = Debug.log "tab_msg" tab_msg
            in
            case tab_msg of
                Tab.ChangePresentation presentation ->
                    let model = {model | presentation = presentation}
                    in
                    (updateTab tab_msg model, Cmd.none)

                Tab.UpdateRow rowId rowMsg ->
                    case rowMsg of
                        Row.ChangePresentation presentation ->
                            let model = {model | presentation = presentation}
                            in
                            (updateTab tab_msg model, Cmd.none)
                        _ ->
                            (updateTab tab_msg model, Cmd.none)
                
                _ ->
                    (updateTab tab_msg model, Cmd.none)
        
        WindowDetailReceived window ->
            -- TODO: include the extTabs, hasManyTabs, hasManyIndirectTabs
            (updateTab (Tab.TabReceived window.mainTab) model 
            ,Cmd.none
            )

        WindowDataReceived listTableDao ->
            (case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        updateTab (Tab.TabDataReceived tableDao.daoList) model
                    Nothing -> model 
            ,Cmd.none
            )

        ChangeMode mode ->
            ({model | mode = mode}, Cmd.none)

        ChangePresentation presentation ->
            ({model | presentation = presentation}, Cmd.none)

        ActivateWindow ->
            ({model | isActive = True}, Cmd.none)

        DeactivateWindow ->
            ({model | isActive = False}, Cmd.none)

        LookupTabsReceived tabList ->
            (updateTab (Tab.LookupTabsReceived tabList) model, Cmd.none)
        LookupDataReceived lookupDataList ->
            (updateTab (Tab.LookupDataReceived lookupDataList) model, Cmd.none)


updateTab: Tab.Msg -> Model -> Model
updateTab tab_msg model =
    let (updatedMainTab, cmd) = Tab.update tab_msg model.mainTab
    in
    {model | mainTab = updatedMainTab}
