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
import Presentation exposing 
    (Presentation (Table, Form, Grid)
    ,Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing (TableDao)
import Mouse


type alias Model =
    { name: String
    , mainTab: Tab.Model
    , presentation: Presentation
    , mode: Mode
    , isActive: Bool
    , extTabs: List Tab.Model
    , hasManyMergedTabs: List Tab.Model
    , windowId: Int
    , nextTabId: Int
    , mainTableHeight: Int
    , detailTableHeight: Int
    , browserDimension: Tab.BrowserDimension
    }

defaultFormRecordHeight = 200

generateTabId: Window -> Int -> String
generateTabId window windowId =
    (window.table++"["++(toString windowId)++"]")

create: Window -> Int -> Model
create window windowId =
    { presentation = Table
    , mode = Read
    , isActive = True
    , extTabs = []
    , hasManyMergedTabs = []
    , name = window.name
    , windowId = windowId
    , mainTab = Tab.create window.mainTab (generateTabId window windowId) 0
    , nextTabId = 0
    , mainTableHeight = 0
    , detailTableHeight = 0
    , browserDimension = Tab.defaultBrowserDimension
    }

type Msg
    = ChangeMode Mode
    | ChangePresentation Presentation
    | UpdateTab Tab.Msg
    | WindowDetailReceived Window
    | WindowDataReceived (List TableDao)
    | LookupTabsReceived (List Tab.Tab)
    | LookupDataReceived (List Field.LookupData)
    | ActivateWindow
    | DeactivateWindow
    | OpenHasManyTab String
    | FocusedRecordDataReceived Int (List TableDao)
    | BrowserDimensionChanged Tab.BrowserDimension
    | ToggleExtTab Tab.Model
    | WindowDataNextPageReceived (List TableDao)
    | ReceivedScrollBottomEvent String 
    | ResizeStart Mouse.Position
    
type OutMsg = WhateverMainNeeds
    
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

calcTotalHeight model =
    let windowHeightDeductions = 100 --window tabs and footer
    in
    model.browserDimension.height - windowHeightDeductions

subscription: Sub Msg
subscription =
    let _ = Debug.log "subscriptions in Datawindow" "wohoo"
    in Sub.batch []

view: Model -> Html Msg
view model = 
    let display = if model.isActive then "block" else "none"
    in
    div [class "data_window_view"
        ,style [("height", (toString (calcTotalHeight model))++"px")
                ,("display", display)
               ]
        ] 
                [toolbar model
                ,case model.presentation of
                    
                    Form ->
                        div[class "master-container"
                           ] 
                            [formRecordControls model
                            ,div [style [("height", "400px")
                                    ,("overflow", "auto")
                                    ,("display", "block")
                                    ,("padding", "20px")
                                    ]
                                ]
                                [App.map UpdateTab(Tab.view model.mainTab) -- when in form view, main tab and extension table are in 1 scrollable container
                                ,extensionTabView model
                                ]
                             ,separator
                             ,div [class "related-container"
                                  ,style [("margin-top", "30px")
                                         ]
                                  ]
                                  [hasManyTabView model]
                            ]
                    Table ->
                        App.map UpdateTab(Tab.view model.mainTab) -- when in form view, main tab and extension table are in 1 scrollable container
                    Grid ->
                        App.map UpdateTab(Tab.view model.mainTab) 
                ]


onMouseDown : Attribute Msg
onMouseDown =
  on "mousedown" (Decode.map ResizeStart Mouse.position)                             

separator = 
     div [class "separator"
          ,style [("border", "1px solid #cf9")
                 ,("height", "10px")
                 ,("cursor", "ns-resize")
                 ]
          ,onMouseDown 
          ] []

extensionTabView: Model -> Html Msg
extensionTabView model =
    div [] 
        <| 
         List.map (
                \ext ->
                    div [] 
                        [div [style [("margin-top", "30px")
                                    ,("border-bottom", "2px solid #ccc")
                                    ,("font-size", "1em")
                                    ,("font-weight", "bold")
                                    ,("width", "90%")
                                    ]
                             ,onClick (ToggleExtTab ext)
                             ] 
                             [span [classList [("icon icon-text", True)
                                                ,("icon-right-dir", not ext.isOpen)
                                                ,("icon-down-dir", ext.isOpen)
                                                ]
                                   ] []
                             ,text (" "++ext.tab.name)]
                        ,App.map UpdateTab (Tab.view ext)
                        ]
            ) model.extTabs
            


formRecordControls model =
    div [class "btn-group"]
        [button [class "btn btn-large btn-default"]
            [span [class "icon icon-text icon-left-open"] []
            ,text "Prev"
            ]
        ,button [class "btn btn-large btn-default"]
            [span [class "icon icon-text icon-right-open"] []
            ,text "Next"
            ]
        ,button [class "btn btn-large btn-default"]
            [span [class "icon icon-text icon-resize-full"] []
            ,text "Maximize"
            ]
        ,button [class "btn btn-large btn-default", onClick (UpdateTab Tab.FormRecordClose)]
            [span [class "icon icon-text icon-cancel"] []
            ,text "Close"
            ]
        ]

toolbar: Model ->Html Msg
toolbar model= 
    let deleteTooltip = 
        case model.presentation of
            Table ->
                "Click to delete record(s) from the database"
            _ ->
                "Click to delete this record from the database"
    in    
        div [class "btn-group"]
            [button [class "btn btn-large btn-default tooltip"]
                [span [class "icon icon-plus icon-text tab-action"] []
                ,text "New record" 
                ,span [class "tooltiptext"] [text "Create a new record in a form"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick (ChangeMode Read)]
                [span [class "icon icon-list-add icon-text"] []
                ,text "Insert row"
                ,span [class "tooltiptext"] [text "Insert row"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick (ChangeMode Read)]
                [span [class "icon icon-floppy icon-text"] []
                ,text "Save"
                ,span [class "tooltiptext"] [text "Save record into the database"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick (ChangePresentation Table)]
                [span [class "icon icon-block icon-text"] []
                ,text "Cancel" 
                ,span [class "tooltiptext"] [text "Cancel changes and return to the last saved state"]
                ]
            ,button [class "btn btn-large btn-default tooltip"]
                [span [class "icon icon-trash icon-text"] []
                ,text "Delete"
                ,span [class "tooltiptext"] [text deleteTooltip] 
                ]
            ,button [class "btn btn-large btn-default tooltip"]
                [span [class "icon icon-arrows-ccw icon-text"] []
                ,text "Refresh"
                ,span [class "tooltiptext"] [text "Refresh the current data from the database"]
                ]
            ,button [class "btn btn-large btn-default tooltip"]
                [span [class "icon icon-export icon-text"] []
                ,text "Export"
                ,span [class "tooltiptext"] [text "Export to spreadsheet"]
                ]
            ]
 

hasManyTabView: Model -> Html Msg
hasManyTabView model =
    if List.length model.hasManyMergedTabs > 0 then
        div [] 
            [div [class "tab-group has-many"] 
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
        text ""

update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    case msg of 
        UpdateTab tab_msg ->
            let _ = Debug.log "Update tab" tab_msg
            in
            case tab_msg of
                Tab.ChangePresentation presentation ->
                    ({model | presentation = presentation}
                        |> updateMainTab tab_msg
                        |> updateAllMergedTab tab_msg
                        |> updateAllocatedHeight
                    , Nothing
                    ) 

                Tab.UpdateRow rowId rowMsg ->
                    case rowMsg of
                        Row.ChangePresentation presentation ->
                            let _ = Debug.log "Window: Changing presentation to " presentation
                            in
                            ({model | presentation = presentation}
                               |> updateMainTab tab_msg
                               |> updateAllocatedHeight
                            , Nothing)

                        Row.EditRecordInForm ->
                            ({model | presentation = Form}
                               |> updateMainTab tab_msg
                               |> updateAllocatedHeight
                            , Nothing)

                        _ ->
                            (updateMainTab tab_msg model, Nothing)
                Tab.FormRecordClose ->
                    ({model | presentation = Table}
                        |> updateMainTab tab_msg
                        |> updateAllocatedHeight
                    , Nothing)
                

                _ ->
                    (updateMainTab tab_msg model, Nothing)
        
        WindowDetailReceived window ->
            (updateWindow window model
            ,Nothing
            )

        WindowDataReceived listTableDao ->
            (case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        updateMainTab (Tab.TabDataReceived tableDao) model
                    Nothing -> model 
            ,Nothing
            )

        ChangeMode mode ->
            ({model | mode = mode}, Nothing)

        ChangePresentation presentation ->
            ({model | presentation = presentation}
                |> updateAllocatedHeight
            , Nothing
            )

        ActivateWindow ->
            ({model | isActive = True}, Nothing)

        DeactivateWindow ->
            ({model | isActive = False}, Nothing)

        LookupTabsReceived tabList ->
            (updateMainTab (Tab.LookupTabsReceived tabList) model, Nothing)
        LookupDataReceived lookupDataList ->
            (updateMainTab (Tab.LookupDataReceived lookupDataList) model, Nothing)

        OpenHasManyTab table ->
            (updateAllMergedTab Tab.Close model
                |> updateHasManyMergedTab Tab.Open table
            , Nothing)

        FocusedRecordDataReceived rowId tableDaoList ->
           (hydrateAllMergedTab tableDaoList model
                |> openFirstMergedTab
           , Nothing)

        BrowserDimensionChanged browserDimension ->
            ( {model | browserDimension = browserDimension}
                |> updateAllTabs (Tab.BrowserDimensionChanged browserDimension)
                |> updateAllocatedHeight
            , Nothing)
        
        ToggleExtTab tab ->
            (updateExtTab Tab.Toggle tab model
            ,Nothing
            )

        WindowDataNextPageReceived listTableDao ->
            (case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        updateMainTab (Tab.TabDataNextPageReceived tableDao) model
                    Nothing -> model 
            ,Nothing
            )
        
        ReceivedScrollBottomEvent table ->
           (updateMainTab Tab.ReceivedScrollBottomEvent model, Nothing)

        ResizeStart xy ->
            let _ = Debug.log "Starting resize.." xy in
            (model, Nothing)

updateAllTabs: Tab.Msg -> Model -> Model
updateAllTabs tabMsg model =
    updateMainTab tabMsg model
        |> updateAllExtTab tabMsg
        |> updateAllMergedTab tabMsg

updateAllExtTab: Tab.Msg -> Model -> Model
updateAllExtTab tabMsg model =
    {model | extTabs = 
        List.map (
            \tab ->
                let (updatedTab, _) = Tab.update tabMsg tab
                in updatedTab
        ) model.extTabs
    }

updateExtTab: Tab.Msg -> Tab.Model -> Model -> Model
updateExtTab tabMsg tabModel model=
    {model | extTabs = 
        List.map (
            \tab ->
                if tab == tabModel then
                    let (updatedTab, _) = Tab.update tabMsg tab
                    in updatedTab
                else
                    tab
        ) model.extTabs
    }

calcMainTableHeight model = 
    let heightDeductions = 400
    in
    model.browserDimension.height - heightDeductions


updateAllocatedHeight: Model -> Model
updateAllocatedHeight model =
    case model.presentation of
        Form ->
            updateMainTab (Tab.ChangeAllocatedHeight defaultFormRecordHeight) model
        Table ->
            updateMainTab (Tab.ChangeAllocatedHeight (calcMainTableHeight model)) model

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
                        let (updatedTab, _) = 
                            Tab.update (Tab.TabDataReceived tableDao) tab
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
    {model | mainTab = Tab.create window.mainTab (generateTabId window model.windowId) model.mainTableHeight
    ,extTabs = 
        List.map(
            \ext ->
               let extModel = Tab.create ext (generateTabId window model.windowId) 100
               in {extModel | presentation = Form}
        ) window.extTabs
    ,hasManyMergedTabs =
        List.map(
            \tab -> 
                let tabModel = Tab.create tab (generateTabId window model.windowId) model.detailTableHeight
                in {tabModel | isOpen = False}
        ) (window.hasManyTabs ++ window.hasManyIndirectTabs)
    }


getMainTabFocusedRow: Model -> Int -> Maybe Row.Model
getMainTabFocusedRow model rowId =
    Tab.getRow model.mainTab rowId
    
    
