module Row exposing (..)

import Field
import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Attributes exposing (..)

type alias Model =
    { rowId: String
    , field_models: List Field.Model
    , mode: Field.Mode
    , presentation: Field.Presentation
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | FieldChangeMode String Field.Msg


fields = [Field.name_field
        ,Field.bday_field
        ,Field.active_field
        ]

field_values = [Field.name
        ,Field.birthday
        ,Field.active
        ]

row1 = { rowId= "f6a7b9290012"
     , field_models = field_values 
     , mode = Field.Edit
     , presentation = Field.Form
    }

row2 = { rowId= "d5eeef812012"
     , field_models =  field_values
     , mode = Field.Edit
     , presentation = Field.Form
    }

{-| selection columns appended to the rows when viewed in table 
-}

selected_field =
    { name = "selected"
     ,reference = "Bool"
     ,data_type = "boolean"
    }

selected: Field.Model
selected = 
    {field = selected_field 
     ,value = Field.Bool True
     ,mode = Field.Edit
     ,presentation = Field.Table
     ,focused = False
    }

init = 
    (row1, Cmd.none)

view: Model -> Html Msg
view model = 
    case model.presentation of
        Field.Form ->
            div []
                [ row_controls model
                , Html.form [] 
                  (List.map (\f -> App.map (FieldChangeMode f.field.name) <| Field.view f ) <| model.field_models)
               ]
        Field.Table ->
            let extended_fields = selected :: model.field_models
            in
            tr [onDoubleClick (ChangeMode Field.Edit)] 
               (List.map (\f -> App.map (FieldChangeMode f.field.name) <| Field.view f ) <| extended_fields)
        Field.Grid ->
            div []
                [ row_controls model
                , div [style [("border", "1px solid green"), ("width", "200px")]] 
                  (List.map (\f -> App.map (FieldChangeMode f.field.name) <| Field.view f ) <| model.field_models)
               ]

row_controls model =  
    div [] 
      [text model.rowId
      ,button [onClick (ChangeMode Field.Edit)] [text "Edit"]
      ,button [onClick (ChangeMode Field.Read)] [text "Read"]
      ,button [onClick (ChangePresentation Field.Table)] [text "Table"]
      ,button [onClick (ChangePresentation Field.Form)] [text "Form"]
      ,button [onClick (ChangePresentation Field.Grid)] [text "Grid"]
       ]

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeMode mode ->
            ({ model | field_models = 
                 List.map (\f -> 
                    let (mr,cmd) = Field.update (Field.ChangeMode mode) f
                    in mr
                  ) <| model.field_models
              }, Cmd.none)
 

        ChangePresentation presentation ->
            ({ model | presentation = presentation
                     , field_models = 
                           List.map (\f ->
                                     let (mr,cmd) = Field.update (Field.ChangePresentation presentation) f
                                     in mr
                                    ) <| model.field_models
                                 
             }
             , Cmd.none
             )

        FieldChangeMode name field_msg ->
            let _ = Debug.log "Edit only this field" name 
            in
               ({model | field_models = model.field_models
                |> List.map (\f -> 
                    if f.field.name == name then
                        let (mr,cmd) = Field.update field_msg f
                        in mr
                    else
                        f
                  ) }, Cmd.none)


