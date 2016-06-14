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

create: Tab -> Model
create tab =
    { tab = tab
    , rows= []
    , mode= Field.Read
    , presentation= if tab.isExtension then Field.Table else Field.Table -- extension will be in form mode
    , density = Field.Expanded
    , isOpen = True
    , page = 0
    , pageSize = 15
    , uid = 0 --will be incremented every row added
    , focusedRow = Nothing
    }

 

view: Model -> Html Msg
view model =
    let background = style[("background-color", "#fcfcfc")]
        toolbarView = 
            if model.tab.isExtension then
                span [] [text "no toolbar for extension"]
            else
                toolbar model
        tabView =
            case model.presentation of
            Field.Form ->
                let focused = focusedRow model
                in
                     div [class "form", background] 
                        [case focused of
                            Just focused ->
                               Row.view focused |> App.map (UpdateRow focused.rowId)
                            Nothing ->
                               div[] [text "No record selected"]
                                {--
                                let blankRow = 
                                    Row.create model.tab.fields 0
                                    (updatedRow, cmd) = Row.update (Row.ChangePresentation Field.Form) blankRow
                                    
                                in
                                Row.view {updatedRow | presentation = Field.Form}
                                       |> App.map (UpdateRow 0)
                                 --}
                        ]

            Field.Table ->
                    table [background] 
                        [theadView model 
                        ,tbody []
                        (model.rows
                            |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                        )
                        ]

            Field.Grid ->
                    div [class "grid"]
                        (model.rows
                            |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                        )
            Field.List ->
                   select [class "list"]
                        (model.rows
                            |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                        )
    in
    if model.isOpen then
        div []
            [tabControls model
            ,toolbarView
            ,tabView
            ]
    else 
       text "" 
                

tabControls model =
    div [] [ button [onClick (ChangeMode Field.Edit)] [text "Edit All rows"]
           , button [onClick (ChangeMode Field.Read)] [text "Read All rows"]
           , button [onClick (ChangePresentation Field.Table)] [text "Table All rows"]
           , button [onClick (ChangePresentation Field.Form)] [text "Form All rows"]
           , button [onClick (ChangePresentation Field.Grid)] [text "Grid All rows"]
           , button [onClick (ChangePresentation Field.List)] [text "List All rows"]
           , button [onClick (ChangeDensity Field.Compact)] [text "Compact All"]
           , button [onClick (ChangeDensity Field.Medium)] [text "Medium All"]
           , button [onClick (ChangeDensity Field.Expanded)] [text "Expanded All"]
           ]

theadView: Model -> Html Msg
theadView model =
    let filteredFields = Row.filterFieldsWithDensity model.tab.fields model.density
                            |> Row.excludeKeyfields
    in
    thead []
        [if model.tab.isExtension then
            span [] [text "no filter for extension tabs"]
         else
            tabFilters model filteredFields
        ,tr []
            ((recordControlsHead model) ++
             (List.map (
                \f -> 
                    th [Field.alignment f] 
                        [div [class "tooltip"]
                            [text f.name
                            ,Field.tooltipText f
                            ]
                        ]
                    ) filteredFields
            )
            )
        ]

numberOfSelectedRecords model = 
    List.filter (\r -> r.isSelected) model.rows |> List.length

tabFilters: Model ->List Field.Field -> Html Msg
tabFilters model filteredFields =
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
    tr [class "tab_filters", style [("background-color", "#fefefe")]]
        (
            [th [] [text selectedStr]
            ,th [] [rowCountText
                   ,span [class "tooltip"]
                        [i [style [("margin-left", "10px")]
                            ,class "icon ion-funnel"
                           ][] 
                         ,span [class "tooltiptext"] [text "Click to clear filter"]
                        ]
                   ]
            ] ++
            (List.map (
                \f -> 
                    th [Field.alignment f] 
                        [input [style [("width", "300px")]
                                ,type' "text"
                                ,Field.alignment f
                               ] []
                        ]
                ) filteredFields
            )
        )

recordControlsHead model =
    let rows = List.length model.rows
        allSelected = areAllRecordSelected model
        unselect = if allSelected then "unselect" else "select"
        tooltipText = 
            "Click to "++unselect++" "++(toString rows)++" record(s)"
    in
    [th [class "tooltip"] 
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

toolbar: Model ->Html Msg
toolbar model= 
    let deleteTooltip = 
        case model.presentation of
            Field.Table ->
                "Click to delete "++toString (numberOfSelectedRecords model)++" record(s) from the database"
            _ ->
                "Click to delete this record from the database"
    in    
        div [class "btn-group"]
            [button [class "btn btn-large btn-default tooltip"]
                [span [class "icon icon-plus icon-text tab-action"] []
                ,text "New record" 
                ,span [class "tooltiptext"] [text "Create a new record in a form"]
                ]
            ,button [class "btn btn-large btn-default tooltip", onClick (ChangeMode Field.Read)]
                [span [class "icon icon-list-add icon-text"] []
                ,text "Insert row"
                ,span [class "tooltiptext"] [text "Insert row"]
                ]
            ,button [class "btn btn-large btn-default tooltip", onClick (ChangeMode Field.Read)]
                [span [class "icon icon-floppy icon-text"] []
                ,text "Save"
                ,span [class "tooltiptext"] [text "Save record into the database"]
                ]
            ,button [class "btn btn-large btn-default tooltip", onClick (ChangePresentation Field.Table)]
                [span [class "icon icon-cancel icon-text"] []
                ,text "Close" 
                ,span [class "tooltiptext"] [text "Close the current record and return to grid view"]
                ]
            ,button [class "btn btn-large btn-default tooltip", onClick (ChangePresentation Field.Table)]
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
 

paging: Html Msg
paging = 
    div [class "btn-group"]
        [button [class "btn btn-large btn-default"]
            [span [class "icon icon-left-open icon-text"] []
            , text "prev"
            ]
        ,button [class "btn btn-large btn-default"]
            [span [class "icon icon-right-open icon-text"] []
            , text "next"
            ]
        ,button [class "btn btn-large btn-default"]
            [span [class "icon icon-arrows-ccw icon-text"] []
            , text "refresh"
            ]
        ]


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
    

updateFocusedRow: Model -> Int -> Model
updateFocusedRow model rowId=
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
            Row.ChangePresentation presentation ->
                case presentation of
                    Field.Form ->
                        (updatePresentation presentation model
                            |> updateRow (Row.ChangeMode Field.Edit) rowId
                            |> setFocusedRow rowId
                        , Cmd.none
                        )
                    _ ->
                        ( updateRow rowMsg rowId model, Cmd.none)
                        
            Row.Close ->
                (updatePresentation Field.Table model
                    |> updateRow (Row.ChangeMode Field.Read) rowId
                    |> updateMode Field.Read, Cmd.none)

            Row.FocusRecord ->
                (updateFocusedRow model rowId, Cmd.none)

            Row.Selection checked ->
                let updatedModel = removeFocusedRecord model
                in
                ( updateRow rowMsg rowId updatedModel , Cmd.none)


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

