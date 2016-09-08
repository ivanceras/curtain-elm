module Tab exposing (..)

import Field
import Row
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Html.App as App
import Json.Decode as Decode exposing ((:=))
import Json.Decode.Extra as Extra exposing ((|:))
import Update.Extra.Infix exposing ((:>))
import Presentation exposing 
    (Presentation (Table, Form, Grid)
    ,Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing 
    (Dao
    ,DaoState
    ,TableDao
    ,Value(Bool,I8,I16,I32,I64,U8,U16,U32,U64,F32,F64,String,Date,DateTime,Uuid)
    )
import Utils
import Update.Extra exposing (andThen)


type alias Model =
    { tab: Tab
    , rows: List Row.Model -- this contains the dao
    , mode: Mode
    , presentation: Presentation
    , density: Density
    , isOpen: Bool
    , page: Maybe Int
    , pageSize: Maybe Int
    , totalRecords: Maybe Int
    , totalPage: Maybe Int
    , uid: Int -- used for tracking row number
    , tabId: String
    , allocatedHeight: Int
    , browserDimension: BrowserDimension
    , loadingPage: Bool
    }

type alias BrowserDimension =
    {width: Int
    ,height: Int
    ,scrollBarWidth: Int
    }

type alias Tab =
    { name: String
    , isOwned: Bool
    , isExtension: Bool
    , isHasOne: Bool
    , isHasMany: Bool
    , isDirect: Bool
    , linkerTable: Maybe String
    , linkerColumn: Maybe String
    , description: Maybe String
    , info: Maybe String
    , table: String
    , schema: Maybe String
    , fields: List Field.Field
    , logo: Maybe String
    , icon: Maybe String
    , estimatedRowCount: Maybe Int
    }


type Msg
    = ChangeMode Mode
    | ChangePresentation Presentation
    | ChangeDensity Density
    | UpdateRow Int Row.Msg
    | TabReceived Tab
    | TabDataReceived TableDao
    | SelectionAll Bool
    | LookupTabsReceived (List Tab)
    | LookupDataReceived (List Field.LookupData)
    | Open
    | Close
    | Toggle
    | ChangeAllocatedHeight Int
    | FormRecordClose
    | BrowserDimensionChanged BrowserDimension
    | TabDataNextPageReceived TableDao
    | ReceivedScrollBottomEvent
    | RecordsUpdated Dao.UpdateResponse

type OutMsg
    = LoadNextPage
    | WindowChangePresentation Presentation
    | FormClose


tabDecoder: Decode.Decoder Tab
tabDecoder = 
    Decode.succeed Tab
        |: ("name" := Decode.string)
        |: ("is_owned" := Decode.bool)
        |: ("is_extension" := Decode.bool)
        |: ("is_has_one":= Decode.bool)
        |: ("is_has_many" := Decode.bool)
        |: ("is_direct" := Decode.bool)
        |: (Decode.maybe ("linker_table" := Decode.string))
        |: (Decode.maybe ("linker_column" := Decode.string))
        |: (Decode.maybe ("description" := Decode.string))
        |: (Decode.maybe ("info" := Decode.string))
        |: ("table" := Decode.string)
        |: (Decode.maybe ("schema" := Decode.string))
        |: ("fields" := Decode.list Field.fieldDecoder)
        |: (Decode.maybe ("logo" := Decode.string))
        |: (Decode.maybe ("icon" := Decode.string))
        |: (Decode.maybe ("estimated_row_count" := Decode.int))
        
lookupDataDecoder: Decode.Decoder Field.LookupData
lookupDataDecoder = 
    Decode.succeed Field.LookupData
        |: ("table" := Decode.string)
        |: ("dao_list" := Decode.list Dao.daoDecoder)



create: Tab -> String -> Int -> Model
create tab tabId height =
    { tab = tab
    , rows= []
    , mode= Read
    , presentation= if tab.isExtension then Form else Table -- extension will be in form mode
    , density = Expanded
    , isOpen = True
    , page = Nothing
    , pageSize = Nothing
    , totalRecords = Nothing
    , totalPage = Nothing
    , uid = 0 --will be incremented every row added
    , tabId = tabId
    , allocatedHeight = height
    , browserDimension = defaultBrowserDimension
    , loadingPage = False
    }


defaultBrowserDimension =
    { width = 0
    , height = 0 
    , scrollBarWidth = 13
    } 


emptyRowForm: Model -> Row.Model
emptyRowForm model =
    let row = Row.create model.tab.fields model.uid
        (updatedRow,_) = Row.update (Row.ChangePresentation Form) row
        (updatedRow1,_) = Row.update (Row.ChangeMode Edit) updatedRow
     in
     updatedRow1



view: Model -> Html Msg
view model =
    let columnShadowId = "column_shadow-"++model.tabId
        rowShadowId = "row_shadow-"++ model.tabId

        tabView =
            case model.presentation of
            Form ->
                let focused = focusedRow model
                in
                div []
                    [div [class "form"] 
                       [case focused of
                           Just focused ->
                              Row.view focused |> App.map (UpdateRow focused.rowId)
                           Nothing ->
                              Row.view (emptyRowForm model) |> App.map (UpdateRow 1000)
                       ]
                    ]

            Table ->
                div [class "all_table_hack"
                    ,style [("display","flex")
                           ,("white-space", "nowrap")
                           ]
                    ]
                    [div [class "row_shadow_and_header"] 
                         [div [style [("width", "100px")
                                     ,("height", "70px")
                                     ]
                              ]
                              [frozenControlHead model]

                         ,div [class "row_shadow"
                             ,id rowShadowId
                             ,style [("height", (toString (model.allocatedHeight-model.browserDimension.scrollBarWidth))++"px")
                                    ,("width", "100px")
                                    ,("overflow", "hidden")
                                    ]
                             ]
                            [rowShadow model]
                        ]
                    ,div [class "main_and_column_shadow"
                         ,style [
                                ]
                         ]
                        [div [class "column_shadow"
                             ,id columnShadowId
                             ,style [("width",(toString (calcMainTableWidth model - model.browserDimension.scrollBarWidth))++"px")
                                    ,("overflow", "hidden")
                                    ,("height", "70px")
                                    ]
                             ]
                            [table []
                                [theadView model]
                            ]
                        ,div [style [("height", (toString model.allocatedHeight)++"px")
                                  ,("overflow", "auto")
                                  ,("width",(toString (calcMainTableWidth model))++"px")
                                  ]
                            ,attribute "onscroll" ("alignScroll(event, '"++model.tab.table++"','"++columnShadowId++"','"++rowShadowId++"')")
                            ]
                            [table [id "main_table"
                                   ] 
                                [tbody [                               ]
                                (model.rows
                                    |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                                )
                                ]
                            ]
                        , case model.loadingPage of
                            True ->
                                div [style [("margin-top", "-50px")]
                                    ,class "animated slideInUp"
                                    ]
                                    [i [class "fa fa-spinner fa-pulse fa-3x fa-fw"] []
                                    ]
                            False ->
                                text "" 
                         ]
                    ]

            Grid ->
                    div [class "grid"]
                        (model.rows
                            |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                        )
    in
    if model.isOpen then
        div []
            [div []
                 [tabView
                 ]
            ]
    else 
       text "" 
                

calcMainTableWidth model =  
    let widthDeductions = 325
    in
    model.browserDimension.width - widthDeductions

onTableScroll msg =
    let _ = Debug.log "scrolling..." msg
        _ = Debug.log "targetValue" targetValue
    in
    on "scroll" (Decode.map msg Decode.value)



rowShadow model =
   table []
        (List.map(
            \row -> 
                tr []
                    [(App.map (UpdateRow row.rowId)
                        (Row.rowShadowRecordControls row)
                    )
                    ]
            ) model.rows
        )

theadView: Model -> Html Msg
theadView model =
    let filteredFields = Row.filterFieldsWithDensity model.tab.fields model.density
                            |> Row.excludeKeyfields
    in
    thead [style [("height", "66px")
                 ]
          ]
        [if model.tab.isExtension then
            span [] [text "no filter for extension tabs"]
         else
            tabFilters model filteredFields
        ,tr [style [("height", "30px")
                   ]
            ]
             (List.map (
                \f -> 
                    let width = case f.displayLength of
                        Just len -> 10 * len
                        Nothing -> 100
                    in
                    th [Field.alignment f] 
                        [div [class "tooltip"
                             ,style [("width", (toString width)++"px")]
                             ]
                            [text f.name
                            ,Field.tooltipText f
                            ]
                        ]
                    ) filteredFields
            )
        ]

modifiedRows: Model -> List Row.Model
modifiedRows model =
    List.filter (\r -> Row.isModified r) model.rows

modifiedRowCount model =
    List.length <| modifiedRows model

selectedRows: Model -> List Row.Model
selectedRows model =
    List.filter (\r-> r.isSelected) model.rows

insertedRows: Model -> List Row.Model
insertedRows model =
    List.filter (\r -> Row.isNew r ) model.rows

selectedRowCount model = 
    selectedRows model |> List.length


filterStatusView model = 
    let rows = List.length model.rows
        selected = selectedRowCount model
        rowCountText = 
            case model.tab.estimatedRowCount of
                Just estimate ->
                    text (toString estimate)
                Nothing ->
                    text (toString rows)

        selectedStr = 
            if selected > 0 then
                (toString selected)
            else ""
    in
    [th [] [text selectedStr]
    ,th [] [rowCountText
           ,span [class "tooltip"]
                [i [style [("margin-left", "10px")]
                    ,class "icon ion-funnel"
                   ][] 
                 ,span [class "tooltiptext"] [text "Click to clear filter"]
                ]
           ]
    ] 

tabFilters: Model ->List Field.Field -> Html Msg
tabFilters model filteredFields =
    tr [class "tab_filters"
       ,style [("background-color", "#fefefe")
              ,("height","38px")
              ]
       ]
        (List.map (
            \f -> 
               let width = case f.displayLength of
                    Just len -> len * 10
                    Nothing -> 200
                in
                th [Field.alignment f] 
                    [input [style [("width", (toString width)++"px")]
                            ,type' "text"
                            ,Field.alignment f
                            ,placeholder ("Search "++f.column++"...")
                           ] []
                    ]
            ) filteredFields
        )

frozenControlHead model =
    table []
        [thead [style [("height", "60px")
                      ]
               ]
            [tr [style [("height", "38px")
                       ]
                ] 
                (filterStatusView model)
            ,tr [style [("height","30px")]] (recordControlsHead model)
            ]
        ]

recordControlsHead model =
    let rows = List.length model.rows
        allSelected = areAllRecordSelected model
        unselect = if allSelected then "unselect" else "select"
        tooltipText = 
            "Click to "++unselect++" "++(toString rows)++" record(s)"
    in
    [th [class "tooltip"
        ,style [("height", "30px")]
        ] 
        [input [type' "checkbox", onCheck SelectionAll, checked allSelected] []
        ,span[class "tooltiptext"] [text tooltipText]
        ]
    ,th [] []
    ]

areAllRecordSelected: Model -> Bool
areAllRecordSelected model =
    let selected = selectedRowCount model 
        rows = List.length model.rows
    in 
    rows > 0 && selected == rows





updateRows: Row.Msg -> Model -> Model
updateRows row_msg model =
    { model | rows =
        List.map (
            \r ->
                let (row, out_msg) =
                    Row.update row_msg r
                 in row
        ) model.rows
    }

focusFirstRecord: Model -> Maybe Row.Model
focusFirstRecord model =
    List.head model.rows


updateFocusedRow: Int -> Model -> Model
updateFocusedRow rowId model =
    {model | rows =
        List.map
            (\r ->
                if r.rowId == rowId then
                   Row.update Row.FocusRecord r 
                    |> fst
                else
                   Row.update Row.LooseFocusRecord r
                    |> fst
            ) model.rows
     }
        


updateSelectionAllRecords: Model -> Bool -> Model
updateSelectionAllRecords model checked =
   let rows = List.map (\r ->
        let (mo, cmd) = Row.update (Row.Selection checked) r
        in mo
       ) model.rows
    in
    {model | rows = rows}
    

        

update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    case msg of
        UpdateRow rowId rowMsg ->
            let (model',outmsg) = updateRow rowMsg rowId model
            in case outmsg of
                Nothing -> (model', Nothing)
                Just outmsg -> 
                    case outmsg of
                        Row.TabChangePresentation presentation ->
                            ({model' | presentation = presentation}
                                |> updateRows (Row.ChangePresentation presentation) 
                            , Just (WindowChangePresentation presentation))
                        Row.TabEditRecordInForm ->
                            ({model' | presentation = Form}
                                |> updateFocusedRow rowId
                            , Just (WindowChangePresentation Form))
                            
                        Row.CancelChanges ->
                            (model', Nothing)
                        Row.SaveChanges ->
                            (model', Nothing)
                        Row.Remove ->
                            (model', Nothing)
                        Row.FocusChanged ->
                            (updateFocusedRow rowId model', Nothing)

                    
        ChangeMode mode ->
            ({ model | mode = mode}
                |> updateRows (Row.ChangeMode mode)
            , Nothing)

        ChangePresentation presentation ->
            ({model | presentation = presentation}
                |> updateRows (Row.ChangePresentation presentation)
            , Nothing)

        ChangeDensity density ->
            ({model | density = density }
                |> updateRows (Row.ChangeDensity density)
            , Nothing
            )
        TabReceived tab ->
            ( {model | tab = tab}, Nothing )

        TabDataReceived tableDao ->
            (setTabRows model tableDao, Nothing)


        SelectionAll checked ->
            (updateRows (Row.Selection checked) model
            , Nothing)

        LookupTabsReceived tabList ->
            let listLookupFields = buildLookupField tabList
            in
            (updateRows (Row.LookupTabsReceived listLookupFields) model
            , Nothing
            )

        LookupDataReceived lookupDataList ->
            (updateRows (Row.LookupDataReceived lookupDataList) model
            , Nothing
            )

        Open ->
            ({model | isOpen = True}, Nothing)

        Close ->
            ({model | isOpen = False}, Nothing)

        Toggle ->
            ({ model | isOpen = not model.isOpen}, Nothing)

        ChangeAllocatedHeight height ->
            ( {model | allocatedHeight = height}
            , Nothing
            )
        
        FormRecordClose ->
            ( {model | presentation = Table
                , mode = Read
                }
                |> updateRows (Row.ChangeMode Read)
             , Just FormClose)

        BrowserDimensionChanged browserDimension ->
            ({ model | browserDimension = browserDimension}
            , Nothing)

        TabDataNextPageReceived tableDao ->
            (addToRows model tableDao
            , Nothing)


        ReceivedScrollBottomEvent ->
            if not model.loadingPage then
                ({model | loadingPage = True
                }, Just LoadNextPage)
            else
                (model, Nothing)

        RecordsUpdated updateResponse ->
            (updateRecordFromResponse model updateResponse, Nothing)

-- retain only what's not in deleted

updateRecordFromResponse: Model -> Dao.UpdateResponse -> Model
updateRecordFromResponse model ur =
        { model | rows = 
            List.filter (
                \row ->
                not (inDeleted ur row)
            ) model.rows
        }



inDeleted: Dao.UpdateResponse -> Row.Model -> Bool
inDeleted updateResponse row =
    List.any (\d -> Row.equalDao row d) updateResponse.deleted


focusedRow: Model -> Maybe Row.Model
focusedRow model =
    List.filter
        (\r ->
            r.isFocused
        ) model.rows
        |> List.head

createRows: Model -> List DaoState -> List Row.Model
createRows model listDaoState =
    List.indexedMap (
        \index daoState ->
            let newRow = Row.create model.tab.fields (model.uid + index)
                (mo, cmd) = Row.update (Row.DaoStateReceived daoState) newRow 
            in mo
        ) listDaoState 

setTabRows: Model -> TableDao -> Model
setTabRows model tableDao =
    let rows = createRows model tableDao.daoList
    in
    {model | rows = rows
    ,uid = model.uid + List.length rows
    ,loadingPage = False
    ,page = Debug.log "page" tableDao.page
    ,pageSize = Debug.log "page size" tableDao.pageSize
    ,totalRecords = tableDao.total
    ,totalPage = case tableDao.total of
            Just total ->
                case tableDao.pageSize of
                    Just pageSize ->
                        let totalPage = (total + pageSize - 1 ) // pageSize
                            _ = Debug.log "totalPage: " totalPage
                        in 
                        Just totalPage

                    Nothing -> Nothing
            Nothing -> Nothing
    }
    
addToRows: Model -> TableDao -> Model
addToRows model tableDao =
    let rows = createRows model tableDao.daoList
    in
    {model | rows = model.rows ++ rows
    ,uid = model.uid + List.length rows
    ,loadingPage = False
    ,page = Debug.log "page" tableDao.page
    ,pageSize = Debug.log "page size" tableDao.pageSize
    ,totalRecords = tableDao.total
    ,totalPage = case tableDao.total of
            Just total ->
                case tableDao.pageSize of
                    Just pageSize ->
                        let totalPage = (total + pageSize - 1 ) // pageSize
                            _ = Debug.log "totalPage: " totalPage
                        in 
                        Just totalPage

                    Nothing -> Nothing
            Nothing -> Nothing
    }

completeTableName: Tab -> String
completeTableName tab =
    case tab.schema of
        Just schema ->
            schema ++ "." ++ tab.table
        Nothing ->
            tab.table

buildLookupField: List Tab -> List Field.LookupTab
buildLookupField tabList =
    List.map(
        \t ->
           Field.newLookupTab (completeTableName t) t.fields
           
    ) tabList

updateRow: Row.Msg -> Int -> Model -> (Model, Maybe Row.OutMsg)
updateRow rowMsg rowId model =
    let rows_out  = 
        List.map (\r -> 
            if r.rowId == rowId then
                Row.update rowMsg r 
             else
                (r,Nothing)
            ) model.rows 
        (rows,outmsgs) = List.unzip rows_out
     in
     ({ model | rows = rows }, Utils.fstNoneEmpty outmsgs)

getRow: Model -> Int -> Maybe Row.Model
getRow model rowId =
    List.filter(
        \r ->
            r.rowId == rowId
        ) model.rows
        |> List.head

