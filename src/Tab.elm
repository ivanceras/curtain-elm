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
import Mode exposing 
    (Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing 
    (Dao
    ,TableDao
    ,Value(Bool,I8,I16,I32,I64,U8,U16,U32,U64,F32,F64,String,Date,DateTime,Uuid)
    )
import Utils exposing (px)
import Update.Extra exposing (andThen)
import Array
import String

type Presentation = Table | Grid

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
    | Open
    | Close
    | Toggle
    | ChangeAllocatedHeight Int
    | BrowserDimensionChanged BrowserDimension
    | TabDataNextPageReceived TableDao
    | ReceivedScrollBottomEvent
    | RecordsUpdated Dao.UpdateResponse
    | UpdateRowDao Int Dao 

type OutMsg
    = LoadNextPage
    | FocusRow (Maybe Row.Model)


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
        



create: Tab -> String -> Int -> Presentation -> Model
create tab tabId height presentation =
    { tab = tab
    , rows= []
    , mode= Read
    , presentation= presentation -- extension will be in form mode
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

rowShadowWidth = 125


view: Model -> Html Msg
view model =
    let columnShadowId = "column_shadow-"++model.tabId
        rowShadowId = "row_shadow-"++ model.tabId

        tabView =
            case model.presentation of
            Table ->
                div [class "all_table_hack"
                    ,style [("display","flex")
                           ,("white-space", "nowrap")
                           ]
                    ]
                    [div [class "row_shadow_and_header"] 
                         [div [style [("width", px rowShadowWidth)
                                     ,("height", "70px")
                                     ]
                              ]
                              [frozenControlHead model]

                         ,div [class "row_shadow"
                             ,id rowShadowId
                             ,style [("height", (toString (model.allocatedHeight-model.browserDimension.scrollBarWidth))++"px")
                                    ,("width", px rowShadowWidth)
                                    ,("overflow", "hidden")
                                    ,("border-right", "1px dashed #ccc")
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
                            [table [class "colum_head"]
                                [theadView model]
                            ]
                        ,div [style [("height", (toString model.allocatedHeight)++"px")
                                  ,("overflow", "auto")
                                  ,("width",(toString (calcMainTableWidth model))++"px")
                                  ]
                            ,attribute "onscroll" ("alignScroll(event, '"++model.tab.table++"','"++columnShadowId++"','"++rowShadowId++"')")
                            ]
                            [table [id "main_table"
                                    ,class "main_table"
                                   ] 
                                [tbody [                               ]
                                (model.rows
                                    |> List.map (\r -> App.map (UpdateRow r.rowId) (Row.view r))

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
                            |> List.map (\r -> App.map (UpdateRow r.rowId) (Row.view r))

                        )
    in
    div [style [("display", if model.isOpen then "block" else "none") ]]
        [tabView]
                


calcMainTableWidth model =  
    let widthDeductions = 225
    in
    model.browserDimension.width - ( widthDeductions + rowShadowWidth )

onTableScroll msg =
    let _ = Debug.log "scrolling..." msg
        _ = Debug.log "targetValue" targetValue
    in
    on "scroll" (Decode.map msg Decode.value)



rowShadow model =
   table []
         [tbody []
             (List.map(
                \row -> 
                    App.map (UpdateRow row.rowId)
                        (Row.rowShadowRecordControls row)
                ) model.rows
              )
          ]

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
                    let (width, height) =
                        Field.computeSizeFromField f Field.Table
                    in
                    th [style [
                               ("text-align", "center")
                              ]
                       ] 
                        [div [style [("width", (toString width)++"px")]
                             ,title <| Maybe.withDefault "" f.description
                             ]
                            [text f.name
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



tabFilters: Model ->List Field.Field -> Html Msg
tabFilters model filteredFields =
    tr [class "tab_filters"
       ,style [("height","38px")
              ]
       ]
        (List.map (
            \f -> 
                let (width, height) =
                    Field.computeSizeFromField f Field.Table
                    search_width = width - 18
                in
                th [style [("border-right", "1px solid #ddd")]
                   ] 
                    [input [style [("width", px search_width)
                                  ,("border-radius", "6px")
                                  ,("border", "1px  solid #ccc")
                                  ,("padding-right", "18px")
                                  ]
                            ,type' "text"
                            ,name "search"
                           ] []
                      ,i [class "fa fa-search"
                         ,style [("left", "-15px")
                                ,("position", "relative")
                                ,("color", "#ddd")
                                ]
                         ][]
                    ]
            ) filteredFields
        )

-- the upper right corner that won't move
frozenControlHead model =
    let rows = List.length model.rows
        allSelected = areAllRecordSelected model
        unselect = if allSelected then "unselect" else "select"
        selectAllTooltipText = 
            "Click to "++unselect++" "++(toString rows)++" record(s)"
        selected = selectedRowCount model
        (rowCountOverTotal, rowCountOverTotalTooltip) = 
            case model.totalRecords of
                Just totalRecords ->
                    (toString rows ++"/"++ toString totalRecords
                    ,"There are " ++(toString rows) ++" loaded of " ++(toString totalRecords) ++"  total"
                    )
                Nothing ->
                    (toString rows
                    ,""
                    )

        (selectedStr,selectedTooltip) = 
            if selected > 0 then
                (toString selected
                ,"There are "++(toString selected)++" records selected"
                )
            else ("","")
    in
    table [class "frozenControlHead"]
        [thead [style [("height", "60px")
                      ]
               ]
            [tr [style [("height", "38px")
                       ]
                ] 
                [th [title selectedTooltip] [text selectedStr]
                ,th [] 
                    [
                    button [class "btn btn-mini btn-default"
                           ,title "Click to clear filter"
                           ]
                        [i [class "fa fa-filter"] []]
                    ]
                ] 
            ,tr [style [("height","30px")]] 
                [th [style [("height", "30px")]
                    ] 
                    [input [type' "checkbox"
                           ,onCheck SelectionAll
                           ,checked allSelected
                           ,title selectAllTooltipText
                           ] []
                    ]
                ,th [title rowCountOverTotalTooltip] 
                    [text rowCountOverTotal
                    ]
                ]
            ]
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
        
-- no focused row
setNoFocusedRow: Model -> Model
setNoFocusedRow model =
    {model | rows =
        List.map
            (\r ->
               Row.update Row.LooseFocusRecord r
                    |> fst
            ) model.rows
     }

updateClickedRow: Int -> Model -> Model
updateClickedRow rowId model =
    {model | rows =
        List.map
            (\r ->
                if r.rowId == rowId then
                   Row.update Row.RowClicked r 
                    |> fst
                else
                   Row.update Row.LooseRowClicked r
                    |> fst
            ) model.rows
     }
      |> setNoFocusedRow
        



updateSelectionAllRecords: Model -> Bool -> Model
updateSelectionAllRecords model checked =
   let rows = List.map (\r ->
        let (mo, cmd) = Row.update (Row.Selection checked) r
        in mo
       ) model.rows
    in
    {model | rows = rows}
    

        

update: Msg -> Model -> (Model, List OutMsg)
update msg model =
    case msg of
        UpdateRow rowId rowMsg ->
            updateThenHandleRowMsg rowMsg rowId model
                    
        ChangeMode mode ->
            ({ model | mode = mode}
                |> updateRows (Row.ChangeMode mode)
            , [])

        ChangePresentation presentation ->
            ({model | presentation = presentation}
            , [])

        ChangeDensity density ->
            ({model | density = density }
                |> updateRows (Row.ChangeDensity density)
            , []
            )
        TabReceived tab ->
            ( {model | tab = tab}, [] )

        TabDataReceived tableDao ->
            (setTabRows model tableDao, [])


        SelectionAll checked ->
            (updateRows (Row.Selection checked) model
            , [])

        Open ->
            ({model | isOpen = True}, [])

        Close ->
            ({model | isOpen = False}, [])

        Toggle ->
            ({ model | isOpen = not model.isOpen}, [])

        ChangeAllocatedHeight height ->
            ( {model | allocatedHeight = height}
            , []
            )
        
        BrowserDimensionChanged browserDimension ->
            ({ model | browserDimension = browserDimension}
            , [])

        TabDataNextPageReceived tableDao ->
            (addToRows model tableDao
            , [])


        ReceivedScrollBottomEvent ->
            let _ = Debug.log "ReceivedScrollBottomEvent in Tab" ""
            in
            if Debug.log "shallLoadNextPage" (shallLoadNextPage model) then
                ({model | loadingPage = True
                }, [LoadNextPage])
            else
                (model, [])

        RecordsUpdated updateResponse ->
            let model' = updateRecordFromResponse model updateResponse
            in
            if shallAutoLoadNextPage model' then
                ({ model' | loadingPage = True }
                , [LoadNextPage]
                )
             else
                ( model', [])
        UpdateRowDao rowId dao ->
            updateThenHandleRowMsg (Row.UpdateDao dao) rowId model


updateRow: Row.Msg -> Int -> Model -> (Model, List Row.OutMsg)
updateRow rowMsg rowId model =
    let rows_out  = 
        List.map (\r -> 
            if r.rowId == rowId then
                Row.update rowMsg r 
             else
                (r, [])
            ) model.rows 
        (rows,outmsgs) = List.unzip rows_out
     in
     ({ model | rows = rows }, List.concat outmsgs)


updateThenHandleRowMsg: Row.Msg -> Int -> Model -> (Model, List OutMsg)
updateThenHandleRowMsg rowMsg rowId model =
    let (model', rowOutMsgs) =
        updateRow rowMsg rowId model
     in
        handleRowOutMsg rowOutMsgs rowId model'

handleRowOutMsg: List Row.OutMsg -> Int -> Model -> (Model, List OutMsg)
handleRowOutMsg outmsgs rowId model =
    List.foldl
        (\ outmsg (model, newout) ->
            case outmsg of
                Row.CancelChanges ->
                    (model, newout)
                Row.SaveChanges ->
                    (model, newout)
                Row.Remove ->
                    (model, newout)
                Row.FocusChanged ->
                    (updateFocusedRow rowId model
                    , newout ++ [FocusRow (focusedRow model)]
                    )
                Row.ClickedChanged ->
                    (updateClickedRow rowId model
                    ,newout
                    )
        ) (model, []) outmsgs


--called when removing rows
shallAutoLoadNextPage: Model -> Bool
shallAutoLoadNextPage model =
    let 
        rowLength = List.length model.rows
    in
    case model.pageSize of
        Just pageSize ->
            rowLength < pageSize && shallLoadNextPage model

        Nothing ->
            False
        
-- called when scrolling bottom
shallLoadNextPage model =
    let
        rowLength = List.length model.rows
        totalRecords = 
            case model.totalRecords of
                Just totalRecords ->
                    totalRecords
                Nothing ->
                   -1 
     in
        totalRecords > rowLength &&  not model.loadingPage

-- retain only what's not in deleted
-- update the updated rows
updateRecordFromResponse: Model -> Dao.UpdateResponse -> Model
updateRecordFromResponse model updateResponse =
        let rows =
                List.filter (
                    \row ->
                        not (inDeleted updateResponse row)
                ) model.rows
            updatedRows = 
                List.map (
                    \row -> 
                       updateRowFromResponse updateResponse row
                ) rows
        in 
        { model | rows = updatedRows
            , totalRecords = Just updateResponse.totalRecords
        }

updateRowFromResponse: Dao.UpdateResponse -> Row.Model -> Row.Model
updateRowFromResponse updateResponse row =
    let matchedDao = 
        List.filter (
            \r -> Row.matchPrimary row r
        ) updateResponse.updated
        |> List.head

        _ = Debug.log "matched dao" matchedDao
        
        updatedRow =
            case matchedDao of 
                Just dao ->
                    let (updatedRow, outmsg) =
                            Row.update (Row.SetDao dao) row
                        (updatedRow2, outmsg2) =
                            Row.update (Row.ChangeMode Mode.Read) updatedRow
                    in updatedRow2
                Nothing ->
                    row
    in updatedRow

inDeleted: Dao.UpdateResponse -> Row.Model -> Bool
inDeleted updateResponse row =
    List.any (\d -> Row.equalDao row d) updateResponse.deleted


hasFocusedRow: Model -> Bool
hasFocusedRow model =
    case focusedRow model of
        Just row -> True
        Nothing -> False

focusedRow: Model -> Maybe Row.Model
focusedRow model =
    List.filter
        (\r ->
            r.isFocused
        ) model.rows
        |> List.head

firstRow: Model -> Maybe Row.Model
firstRow model =
    List.head model.rows

createRows: Model -> List Dao -> List Row.Model
createRows model listDao =
    List.indexedMap (
        \index dao ->
            let newRow = Row.create model.tab.fields (model.uid + index)
                (mo, cmd) = Row.update (Row.SetDao dao) newRow 
            in mo
        ) listDao 

-- create a new row in Form for inserting a new record
newRowInForm: Model -> Row.Model
newRowInForm model =
    Row.create model.tab.fields (model.uid + 1)
    |> Row.update (Row.ChangeMode Edit)
    |> fst
    |> Row.update (Row.ChangePresentation Row.Form)
    |> fst



hydrateModel: Model -> List Row.Model -> TableDao -> Model
hydrateModel model rows tableDao =
    {model | rows = rows
    ,uid = model.uid + List.length rows
    ,loadingPage = False
    ,page = tableDao.page
    ,pageSize = tableDao.pageSize
    ,totalRecords = tableDao.total
    ,totalPage = case tableDao.total of
            Just total ->
                case tableDao.pageSize of
                    Just pageSize ->
                        let totalPage = (total + pageSize - 1 ) // pageSize
                        in 
                        Just totalPage

                    Nothing -> Nothing
            Nothing -> Nothing
    }

setTabRows: Model -> TableDao -> Model
setTabRows model tableDao =
    let rows = 
            createRows model tableDao.daoList
    in
        hydrateModel model rows tableDao
    
addToRows: Model -> TableDao -> Model
addToRows model tableDao =
    let rows = 
            createRows model tableDao.daoList
    in
        hydrateModel model (model.rows ++ rows) tableDao

completeTableName: Tab -> String
completeTableName tab =
    case tab.schema of
        Just schema ->
            schema ++ "." ++ tab.table
        Nothing ->
            tab.table


getRow: Model -> Int -> Maybe Row.Model
getRow model rowId =
    List.filter(
        \r ->
            r.rowId == rowId
        ) model.rows
        |> List.head

