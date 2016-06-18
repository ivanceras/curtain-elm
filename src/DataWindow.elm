module DataWindow exposing (..)

import Html.App as App
import Html exposing (..)
import Json.Decode as Decode exposing ((:=))
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Tab
import Field
import Row
import Update.Extra.Infix exposing ((:>))


type alias Model =
    { name: String
    , mainTab: Tab.Model
    , presentation: Field.Presentation
    , mode: Field.Mode
    , isActive: Bool
    , extTabs: List Tab.Model
    , hasManyMergedTabs: List Tab.Model
    , windowId: Int
    , includeRelatedData: Bool -- whether to include /exclude related data
    , nextTabId: Int
    , mainTableHeight: Int
    , detailTableHeight: Int
    }

defaultMainTableHeight = 600
defaultFormRecordHeight = 200
defaultDetailTableHeight = 200

create: Window -> Int -> Model
create window windowId =
    { presentation = Field.Table
    , mode = Field.Read
    , isActive = True
    , extTabs = []
    , hasManyMergedTabs = []
    , name = window.name
    , windowId = windowId
    , mainTab = Tab.create window.mainTab 0 defaultMainTableHeight
    , includeRelatedData = True
    , nextTabId = 0
    , mainTableHeight = defaultMainTableHeight
    , detailTableHeight = defaultDetailTableHeight
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateTab Tab.Msg
    | WindowDetailReceived Window
    | WindowDataReceived (List TableDao)
    | LookupTabsReceived (List Tab.Tab)
    | LookupDataReceived (List Field.LookupData)
    | ActivateWindow
    | DeactivateWindow
    | OpenHasManyTab String
    | FocusedRecordDataReceived Int (List TableDao)
    
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


view: Model -> Html Msg
view model = 
    if model.isActive then
        div [style [("height", "800px")
                   ]
            ] 
               [div [class "master-container"
                    ]
                    [App.map UpdateTab(Tab.view model.mainTab)
                    ,(if model.includeRelatedData then
                        extensionTabView model
                     else
                        text ""
                     )
                    ]
                 ,div [class "related-container"
                      ]
                     (if model.includeRelatedData then
                        [hasManyTabView model]
                     else
                        []
                     )
               ]
                              
    else text ""

extensionTabView: Model -> Html Msg
extensionTabView model =
    if model.presentation == Field.Form then
        div [] 
            <| 
            [text "extension tab here.."
            ]
             ++
             List.map (
                    \ext ->
                        div [] 
                            [text ext.tab.name
                            ,App.map UpdateTab (Tab.view ext)
                            ]
                ) model.extTabs
            
    else
        div [] [text "extenstion not displayed"]


hasManyTabView: Model -> Html Msg
hasManyTabView model =
    if model.presentation == Field.Form then
        div [] 
            [text "has many tabs here.."
            ,div [class "tab-group has-many"] 
                 <| List.map (
                    \tab ->
                        div [classList [("tab-item has-many",True)
                                       ,("active", tab.isOpen)
                                       ]
                            ,onClick (OpenHasManyTab tab.tab.table)
                            ][text tab.tab.name]
                 ) model.hasManyMergedTabs

            ,div []
             <| List.map (
                    \tab ->
                        div [] 
                            [App.map UpdateTab (Tab.view tab)
                            ]
                 ) model.hasManyMergedTabs
            ]
    else
        div [] [text "has many tabs not displayed"]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    let _ = Debug.log "window_msg" msg
    in
    case msg of 
        UpdateTab tab_msg ->
            let _ = Debug.log "tab_msg" tab_msg
            in
            case tab_msg of
                Tab.ChangePresentation presentation ->
                    ({model | presentation = presentation}
                        |> updateMainTab tab_msg
                        |> updateAllMergedTab tab_msg
                        |> updateAllocatedHeight
                    , Cmd.none
                    ) 

                Tab.UpdateRow rowId rowMsg ->
                    case rowMsg of
                        Row.ChangePresentation presentation ->
                            let _ = Debug.log "Window: Changing presentation to " presentation
                            in
                            ({model | presentation = presentation}
                               |> updateMainTab tab_msg
                               |> updateAllocatedHeight
                            , Cmd.none)

                        _ ->
                            (updateMainTab tab_msg model, Cmd.none)
                
                Tab.FormRecordClose ->
                    ({model | presentation = Field.Table}
                        |> updateMainTab tab_msg
                        |> updateAllocatedHeight
                    , Cmd.none)
                _ ->
                    (updateMainTab tab_msg model, Cmd.none)
        
        WindowDetailReceived window ->
            (updateWindow window model
            ,Cmd.none
            )

        WindowDataReceived listTableDao ->
            (case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        updateMainTab (Tab.TabDataReceived tableDao.daoList) model
                    Nothing -> model 
            ,Cmd.none
            )

        ChangeMode mode ->
            ({model | mode = mode}, Cmd.none)

        ChangePresentation presentation ->
            let _ = Debug.log "Window presentation chaned to" presentation
            in
            ({model | presentation = presentation}
                |> updateAllocatedHeight
            , Cmd.none
            )

        ActivateWindow ->
            ({model | isActive = True}, Cmd.none)

        DeactivateWindow ->
            ({model | isActive = False}, Cmd.none)

        LookupTabsReceived tabList ->
            (updateMainTab (Tab.LookupTabsReceived tabList) model, Cmd.none)
        LookupDataReceived lookupDataList ->
            (updateMainTab (Tab.LookupDataReceived lookupDataList) model, Cmd.none)

        OpenHasManyTab table ->
            (updateAllMergedTab Tab.Close model
                |> updateHasManyMergedTab Tab.Open table
            , Cmd.none)

        FocusedRecordDataReceived rowId tableDaoList ->
           (hydrateAllMergedTab tableDaoList model
                |> openFirstMergedTab
           , Cmd.none)


updateAllocatedHeight: Model -> Model
updateAllocatedHeight model =
    case model.presentation of
        Field.Form ->
            let _ = Debug.log "Form change height" "hello"
            in
            updateMainTab (Tab.ChangeAllocatedHeight defaultFormRecordHeight) model
        Field.Table ->
            updateMainTab (Tab.ChangeAllocatedHeight defaultMainTableHeight) model

        _ -> model

getTableDao: List TableDao -> Tab.Tab -> Maybe TableDao
getTableDao tableDaoList tab =
    List.filter (
        \tableDao ->
           Tab.completeTableName tab == tableDao.table
            
    )tableDaoList
        |> List.head

hydrateAllMergedTab: List TableDao -> Model -> Model
hydrateAllMergedTab tableDaoList model =
    {model | hasManyMergedTabs =
        List.map(
            \tab ->
               case getTableDao tableDaoList tab.tab of
                    Just tableDao ->
                        let (updatedTab, _) = Tab.update (Tab.TabDataReceived tableDao.daoList) tab
                        in updatedTab
                    Nothing -> 
                        tab
        ) model.hasManyMergedTabs
    }

openFirstMergedTab: Model -> Model
openFirstMergedTab model =
    { model | hasManyMergedTabs =
        case List.head model.hasManyMergedTabs of
            Just head ->
                let (updatedTab,_) = Tab.update Tab.Open head
                in updatedTab :: 
                    case List.tail model.hasManyMergedTabs of
                        Just tail -> tail
                        Nothing -> []

            Nothing ->
                model.hasManyMergedTabs 
            
    }

--direct and indirect, whereever table matches
updateHasManyMergedTab: Tab.Msg -> String -> Model -> Model
updateHasManyMergedTab tabMsg  table model =
    {model | hasManyMergedTabs =
        List.map (\tab ->
            if tab.tab.table == table then
                let (updatedTab,_) = Tab.update tabMsg tab
                in updatedTab
            else
                tab
        ) model.hasManyMergedTabs
    }

updateAllMergedTab: Tab.Msg -> Model -> Model
updateAllMergedTab tabMsg model =
    { model | hasManyMergedTabs =
        List.map (
            \tab ->
                let (updatedTab, _) = Tab.update tabMsg tab
                in updatedTab
        ) model.hasManyMergedTabs
    }



updateMainTab: Tab.Msg -> Model -> Model
updateMainTab tabMsg model =
    let (updatedMainTab, cmd) = Tab.update tabMsg model.mainTab
    in
    {model | mainTab = updatedMainTab}


updateWindow: Window -> Model -> Model
updateWindow window model =
    {model | mainTab = Tab.create window.mainTab model.nextTabId model.mainTableHeight
    ,extTabs = 
        List.map(
            \ext ->
               Tab.create ext model.nextTabId model.mainTableHeight
        ) window.extTabs
    ,hasManyMergedTabs =
        List.map(
            \tab -> 
                let tabModel = Tab.create tab model.nextTabId model.detailTableHeight
                in {tabModel | isOpen = False}
        ) (window.hasManyTabs ++ window.hasManyIndirectTabs)
    }


getMainTabFocusedRow: Model -> Int -> Maybe Row.Model
getMainTabFocusedRow model rowId =
    Tab.getRow model.mainTab rowId
    
    
