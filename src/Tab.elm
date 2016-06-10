module Tab exposing (..)

import Field
import Row
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Html.App as App
import Json.Decode as Decode exposing ((:=))
import Json.Decode.Extra as Extra exposing ((|:))


type alias Model =
    { name: String 
    , table: String
    , rows: List Row.Model -- this contains the dao
    , mode: Field.Mode
    , fields: List Field.Field -- just the field without the dao
    , presentation: Field.Presentation
    , density: Field.Density
    , is_open: Bool
    , page: Int
    , page_size: Int
    , uid: Int -- used for tracking row number
    , focused_row: Maybe Int
    }

type alias Tab =
    { name: String
    , is_owned: Bool
    , is_extension: Bool
    , is_has_one: Bool
    , is_has_many: Bool
    , is_direct: Bool
    , linker_table: Maybe String
    , description: Maybe String
    , info: Maybe String
    , table: String
    , schema: Maybe String
    , fields: List Field.Field
    , logo: Maybe String
    , icon: Maybe String
    , page_size: Maybe Int
    }



tab_decoder: Decode.Decoder Tab
tab_decoder = 
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
        |: ("fields" := Decode.list Field.field_decoder)
        |: (Decode.maybe ("logo" := Decode.string))
        |: (Decode.maybe ("icon" := Decode.string))
        |: (Decode.maybe ("page_size" := Decode.int))
        


type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | ChangeDensity Field.Density
    | UpdateRow Int Row.Msg
    | TabReceived Tab
    | TabDataReceived (List Row.DaoState)
    | SelectionAll Bool

create: Tab -> Model
create tab =
    { empty | fields = tab.fields
    , name = tab.name
    , table = tab.table
    }

empty = 
    { name= ""
    , table = ""
    , rows= []
    , mode= Field.Read
    , fields = [] 
    , presentation= Field.Table
    , density = Field.Expanded
    , is_open = True
    , page = 0
    , page_size = 15
    , uid = 0 --will be incremented every row added
    , focused_row = Nothing
    }
 

view: Model -> Html Msg
view model =
    let background = style[("background-color", "#fcfcfc")]
    in
    case model.presentation of
        Field.Form ->
            let focused = focused_row model
            in
             div []
                 [tab_controls model
                 ,toolbar model
                 ,div [class "form", background] 
                    [case focused of
                        Just focused ->
                           Row.view focused |> App.map (UpdateRow focused.row_id)
                        Nothing ->
                            div[] [text "No record selected"]
                    ]
                 ]

        Field.Table ->
            div []
                [tab_controls model
                ,toolbar model
                ,table [background] 
                    [thead_view model 
                    ,tbody []
                    (model.rows
                        |> List.map (\r -> Row.view r |> App.map (UpdateRow r.row_id))

                    )
                    ]
                ,paging
                ]

        Field.Grid ->
            div []
                [tab_controls model
                ,toolbar model
                ,div [class "grid"]
                    (model.rows
                        |> List.map (\r -> Row.view r |> App.map (UpdateRow r.row_id))

                    )
                ,paging
                ]
        Field.List ->
           div []
               [tab_controls model
               ,select [class "list"]
                    (model.rows
                        |> List.map (\r -> Row.view r |> App.map (UpdateRow r.row_id))

                    )
               ]
                

tab_controls model =
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

thead_view: Model -> Html Msg
thead_view model =
    let filtered_fields = Row.filter_fields_with_density model.fields model.density
    in
    thead []
        [tab_filters model filtered_fields
        ,tr []
            ((record_controls_head model) ++
             (List.map (\f -> th [Field.alignment f] [text f.name]) filtered_fields
            )
            )
        ]

numberOfSelectedRecords model = 
    List.filter (\r -> r.is_selected) model.rows |> List.length

tab_filters: Model ->List Field.Field -> Html Msg
tab_filters model filtered_fields =
    let rows = List.length model.rows
        selected = numberOfSelectedRecords model
        selected_str = 
            if selected > 0 then
                (toString selected)
            else ""
    in
    tr [class "tab_filters", style [("background-color", "#fefefe")]]
        (
            [th [] [text selected_str]
            ,th [] [text (toString rows)
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
                ) filtered_fields
            )
        )

record_controls_head model =
    let rows = List.length model.rows
        all_selected = areAllRecordSelected model
        unselect = if all_selected then "unselect" else "select"
        tooltip_text = 
            "Click to "++unselect++" "++(toString rows)++" record(s)"
    in
    [th [class "tooltip"] 
        [input [type' "checkbox", onCheck SelectionAll, checked all_selected] []
        ,span[class "tooltiptext"] [text tooltip_text]
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
    let delete_tooltip = 
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
                ,span [class "tooltiptext"] [text delete_tooltip] 
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


update_row: Int -> Row.Msg -> Model -> List Row.Model
update_row row_id row_msg model =
    List.map (\r -> 
        if r.row_id == row_id then
            let (mr,cmd) = Row.update row_msg r 
            in mr
         else
            r
        ) model.rows 

update_presentation model presentation =
    ( {model | presentation = presentation
             , rows = 
                (List.map (\r ->
                    let (mr, cmd) = Row.update (Row.ChangePresentation presentation ) r
                    in mr
                )model.rows)}, Cmd.none)


update_mode model mode =
    ( {model | mode = mode
            , rows = 
            (List.map (\r -> 
                    let (mr,cmd) = Row.update (Row.ChangeMode mode) r 
                    in mr
                ) model.rows) }, Cmd.none)


focused_row: Model -> Maybe Row.Model
focused_row model =
    case model.focused_row of
        Nothing -> Nothing 
        Just row ->
            List.filter (\r -> r.row_id == row) model.rows
                        |> List.head

updateSelectionAllRecords: Model -> Bool -> Model
updateSelectionAllRecords model checked =
   let rows = List.map (\r ->
        let (mo, cmd) = Row.update (Row.Selection checked) r
        in mo
       ) model.rows
    in
    {model | rows = rows}
    

update_focused_row: Model -> Int -> Model
update_focused_row model row_id=
    let model = updateSelectionAllRecords model False
        updated_rows = 
            List.map (
                \r -> 
                    if r.row_id == row_id then
                        let (mo,cmd) = Row.update Row.FocusRecord r
                        in mo
                    else
                        let (mo,cmd) = Row.update Row.LooseFocusRecord r 
                        in mo
            ) model.rows
    in
    {model | rows = updated_rows
    ,focused_row = Just row_id
    }
        
removeFocusedRecord model =
    let updated_rows = 
        List.map(
            \r ->
                let (mo, cmd) = Row.update Row.LooseFocusRecord r
                in mo
        ) model.rows
    in
    { model | rows = updated_rows
    , focused_row = Nothing
    }


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateRow row_id row_msg ->
            case row_msg of
            Row.ChangePresentation presentation ->
                case presentation of
                    Field.Form ->
                        let (mo, cmd) = update_presentation model presentation
                            (mo2, cmd2) = update_mode mo Field.Edit 
                        in ({mo2 | focused_row = Just row_id
                                , mode = Field.Edit },cmd2)
                    _ ->
                        ( {model | rows = update_row row_id row_msg model }, Cmd.none)
                        
            Row.Close ->
                let (mo, cmd) =update_presentation model Field.Table
                in
                update_mode mo Field.Read
            Row.FocusRecord ->
                (update_focused_row model row_id, Cmd.none)

            Row.Selection checked ->
                let updated_model = removeFocusedRecord model
                in
                ( {model | rows = update_row row_id row_msg updated_model }, Cmd.none)


            Row.UpdateField column field_msg ->
                let _ =Debug.log "TAB tapping row.update field" column
                in
                (update_focused_row model row_id, Cmd.none)
                
            _ ->
                ( {model | rows = update_row row_id row_msg model }, Cmd.none)

        ChangeMode mode ->
            update_mode model mode

        ChangePresentation presentation ->
            update_presentation model presentation

        ChangeDensity density ->
            ( {model | density = density
                     , rows =
                        (List.map (\r ->
                            let (mr, cmd) = Row.update (Row.ChangeDensity density) r
                            in mr
                        ) model.rows)}, Cmd.none)

        TabReceived tab ->
            ( {model | fields = tab.fields}, Cmd.none )

        TabDataReceived list_dao_state ->
            let _ = Debug.log "tab data recieved" (List.length list_dao_state)
                first_row = Maybe.withDefault Row.empty (List.head model.rows)
                rows = 
                    List.indexedMap (
                    \index dao_state ->
                        let new_row = Row.create model.fields (model.uid + index)
                            (mo, cmd) = Row.update (Row.DaoStateReceived dao_state) new_row 
                        in mo
                    ) list_dao_state 
            in
            ( {model | rows = rows
              , uid = model.uid + List.length rows
              }
             , Cmd.none
            )


        SelectionAll checked ->
           let rows = List.map (\r ->
                let (mo, cmd) = Row.update (Row.Selection checked) r
                in mo
               ) model.rows
            in
              ({model | rows = rows}, Cmd.none)

 


