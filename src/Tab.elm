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


type alias Model =
    { tab: Tab
    , rows: List Row.Model -- this contains the dao
    , mode: Field.Mode
    , presentation: Field.Presentation
    , density: Field.Density
    , isOpen: Bool
    , page: Int
    , pageSize: Int
    , uid: Int -- used for tracking row number
    , focusedRow: Maybe Int
    , tabId: Int
    , allocatedHeight: Int
    , browserDimension: BrowserDimension
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
        |: ("dao_list" := Decode.list Field.daoDecoder)


type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | ChangeDensity Field.Density
    | UpdateRow Int Row.Msg
    | TabReceived Tab
    | TabDataReceived (List Row.DaoState)
    | SelectionAll Bool
    | LookupTabsReceived (List Tab)
    | LookupDataReceived (List Field.LookupData)
    | Open
    | Close
    | Toggle
    | TableScrolled Decode.Value 
    | ChangeAllocatedHeight Int
    | FormRecordClose
    | BrowserDimensionChanged BrowserDimension

create: Tab -> Int -> Int -> Model
create tab tabId height =
    { tab = tab
    , rows= []
    , mode= Field.Read
    , presentation= if tab.isExtension then Field.Form else Field.Table -- extension will be in form mode
    , density = Field.Expanded
    , isOpen = True
    , page = 0
    , pageSize = 15
    , uid = 0 --will be incremented every row added
    , focusedRow = Nothing
    , tabId = tabId
    , allocatedHeight = height
    , browserDimension = defaultBrowserDimension
    }


defaultBrowserDimension =
    { width = 0
    , height = 0 
    , scrollBarWidth = 13
    } --chrome 15, firefox 17


emptyRowForm: Model -> Row.Model
emptyRowForm model =
    let row = Row.create model.tab.fields model.uid
        _ = Debug.log "creating emptyRow in form using " model.tab.fields
        (updatedRow,_) = Row.update (Row.ChangePresentation Field.Form) row
        (updatedRow1,_) = Row.update (Row.ChangeMode Field.Edit) updatedRow
     in
     updatedRow1



view: Model -> Html Msg
view model =
    let rowShadowWidth = 100
        sidePaneWidth = 932

        tabView =
            case model.presentation of
            Field.Form ->
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

            Field.Table ->
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
                             ,id "row_shadow"
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
                        [div [class "head_shadow"
                             ,id "head_shadow"
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
                            ,attribute "onscroll" "alignScroll(event)"
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

            Field.Grid ->
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

tabControls model =
    div [] [ button [onClick (ChangeMode Field.Edit)] [text "Edit All rows"]
           , button [onClick (ChangeMode Field.Read)] [text "Read All rows"]
           , button [onClick (ChangePresentation Field.Table)] [text "Table All rows"]
           , button [onClick (ChangePresentation Field.Form)] [text "Form All rows"]
           , button [onClick (ChangePresentation Field.Grid)] [text "Grid All rows"]
           , button [onClick (ChangeDensity Field.Compact)] [text "Compact All"]
           , button [onClick (ChangeDensity Field.Medium)] [text "Medium All"]
           , button [onClick (ChangeDensity Field.Expanded)] [text "Expanded All"]
           ]



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




updatePresentation: Field.Presentation -> Model -> Model
updatePresentation presentation model =
    {model | presentation = presentation
             , rows = 
                (List.map (\r ->
                    let (mr, cmd) = Row.update (Row.ChangePresentation presentation ) r
                    in mr
                )model.rows)}


updateMode: Field.Mode -> Model -> Model
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


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateRow rowId rowMsg ->
            case rowMsg of
                Row.FocusRecord ->
                    (updateFocusedRow rowId model
                        |> updateRow rowMsg rowId
                    , Cmd.none)

                Row.Selection checked ->
                    let updatedModel = removeFocusedRecord model
                    in
                    ( updateRow rowMsg rowId updatedModel , Cmd.none)

                Row.EditRecordInForm ->
                    (updateFocusedRow rowId model
                        |> updateRow (Row.ChangePresentation Field.Form) rowId
                        |> updateRow rowMsg rowId
                        |> updatePresentation Field.Form
                        |> updateMode Field.Edit
                    ,Cmd.none)


                Row.EditRecordInPlace ->
                    (updateFocusedRow rowId model
                        |> updateRow (Row.ChangeMode Field.Edit) rowId
                        |> updateRow rowMsg rowId
                    ,Cmd.none)

                _ ->
                    ( updateRow rowMsg rowId model , Cmd.none)

        ChangeMode mode ->
            (updateMode mode model, Cmd.none)

        ChangePresentation presentation ->
            (updatePresentation presentation model, Cmd.none)

        ChangeDensity density ->
            ({model | density = density }
                |> updateAllRows (Row.ChangeDensity density)
            , Cmd.none
            )
        TabReceived tab ->
            ( {model | tab = tab}, Cmd.none )

        TabDataReceived listDaoState ->
            (createRows model listDaoState, Cmd.none)


        SelectionAll checked ->
            (updateAllRows (Row.Selection checked) model, Cmd.none)

        LookupTabsReceived tabList ->
            let listLookupFields = buildLookupField tabList
            in
            (updateAllRows (Row.LookupTabsReceived listLookupFields) model
            , Cmd.none
            )

        LookupDataReceived lookupDataList ->
            (updateAllRows (Row.LookupDataReceived lookupDataList) model
            , Cmd.none
            )

        Open ->
            ({model | isOpen = True}, Cmd.none)

        Close ->
            ({model | isOpen = False}, Cmd.none)

        Toggle ->
            ({ model | isOpen = not model.isOpen}, Cmd.none)

        TableScrolled target ->
            let _ = Debug.log "help, im scrolled" "hi..."
            in
            ( model, Cmd.none)
        
        ChangeAllocatedHeight height ->
            ( {model | allocatedHeight = height}
            , Cmd.none
            )
        
        FormRecordClose ->
            (updatePresentation Field.Table model
                |> updateMode Field.Read, Cmd.none)

        BrowserDimensionChanged browserDimension ->
            ({ model | browserDimension = browserDimension}
            , Cmd.none)

createRows: Model -> List Row.DaoState -> Model
createRows model listDaoState =
    let rows = 
            List.indexedMap (
            \index daoState ->
                let newRow = Row.create model.tab.fields (model.uid + index)
                    (mo, cmd) = Row.update (Row.DaoStateReceived daoState) newRow 
                in mo
            ) listDaoState 
    in
    {model | rows = rows
    ,uid = model.uid + List.length rows
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

