module DataWindow exposing (..)

import Html.App as App
import Html exposing (..)
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Dict

import Tab
import Field
import Row
import Update.Extra.Infix exposing ((:>))
import Mode exposing 
    ( Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing (TableDao)
import Mouse
import String
import Settings


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
    , alert: Maybe String
    , focusedRow: Maybe Row.Model -- the focused row
    , formHeight: Int
    , formMargin: Int
    , openSequence: Int -- the highest number determine which window last opened
    }



getFilter: Model -> String
getFilter model =
    Tab.getSearchBoxQuery model.mainTab

-- get the url of the data window including the filters and groupby
getFullUrl: Model -> String
getFullUrl model = 
    let table = model.mainTab.tab.table
        filter = getFilter model
        filterUrl  = 
            if not (String.isEmpty filter) then
                "?" ++ filter
            else 
                ""
        url = "#" ++ table ++ filterUrl
    in
        url

generateTabId: Window -> Int -> String
generateTabId window windowId =
    (window.table++"["++(toString windowId)++"]")

create: Window -> Int -> Int -> Model
create window windowId openSequence =
    { presentation = Table
    , mode = Read
    , isActive = False
    , extTabs = []
    , hasManyMergedTabs = []
    , name = window.name
    , windowId = windowId
    , mainTab = Tab.create window.mainTab (generateTabId window windowId) 100 Tab.Table
    , nextTabId = 0
    , mainTableHeight = 0
    , detailTableHeight = 0
    , browserDimension = Tab.defaultBrowserDimension
    , alert = Nothing
    , focusedRow = Nothing
    , formHeight = 200
    , formMargin = 150 -- margin if want to show the table listing
    , openSequence = openSequence 
    }

type Presentation = Table | Grid

{-|The actions in the toolbars, grouped in one type -}
type ToolbarAction = DeleteRecords
    | RefreshRecords
    | SaveChanges
    | CloseAlert
    | ClearFilters


type Msg
    = ChangeMode Mode
    | ChangePresentation Presentation
    | UpdateTab Tab.Msg
    | WindowDetailReceived Window
    | WindowDataReceived (List TableDao)
    | ActivateWindow Int
    | DeactivateWindow
    | OpenHasManyTab String
    | FocusedRecordDataReceived Int (List TableDao)
    | BrowserDimensionChanged Tab.BrowserDimension
    | ToggleExtTab Tab.Model
    | WindowDataNextPageReceived (List TableDao)
    | ReceivedScrollBottomEvent String 
    | ResizeStart Mouse.Position
    | ClickedToolbar ToolbarAction
    | SetAlert String
    | RecordsUpdated (List Dao.UpdateResponse)
    | UpdateFocusedRow Row.Msg
    | UpdateExtensionRow Row.Msg
    | SetFocusRow (Maybe Row.Model)
    | CloseFocusedRow
    | MaximizeForm
    | RestoreSize
    | EditFocusedRow
    | NewRecordInForm
    
type OutMsg = LoadNextPage Tab.Model
    | UpdateRecords String String
    | FocusedRow Row.Model
    | DoRefreshRecords Int String
    | ModifyUrl String
    
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


subscription: Sub Msg
subscription =
    let _ = Debug.log "subscriptions in Datawindow" "wohoo"
    in Sub.batch []

view: Model -> Html Msg
view model = 
    let display = if model.isActive then "block" else "none"
    in
    div [class "data_window_view"
        ,style [("display", display)
               ]
        ] 
                [toolbar model
                ,case model.alert of
                    Just alert ->
                        div [class "alert animated fadeIn"
                            ,style [("height", "70px")]
                            ] 
                            [text alert
                            , button [onClick <| ClickedToolbar CloseAlert] [text "Ok"]
                            ]
                    Nothing ->
                        span [] []

                ,div []
                    [div [style [("position", "absolute")]]
                        [App.map UpdateTab(Tab.view model.mainTab) -- when in form view, main tab and extension table are in 1 scrollable container
                        ]
                    ,formView model
                    ]
                ]


formView model =
    case model.focusedRow of
        Just focusedRow ->
            let 
                formMargin = model.formMargin
                maxFormWidth = (calcMainTableWidth model) - formMargin
                maxFormHeight = calcMainTableHeight model
                mergeTabHeight = 28 + (maxFormHeight - model.formHeight)
                formHeight = if Settings.includeManyTab then
                        model.formHeight
                    else
                        model.formHeight + mergeTabHeight

                _ = Debug.log "focusedRow isNew" (Row.isNew focusedRow)

            in
            div[class "master_container record_detail"
                ,style [("background-color", "#fff")
                       ,("margin-left", (toString formMargin)++"px")
                       ,("width", (toString maxFormWidth)++"px")
                       ,("position","absolute")
                       ]
               ] 
                [formRecordControls model
                ,div [style [("height", (toString formHeight)++"px")
                        ,("overflow", "auto")
                        ,("display", "block")
                        ,("padding", "20px")
                        ]
                    ]
                    [App.map UpdateFocusedRow (Row.view focusedRow)
                    ,if Settings.includeManyTab then
                        extensionRowView model
                     else 
                        text ""
                    ]
                 ,if Settings.includeManyTab then
                    separator 
                  else 
                    text ""
                 ,if Settings.includeManyTab then
                    div [class "related-container"
                      ,style [("height", (toString mergeTabHeight)++"px")
                             ]
                      ]
                      [hasManyTabView model]
                  else
                    text ""
                ]
        Nothing ->
            text ""

onMouseDown : Attribute Msg
onMouseDown =
  on "mousedown" (Decode.map ResizeStart Mouse.position)                             

separator = 
     div [class "separator"
          ,style [("background-color","#ccc")
                 ,("height", "10px")
                 ,("cursor", "ns-resize")
                 ,("text-align", "center")
                 ,("color", "#333")
                 ]
          ,onMouseDown 
          ] 
          [i [class "icon icon-dot-3"
             ,style [("position","absolute")
                    ,("margin-top", "-5px")
                    ]
             ] []
          ]

extensionRowView: Model -> Html Msg
extensionRowView model =
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
                        ,case Tab.firstRow ext of
                            Just firstRow ->
                                let formedFirstRow = 
                                    Row.update (Row.ChangePresentation Row.Form) firstRow
                                        |> fst 
                                in
                                App.map UpdateExtensionRow (Row.view formedFirstRow)
                            Nothing ->
                                App.map UpdateExtensionRow (Row.view <| Tab.newRowInForm ext)
                            
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
        ,button [class "btn btn-large btn-default"
                ,onClick EditFocusedRow
                ]
            [span [class "icon icon-text icon-pencil"] []
            ,text "Edit Record"
            ]
        ,button [class "btn btn-large btn-default"
                ,onClick MaximizeForm
                ]
            [span [class "icon icon-text icon-resize-full"] []
            ,text "Maximize"
            ]
        ,button [class "btn btn-large btn-default"
                ,onClick RestoreSize
                ]
            [span [class "icon icon-text icon-resize-small"] []
            ,text "Restore Size"
            ]
        ,button [class "btn btn-large btn-default", onClick CloseFocusedRow]
            [span [class "icon icon-text icon-cancel"] []
            ,text "Close"
            ]
        ]

toolbar: Model ->Html Msg
toolbar model= 
    let 
        selectedRowCount = Tab.selectedRowCount model.mainTab
        modifiedRowCount = Tab.modifiedRowCount model.mainTab
        insertedRowCount = Tab.insertedRowCount model.mainTab
        dirtyRecordCount = modifiedRowCount + insertedRowCount
        _= case model.focusedRow of
                Just focusedRow ->
                    Debug.log "Record isNew in Toolbar: " (Row.isNew focusedRow)
                Nothing ->
                    False
            

        deleteTooltip = 
            case model.presentation of
                Table ->
                    let
                        records = 
                            if selectedRowCount > 1 then
                                "records"
                            else 
                                "record"
                    in
                        if selectedRowCount == 0 then
                            "No selected records to delete"
                        else
                            "Delete " ++ (toString  selectedRowCount) ++ " " ++ records ++ " from the database"
                _ ->
                    "Delete this record from the database"

        saveTooltip =
           let
                records =
                    if dirtyRecordCount > 1 then
                        "records"
                    else 
                        "record"
            in
                if dirtyRecordCount == 0 then
                    "No changes to save"
                else
                    "Save "++(toString dirtyRecordCount)++" "++records++" into the database"
    in    
        div [class "btn-group", style [("height", "30px")]]
            [button [class "btn btn-large btn-default tooltip"
                    , onClick NewRecordInForm
                    ]
                [span [class "icon icon-plus icon-text tab-action"] []
                ,text "New record" 
                ,span [class "tooltiptext"] [text "Create a new record in a form"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick <| ClickedToolbar SaveChanges
                    , disabled <| dirtyRecordCount == 0
                    ]
                [if dirtyRecordCount > 0 then 
                    span [class "badge badge-changes animated flash"] 
                        [text (toString dirtyRecordCount)]
                 else text ""
                ,span [class "icon icon-floppy icon-text"] []
                ,text "Save"
                ,span [class "tooltiptext"] [text saveTooltip]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick (ChangePresentation Table)]
                [span [class "icon icon-block icon-text"] []
                ,text "Cancel" 
                ,span [class "tooltiptext"] [text "Cancel changes and return to the last saved state"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    , onClick <| ClickedToolbar DeleteRecords
                    , disabled <| selectedRowCount == 0
                    ]
                [if selectedRowCount > 0 then 
                    span [class "badge animated fadeIn"] 
                        [text (toString selectedRowCount)]
                 else text ""
                ,span [class "icon icon-trash icon-text"] 
                      [                      ]
                ,text "Delete"
                ,span [class "tooltiptext"] [text deleteTooltip] 
                ]
            ,button [
                class "btn btn-large btn-default tooltip"
                , onClick <| ClickedToolbar RefreshRecords
                ]
                [span [class "icon icon-arrows-ccw icon-text"] []
                ,text "Refresh"
                ,span [class "tooltiptext"] [text "Refresh the current data from the database"]
                ]
            ,button [class "btn btn-large btn-default tooltip"
                    ,onClick <| ClickedToolbar ClearFilters
                    ]
                [span [class "icon icon-trophy icon-text"] []
                ,text "Clear Filter"
                ,span [class "tooltiptext"] [text "Remove the filters"]
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

update: Msg -> Model -> (Model, List OutMsg)
update msg model =
    case msg of 
        UpdateTab tab_msg ->
            let (model1, outmsg) = updateMainTab tab_msg model
                _ = Debug.log "Tab outmsg" outmsg
            in
                handleTabOutMsg model1 outmsg                 

        UpdateFocusedRow rowMsg ->
            let _ = Debug.log "Updating row" rowMsg
            in
            ({model | focusedRow = 
                case model.focusedRow of
                    Just focusedRow ->
                        Just (Row.update rowMsg focusedRow
                                |> fst
                             )
                    Nothing ->
                        Nothing
             }
            , [])
         
        UpdateExtensionRow rowMsg ->
            (model, [])
                        
        WindowDetailReceived window ->
            (updateWindow window model
            ,[]
            )

        WindowDataReceived listTableDao ->
            case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        let (model1, outmsg) = updateMainTab (Tab.TabDataReceived tableDao) model
                        in (model1,[])
                    Nothing -> (model, [])

        ChangeMode mode ->
            ({model | mode = mode}, [])

        ChangePresentation presentation ->
            ({model | presentation = presentation}
                |> updateAllocatedHeight
            , []
            )

        ActivateWindow openSequence ->
            ({model | isActive = True
                , openSequence = openSequence
             }, [ModifyUrl (getFullUrl model)])

        DeactivateWindow ->
            ({model | isActive = False}, [])

        OpenHasManyTab table ->
            (updateAllMergedTab Tab.Close model
                |> updateHasManyMergedTab Tab.Open table
            , [])

        FocusedRecordDataReceived rowId tableDaoList ->
           (hydrateExtensionTab tableDaoList model
                |> hydrateAllMergedTab tableDaoList
                |> openFirstMergedTab
           , [])

        BrowserDimensionChanged browserDimension ->
            ( {model | browserDimension = browserDimension}
                |> updateAllTabs (Tab.BrowserDimensionChanged browserDimension)
                |> updateAllocatedHeight
            , [])
        
        ToggleExtTab tab ->
            (updateExtTab Tab.Toggle tab model
            ,[]
            )

        WindowDataNextPageReceived listTableDao ->
            case (List.head listTableDao) of --TODO: get the main tab
                    Just tableDao -> 
                        let (model1, outmsg) = 
                            updateMainTab (Tab.TabDataNextPageReceived tableDao) model
                        in (model1, [])
                    Nothing -> (model, []) 
        
        ReceivedScrollBottomEvent table ->
           let (model1, outmsg) =
                updateMainTab Tab.ReceivedScrollBottomEvent model
               _ = Debug.log "ReceivedScroll Tab outmsg" outmsg
           in
                handleTabOutMsg model1 outmsg

        ResizeStart xy ->
            let _ = Debug.log "Starting resize.." xy in
            (model, [])

        ClickedToolbar toolbarAction ->
            case toolbarAction of
                DeleteRecords ->
                    let _ = Debug.log "Deleting records" ""
                        selectedDao = getSelectedOrigRecords model
                        table = model.mainTab.tab.table
                        changeset = Dao.deletedChangeset table selectedDao False
                        encoded = Encode.encode 0 (Dao.changeSetListEncoder changeset)
                        _ = Debug.log "selected rows" encoded
                    in 
                    (model, [UpdateRecords table encoded])

                RefreshRecords ->
                    let _  = Debug.log "Refreshing records" ""
                    in
                    (model, [DoRefreshRecords model.windowId model.mainTab.tab.table])

                 -- updated and inserted records
                SaveChanges ->
                    let _ = Debug.log "Saving changes" ""
                        updatedDao = getUpdatedRecords model
                        insertedDao = getInsertedRecords model
                        table = model.mainTab.tab.table
                        changeset = Dao.forSaveChangeset table updatedDao insertedDao 
                        encoded = Encode.encode 0 (Dao.changeSetListEncoder changeset)
                        _ = Debug.log "For save" encoded
                     in 
                        (model, [UpdateRecords table encoded])

                CloseAlert ->
                    ( {model | alert = Nothing}
                        |> updateAllocatedHeight
                    , []
                    )
                ClearFilters ->
                    let _ = Debug.log "clearing filters" ""
                    in
                    updateMainTabThenHandleOutMsg Tab.ClearFilters model
        
        SetAlert alert ->
            ({ model | alert = Just alert }
             , []
            )
        
        RecordsUpdated updateResponse ->
            let _ = Debug.log "records updated" updateResponse
                mainResponse = 
                    List.filter (
                        \ur ->
                            let _ = Debug.log ("update: "++ur.table) model.mainTab.tab
                            in
                            Tab.completeTableName model.mainTab.tab == ur.table
                    ) updateResponse
                        |> List.head
            in
            case mainResponse of
                Just mainResponse ->
                    let
                        error = getError mainResponse
                        model1 = { model | alert = error } 
                                    |> updateAllocatedHeight
                        (model2, outmsg) =
                            updateMainTab (Tab.RecordsUpdated mainResponse) model1
                    in
                        handleTabOutMsg model2 outmsg
                Nothing ->
                    ( model,  
                    --[FIXME] No need to refresh record when the insert, update, and delete 
                    --updates their corresponding records well
                    [DoRefreshRecords model.windowId model.mainTab.tab.table]
                    )
         
        -- update the focused row in the main tab from here
        SetFocusRow row ->
            ({ model | focusedRow = row }
            ,case row of
                Just focusedRow ->
                    [FocusedRow focusedRow]
                Nothing ->
                    []
            )
        CloseFocusedRow ->
            case model.focusedRow of
                Just focusedRow ->
                    if Row.isNew focusedRow then
                        ({model | focusedRow = Nothing}
                            |> updateMainTab (Tab.AddRowDao (Row.getDao focusedRow))
                            |> fst
                        ,[])
                    else
                        ({model | focusedRow = Nothing}
                            |> updateMainTab (Tab.UpdateRowDao focusedRow.rowId (Row.getDao focusedRow))
                            |> fst
                            |> updateMainTab (Tab.UpdateRow focusedRow.rowId (Row.ChangeMode Read))
                            |> fst
                        ,[])
                Nothing ->
                    (model, [])
            
        MaximizeForm ->
            ({ model | formHeight = calcMainTableHeight model
                , formMargin = 0
             }
            ,[]
            )
        RestoreSize ->
            ({ model | formMargin = 150
                , formHeight = 2 * (calcMainTableHeight model) // 3
             }
             ,[]
            )
        
        EditFocusedRow ->
            ({ model | focusedRow =
                Maybe.map (
                    \ focusedRow ->
                        Row.update (Row.ChangeMode Edit) focusedRow
                            |> fst
                ) model.focusedRow
             }
             ,[]
            )
        NewRecordInForm ->
            ({ model | focusedRow = Just (Tab.newRowInForm model.mainTab)
             }
             ,[]
            )
            

getError updateResponse =
    let deleteErrorCount = 
        List.length updateResponse.deleteError
    in
        if deleteErrorCount > 0 then
            Just ("There was error deleting "++(toString deleteErrorCount)++" records")
        else
            Nothing

handleTabOutMsg: Model -> List Tab.OutMsg -> (Model, List OutMsg)
handleTabOutMsg model outmsgs =
    List.foldl
        (\outmsg (model1, newout) ->
            case outmsg of
                Tab.LoadNextPage ->
                    ( model1
                    , newout ++ [LoadNextPage model1.mainTab]
                    )
                Tab.FocusRow focusedRow ->
                    case focusedRow of
                        Just focusedRow ->
                            ({model1 | focusedRow =
                                Just (
                                        Row.update (Row.ChangePresentation Row.Form) focusedRow
                                            |> fst
                                    )
                             }
                            , newout ++ [FocusedRow focusedRow]
                            )
                        Nothing -> 
                            ( model1, newout)
                Tab.FilterChanges ->
                    (model, 
                    [ModifyUrl (getFullUrl model)
                    ,DoRefreshRecords model.windowId model.mainTab.tab.table
                    ])

        ) (model, []) outmsgs


getSelectedOrigRecords: Model -> List Dao.Dao
getSelectedOrigRecords model =
    Tab.selectedRows model.mainTab
        |> List.map(
            \r ->
                Row.getOrigDao r
        ) 

getInsertedRecords: Model -> List Dao.DaoInsert
getInsertedRecords model =
    Tab.insertedRows model.mainTab
        |> List.map(
            \r ->
                Row.getDaoInsert r
        )

getUpdatedRecords: Model -> List Dao.DaoUpdate
getUpdatedRecords model =
    Tab.modifiedRows model.mainTab
        |> List.map (
            \r ->
                Row.getDaoUpdate r
        )
        

updateAllTabs: Tab.Msg -> Model -> Model
updateAllTabs tabMsg model =
    updateMainTab tabMsg model |> fst
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
    let 
        heightDeductions = 132
        alertHeight = 
            case model.alert of
                Just alert ->
                    70
                Nothing ->
                    0
    in
    model.browserDimension.height - (heightDeductions + alertHeight)

calcMainTableWidth model =  
    let widthDeductions = 220 
    in
    model.browserDimension.width - widthDeductions

updateAllocatedHeight: Model -> Model
updateAllocatedHeight model =
    updateMainTab (Tab.ChangeAllocatedHeight (calcMainTableHeight model)) model
    |> fst

getTableDao: List TableDao -> Tab.Tab -> Maybe TableDao
getTableDao tableDaoList tab =
    List.filter (
        \tableDao ->
           Tab.completeTableName tab == tableDao.table
            
    )tableDaoList
        |> List.head

hydrateExtensionTab: List TableDao -> Model -> Model
hydrateExtensionTab tableDaoList model =
    { model | extTabs =
        List.map (
            \ext ->
                case Debug.log "Extention table" <| getTableDao tableDaoList ext.tab of
                    Just tableDao ->
                        Tab.update (Tab.TabDataReceived tableDao) ext
                            |> fst
                    Nothing ->
                        ext
        ) model.extTabs
    }

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

updateMainTabThenHandleOutMsg: Tab.Msg -> Model -> (Model, List OutMsg)
updateMainTabThenHandleOutMsg tabMsg model =
    let (model1, outmsg) = updateMainTab tabMsg model
    in handleTabOutMsg model1 outmsg


updateMainTab: Tab.Msg -> Model -> (Model, List Tab.OutMsg)
updateMainTab tabMsg model =
    let (updatedMainTab, outmsg) = Tab.update tabMsg model.mainTab
        model1 = {model | mainTab = updatedMainTab}
    in
       (model1, outmsg)



updateWindow: Window -> Model -> Model
updateWindow window model =
    {model | mainTab = Tab.create window.mainTab (generateTabId window model.windowId) model.mainTableHeight Tab.Table
    ,extTabs = 
        List.map(
            \ext ->
               let extModel = Tab.create ext (generateTabId window model.windowId) 100 Tab.Table
               in
               extModel
        ) window.extTabs
    ,hasManyMergedTabs =
        List.map(
            \tab -> 
                let tabModel = Tab.create tab (generateTabId window model.windowId) model.detailTableHeight Tab.Table
                in {tabModel | isOpen = False}
        ) (window.hasManyTabs ++ window.hasManyIndirectTabs)
    }


getMainTabFocusedRow: Model -> Int -> Maybe Row.Model
getMainTabFocusedRow model rowId =
    Tab.getRow model.mainTab rowId

subscriptions: Model -> Sub Msg
subscriptions model =
    Sub.batch []
    
    
