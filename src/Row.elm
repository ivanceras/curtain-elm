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
    , density: Field.Density
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateField String Field.Msg
    | ChangeDensity Field.Density


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
     , density = Field.Medium
    }

row2 = { rowId= "d5eeef812012"
     , field_models =  field_values
     , mode = Field.Edit
     , presentation = Field.Form
     , density = Field.Medium
    }

{-| selection columns appended to the rows when viewed in table 
-}

selected_field =
    { name = "selected"
     ,column = "selected"
     ,complete_name = "person.selected"
     ,is_keyfield = False
     ,data_type = "boolean"
     ,reference = "Bool"
     ,reference_value = Nothing
     ,description = Nothing
     ,info = Nothing
     ,is_significant = False
     ,significance_priority = Nothing
     ,include_in_search = False
     ,is_mandatory = False
     ,seq_no = 0
     ,is_same_line = False
     ,is_displayed = True
     ,is_readonly = False
     ,is_autocomplete = False
     ,display_logic = Nothing
     ,display_length = Just 1
     ,display_value = Nothing
    }

selected: Field.Model
selected = 
    {field = selected_field 
     ,value = Field.Bool True
     ,mode = Field.Edit
     ,presentation = Field.Table
     ,density = Field.Expanded
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
                  (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| model.field_models)
               ]
        Field.Table ->
            let extended_fields = selected :: model.field_models
            in
            tr [onDoubleClick (ChangeMode Field.Edit)] 
               (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| extended_fields)
        Field.Grid ->
            let most_sig = most_significant model.field_models
                _ = Debug.log "most significant" most_sig
            in
            div []
                [ row_controls model
                , div [style [("border", "1px solid green"), ("width", "200px")]] 
                  (List.map (\f -> 
                        case model.density of
                            Field.Compact ->
                                case most_sig of
                                    Just most_sig ->
                                        if most_sig  == f then
                                            App.map (UpdateField f.field.name) <| Field.view f 
                                        else
                                            div [] []

                                    Nothing ->
                                        div [] []
                            _ ->
                                App.map (UpdateField f.field.name) <| Field.view f 
                     ) <| model.field_models
                  )
               ]

row_controls model =  
    div [] 
      [text model.rowId
      ,button [onClick (ChangeMode Field.Edit)] [text "Edit"]
      ,button [onClick (ChangeMode Field.Read)] [text "Read"]
      ,button [onClick (ChangePresentation Field.Table)] [text "Table"]
      ,button [onClick (ChangePresentation Field.Form)] [text "Form"]
      ,button [onClick (ChangePresentation Field.Grid)] [text "Grid"]
      ,button [onClick (ChangeDensity Field.Compact)] [text "Compact"]
      ,button [onClick (ChangeDensity Field.Medium)] [text "Medium"]
      ,button [onClick (ChangeDensity Field.Expanded)] [text "Expanded"]
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

        ChangeDensity density ->
            ({model | density = density
                , field_models =
                    List.map (
                        \f -> let (mr, cmd) = Field.update (Field.ChangeDensity density) f
                        in mr
                    ) <| model.field_models
             }
             , Cmd.none
            )

        UpdateField column field_msg ->
            let _ = Debug.log "Edit only this field" column 
            in
               ({model | field_models = model.field_models
                |> List.map (\f -> 
                    if f.field.column == column then
                        let (mr,cmd) = Field.update field_msg f
                        in mr
                    else
                        f
                  ) }, Cmd.none)


most_significant: List Field.Model -> Maybe Field.Model
most_significant field_models =
    let significants = List.filter (\f -> f.field.is_significant ) field_models 
        sorted = List.sortWith (\a b -> case a.field.significance_priority of
                                Just a ->
                                    case b.field.significance_priority of
                                        Just b ->
                                            compare a b
                                        Nothing ->
                                            EQ
                                Nothing ->
                                    EQ


                     ) significants
    in List.head sorted
    
