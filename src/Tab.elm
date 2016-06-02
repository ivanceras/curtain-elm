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
    , rows: List Row.Model -- this contains the dao
    , mode: Field.Mode
    , fields: List Field.Field -- just the field without the dao
    , presentation: Field.Presentation
    , density: Field.Density
    , is_open: Bool
    , page: Int
    , page_size: Int
    , uid: Int -- used for tracking row number
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

create: Tab -> Model
create tab =
    { empty | fields = tab.fields
    }

empty = 
    { name= ""
    , rows= []
    , mode= Field.Read
    , fields = [] 
    , presentation= Field.Table
    , density = Field.Expanded
    , is_open = True
    , page = 0
    , page_size = 15
    , uid = 0 --will be incremented every row added
    }
 

view: Model -> Html Msg
view model =
    let filtered_fields = Row.filter_fields_with_density model.fields model.density
        extended_fields = Row.selected_field :: filtered_fields
        rows = case model.presentation of
        Field.Form ->
             div [class "form"]
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (UpdateRow r.rowId))

                )

        Field.Table ->
            table [class "table-striped"] 
                [thead_view extended_fields
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
        div [] [tab_controls model
               ,toolbar
               ,rows
               ,paging
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

thead_view fields =
    thead []
        [tr []
            (List.map (\f -> th [] [text f.name]) fields
            )
        ]


toolbar: Html Msg
toolbar = 
        div [class "btn-group"]
            [button [class "btn btn-large btn-default"]
                [span [class "icon icon-floppy icon-text"] []
                ,text "save"
                ]
            ,button [class "btn btn-large btn-default"]
                [span [class "icon icon-plus icon-text"] []
                ,text "new" 
                ]
            ,button [class "btn btn-large btn-default"]
                [span [class "icon icon-trash icon-text"] []
                ,text "delete"
                ]
            ,button [class "btn btn-large btn-default"]
                [span [class "icon icon-search icon-text"] []
                ,text "search"
                ]
            ,button [class "btn btn-large btn-default"]
                [span [class "icon icon-hourglass icon-text"] []
                ,text "filter"
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

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        UpdateRow rowId row_msg ->
            ( {model | rows = 
                    (List.map (\r -> 
                        if r.rowId == rowId then
                            let (mr,cmd) = Row.update row_msg r 
                            in mr
                         else
                            r
                        ) model.rows) }, Cmd.none)

        ChangeMode mode ->
            ( {model | mode = mode
                    , rows = 
                    (List.map (\r -> 
                            let (mr,cmd) = Row.update (Row.ChangeMode mode) r 
                            in mr
                        ) model.rows) }, Cmd.none)

        ChangePresentation presentation ->
            ( {model | presentation = presentation
                     , rows = 
                        (List.map (\r ->
                            let (mr, cmd) = Row.update (Row.ChangePresentation presentation ) r
                            in mr
                        )model.rows)}, Cmd.none)

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

 


