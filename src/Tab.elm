port module Tab exposing (..)

import Field
import Row
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Html.App as App
import Row


type alias Model =
    { name: String 
    , rows: List Row.Model
    , mode: Field.Mode
    , fields: List Field.Field
    , presentation: Field.Presentation
    }


type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | RowChangeMode String Row.Msg
    | ReceivedMsg String


init =
    ({name= "Person"
     ,rows= [Row.row1, Row.row2]
     ,mode= Field.Read
     ,fields=  Row.selected_field :: Row.fields
     ,presentation= Field.Form
    },Cmd.none)

view: Model -> Html Msg
view model =
    let rows = case model.presentation of
        Field.Form ->
             div [class "form"]
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (RowChangeMode r.rowId))

                )

        Field.Table ->
            table [class "table-striped"] 
                [thead_view model.fields
                ,tbody []
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (RowChangeMode r.rowId))

                )
                ]

        Field.Grid ->
             div [class "grid"]
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (RowChangeMode r.rowId))

                )
    in 
        div [] [tab_controls model
               ,rows
               ]

tab_controls model =
    div [] [button [onClick (ChangeMode Field.Edit)] [text "Edit All rows"]
           ,button [onClick (ChangeMode Field.Read)] [text "Read All rows"]
           ,button [onClick (ChangePresentation Field.Table)] [text "Table All rows"]
           ,button [onClick (ChangePresentation Field.Form)] [text "Form All rows"]
           ,button [onClick (ChangePresentation Field.Grid)] [text "Grid All rows"]
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
        RowChangeMode rowId row_msg ->
            ( {model | rows = 
                    (List.map (\r -> 
                        if r.rowId == rowId then
                            let (mr,cmd) = Row.update row_msg r 
                            in mr
                         else
                            r
                        ) model.rows) }, focus_row rowId)

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
                            in
                            mr
                        )model.rows)}, Cmd.none)

        ReceivedMsg msg ->
         let _ = Debug.log "received" msg
         in
         (model, focus_row "focusing row")

 
main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


subscriptions model =
  suggestions ReceivedMsg

port suggestions : (String -> msg) -> Sub msg

port focus_row : String -> Cmd msg
