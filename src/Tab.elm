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
    , focusedRow: Maybe Int
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

type OutMsg
    = LoadNextPage

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
    , focusedRow = Nothing
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
    let widthDeductions = 500
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

numberOfSelectedRecords model = 
    List.filter (\r -> r.isSelected) model.rows |> List.length


filterStatusView model = 
    let rows = List.length model.rows
        selected = numberOfSelectedRecords model
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
    let selected = numberOfSelectedRecords model 
        rows = List.length model.rows
    in 
    rows > 0 && selected == rows




updatePresentation: Presentation -> Model -> Model
updatePresentation presentation model =
    {model | presentation = presentation
             , rows = 
                (List.map (\r ->
                    let (mr, cmd) = Row.update (Row.ChangePresentation presentation ) r
                    in mr
                )model.rows)}


updateMode: Mode -> Model -> Model
updateMode mode model =
     {model | mode = mode
            , rows = 
            (List.map (\r -> 
                    let (mr,cmd) = Row.update (Row.ChangeMode mode) r 
                    in mr
                ) model.rows) }

focusFirstRecord: Model -> Maybe Row.Model
focusFirstRecord model =
    List.head model.rows

setFocusedRow: Int -> Model -> Model
setFocusedRow rowId model =
    {model | focusedRow = Just rowId}

focusedRow: Model -> Maybe Row.Model
focusedRow model =
    case model.focusedRow of
        Nothing -> focusFirstRecord model
        Just row ->
            List.filter (\r -> r.rowId == row) model.rows
                        |> List.head

updateSelectionAllRecords: Model -> Bool -> Model
updateSelectionAllRecords model checked =
   let rows = List.map (\r ->
        let (mo, cmd) = Row.update (Row.Selection checked) r
        in mo
       ) model.rows
    in
    {model | rows = rows}
    

updateFocusedRow: Int -> Model -> Model
updateFocusedRow rowId model =
    let model = updateSelectionAllRecords model False
        updatedRows = 
            List.map (
                \r -> 
                    if r.rowId == rowId then
                        let (mo,cmd) = Row.update Row.FocusRecord r
                        in mo
                    else
                        let (mo,cmd) = Row.update Row.LooseFocusRecord r 
                        in mo
            ) model.rows
    in
    {model | rows = updatedRows
    ,focusedRow = Just rowId
    }
        
removeFocusedRecord model =
    let updatedRows = 
        List.map(
            \r ->
                let (mo, cmd) = Row.update Row.LooseFocusRecord r
                in mo
        ) model.rows
    in
    { model | rows = updatedRows
    , focusedRow = Nothing
    }


update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    case msg of
        UpdateRow rowId rowMsg ->
            case rowMsg of
                Row.FocusRecord ->
                    (updateFocusedRow rowId model
                        |> updateRow rowMsg rowId
                    , Nothing)

                Row.Selection checked ->
                    let updatedModel = removeFocusedRecord model
                    in
                    ( updateRow rowMsg rowId updatedModel , Nothing)

                Row.EditRecordInForm ->
                    (updateFocusedRow rowId model
                        |> updateRow (Row.ChangePresentation Form) rowId
                        |> updateRow rowMsg rowId
                        |> updatePresentation Form
                        |> updateMode Edit
                    ,Nothing)


                Row.EditRecordInPlace ->
                    (updateFocusedRow rowId model
                        |> updateRow (Row.ChangeMode Edit) rowId
                        |> updateRow rowMsg rowId
                    ,Nothing)

                _ ->
                    ( updateRow rowMsg rowId model , Nothing)

        ChangeMode mode ->
            (updateMode mode model, Nothing)

        ChangePresentation presentation ->
            (updatePresentation presentation model, Nothing)

        ChangeDensity density ->
            ({model | density = density }
                |> updateAllRows (Row.ChangeDensity density)
            , Nothing
            )
        TabReceived tab ->
            ( {model | tab = tab}, Nothing )

        TabDataReceived tableDao ->
            (setTabRows model tableDao, Nothing)


        SelectionAll checked ->
            (updateAllRows (Row.Selection checked) model, Nothing)

        LookupTabsReceived tabList ->
            let listLookupFields = buildLookupField tabList
            in
            (updateAllRows (Row.LookupTabsReceived listLookupFields) model
            , Nothing
            )

        LookupDataReceived lookupDataList ->
            (updateAllRows (Row.LookupDataReceived lookupDataList) model
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
            (updatePresentation Table model
                |> updateMode Read, Nothing)

        BrowserDimensionChanged browserDimension ->
            ({ model | browserDimension = browserDimension}
            , Nothing)

        TabDataNextPageReceived tableDao ->
            (addToRows model tableDao
            , Nothing)


        ReceivedScrollBottomEvent ->
            let _ = Debug.log "----> RECEIVED SCROLL BOTTOM EVENT" ".."
            in
            ({model | loadingPage = True
            }, Nothing)




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

updateRow: Row.Msg -> Int -> Model -> Model
updateRow rowMsg rowId model =
    let rows = 
        List.map (\r -> 
            if r.rowId == rowId then
                let (mr,cmd) = Row.update rowMsg r 
                in mr
             else
                r
            ) model.rows 
     in
     { model | rows = rows }

getRow: Model -> Int -> Maybe Row.Model
getRow model rowId =
    List.filter(
        \r ->
            r.rowId == rowId
        ) model.rows
        |> List.head

updateAllRows: Row.Msg -> Model -> Model
updateAllRows rowMsg model =
    let rows = 
        List.map (\r -> 
                let (mr,cmd) = Row.update rowMsg r 
                in mr
            ) model.rows 
     in
     { model | rows = rows }

