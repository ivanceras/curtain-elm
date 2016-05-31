module Tab exposing (..)

import Field
import Row
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Html.App as App


type alias Model =
    { name: String 
    , rows: List Row.Model
    , mode: Field.Mode
    , fields: List Field.Field
    , presentation: Field.Presentation
    , density: Field.Density
    }


type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | ChangeDensity Field.Density
    | UpdateRow String Row.Msg


init =
    ({name= "Person"
     ,rows= [Row.row1, Row.row2]
     ,mode= Field.Read
     ,fields= Row.fields
     ,presentation= Field.Form
     ,density = Field.Medium
    },Cmd.none)

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
               ,rows
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

update: Msg -> Model -> (Model, Cmd msg)
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


 
main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none)
        }



