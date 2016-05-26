module Tab exposing (..)

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
    , fields: List Field.Model
    , presentation: Field.Presentation
    }


type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | RowChangeMode String Row.Msg


init =
    ({name= "Person"
     ,rows= [Row.row1, Row.row2]
     ,mode= Field.Read
     ,fields= []
     ,presentation= Field.Table
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
            table [] 
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (RowChangeMode r.rowId))

                )

        Field.Grid ->
             div [class "grid"]
                (model.rows
                    |> List.map (\r -> Row.view r |> App.map (RowChangeMode r.rowId))

                )
    in 
        div [] [button [onClick (ChangeMode Field.Edit)] [text "Edit All rows"]
                  ,button [onClick (ChangeMode Field.Read)] [text "Read All rows"]
                  ,button [onClick (ChangePresentation Field.Table)] [text "Table All rows"]
                  ,button [onClick (ChangePresentation Field.Form)] [text "Form All rows"]
                  ,button [onClick (ChangePresentation Field.Grid)] [text "Grid All rows"]
                  ,div [][rows]
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
                            in
                            mr
                        )model.rows)}, Cmd.none)

 
main = 
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none)
        }
