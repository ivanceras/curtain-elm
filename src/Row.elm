module Row exposing (..)

import Field
import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Attributes exposing (..)

type alias Model =
    { rowId: String
    , fields: List Field.Model
    , mode: Field.Mode
    , presentation: Field.Presentation
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | FieldChangeMode String Field.Msg


row1 = { rowId= "f6a7b9290012"
     , fields = [Field.name Field.Read
                ,Field.birthday Field.Read
                ,Field.active Field.Read
                ]
     , mode = Field.Edit
     , presentation = Field.Form
    }

row2 = { rowId= "d5eeef812012"
     , fields = [Field.name Field.Read
                ,Field.birthday Field.Read
                ,Field.active Field.Read
                ]
     , mode = Field.Edit
     , presentation = Field.Form
    }

{-| selection columns appended to the rows when viewed in table 
-}

selection: Field.Model
selection = 
    {field = { name = "selected"
              ,reference = "Bool"
              ,data_type = "boolean"
              }
     ,value = Field.Bool True
     ,mode = Field.Edit
     ,presentation = Field.Table
    }

init = 
    (row1, Cmd.none)

view: Model -> Html Msg
view model = 
    let fields = 
    case model.presentation of
        Field.Form ->
            Html.form [] 
               (model.fields
               |> List.map (\f -> Field.view f |> App.map (FieldChangeMode f.field.name))
               )
        Field.Table ->
            let extended_fields = selection :: model.fields
            in
            tr [] 
               (extended_fields
               |> List.map (\f -> Field.view f |> App.map (FieldChangeMode f.field.name))
               )
        Field.Grid ->
            div [style [("border", "1px solid green"), ("width", "200px")]] 
               (model.fields
               |> List.map (\f -> Field.view f |> App.map (FieldChangeMode f.field.name))
               )
    in
    div[] [div [] [button [onClick (ChangeMode Field.Edit)] [text "Edit"]
                  ,button [onClick (ChangeMode Field.Read)] [text "Read"]
                  ,button [onClick (ChangePresentation Field.Table)] [text "Table"]
                  ,button [onClick (ChangePresentation Field.Form)] [text "Form"]
                  ,button [onClick (ChangePresentation Field.Grid)] [text "Grid"]
                   ]
           ,text model.rowId
           ,fields
           ]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeMode mode ->
            ({ model | fields = model.fields
                |> List.map (\f -> 
                    Field.update (Field.ChangeMode mode) f
                  ) }, Cmd.none)
 

        ChangePresentation presentation ->
            ( {model | presentation = presentation
                      ,fields = (model.fields |>
                                   List.map (\f ->
                                         Field.update (Field.ChangePresentation presentation) f
                                    )
                                 )
                        }, Cmd.none )

        FieldChangeMode name field_msg ->
            let _ = Debug.log "Edit only this field" name 
            in
               ({model | fields = model.fields
                |> List.map (\f -> 
                    if f.field.name == name then
                        Field.update field_msg f
                    else
                        f
                  ) }, Cmd.none)



main =
    App.program
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none )
        }
