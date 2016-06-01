module Row exposing (..)

import Field
import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Dict
import Json.Decode as Decode exposing ((:=))

type alias Model =
    { rowId: String
    , field_models: List Field.Model
    , mode: Field.Mode
    , presentation: Field.Presentation
    , density: Field.Density
    , is_focused: Bool --determine by dao state
    }

empty =
    { rowId = "rowX"
    , field_models = []
    , mode = Field.Read
    , presentation = Field.Table
    , density = Field.Expanded
    , is_focused = False
    }


create list_fields =
     let field_models = 
        List.map (\f -> Field.create f) list_fields
     in
     {empty | field_models = field_models}

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateField String Field.Msg
    | ChangeDensity Field.Density
    | DaoStateReceived DaoState

type alias Dao = Dict.Dict String Field.Value
type alias DaoState =
    { dao: Dao
    , focused: Bool
    }

dao_state_decoder =
    Decode.object2 DaoState
        ("dao" := dao_decoder)
        ("focused" := Decode.bool)

dao_decoder =
    Decode.dict Field.value_decoder




{-| selection columns appended to the rows when viewed in table 
-}

selected_field =
    { name = "Selected"
     ,column = "selected"
     ,complete_name = "selected"
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


view: Model -> Html Msg
view model = 
    let field_models = filter_field_models_with_density model
    in
    case model.presentation of
        Field.Form ->
            div []
                [ row_controls model
                , Html.form [] 
                  (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| field_models)
               ]
        Field.Table ->
            let extended_fields = selected :: field_models
            in
            tr [onDoubleClick (ChangeMode Field.Edit)] 
               (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| extended_fields)
        Field.Grid ->
            div []
                [ row_controls model
                , div [style [("border", "1px solid green"), ("width", "200px")]] 
                  (List.map (\f -> 
                        App.map (UpdateField f.field.name) <| Field.view f 
                     ) <| field_models
                  )
               ]

        Field.List ->
            option []
              (List.map (\f -> 
                    App.map (UpdateField f.field.name) <| Field.view f 
               ) <| field_models
              )

row_controls model =  
    div [] 
      [text model.rowId
      ,button [onClick (ChangeMode Field.Edit)] [text "Edit"]
      ,button [onClick (ChangeMode Field.Read)] [text "Read"]
      ,button [onClick (ChangePresentation Field.Table)] [text "Table"]
      ,button [onClick (ChangePresentation Field.Form)] [text "Form"]
      ,button [onClick (ChangePresentation Field.Grid)] [text "Grid"]
      ,button [onClick (ChangePresentation Field.List)] [text "List"]
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

        DaoStateReceived dao_state ->
            let _ = Debug.log "Row received dao_state" dao_state
                field_models =
                List.map(
                    \f ->
                        let value = Dict.get f.field.column dao_state.dao
                            _ = Debug.log "value" value
                        in
                        case value of
                            Just value ->
                                let (mo, cmd) = Field.update (Field.SetValue value) f
                                in mo
                            Nothing -> 
                                let _ = Debug.log "no value"
                                in
                                f
                ) model.field_models
            in
            ({model | is_focused = dao_state.focused
                    , field_models = field_models
              }
            , Cmd.none
            )


significant_fields: List Field.Model -> List Field.Model
significant_fields field_models =
    List.filter (\f -> f.field.is_significant ) field_models 
    

most_significant: List Field.Model -> Maybe Field.Model
most_significant field_models =
    let significants = significant_fields field_models
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
    

to_list: Maybe a -> List a
to_list arg =
    case arg of
        Just a -> [a]
        Nothing -> []


filter_field_models_with_density: Model -> List Field.Model
filter_field_models_with_density model =
    case model.density of
        Field.Compact -> --only the most significant
            to_list (most_significant model.field_models)
        Field.Medium -> -- all significant fields
            significant_fields model.field_models
        Field.Expanded -> model.field_models -- all fields
 

filter_fields_with_density: List Field.Field -> Field.Density -> List Field.Field
filter_fields_with_density fields density =
    let significant_fields = List.filter (\f -> f.is_significant) fields
        sorted = List.sortWith( \a b -> case a.significance_priority of 
            Just a ->
                case b.significance_priority of
                    Just b -> compare a b
                    Nothing -> EQ
            Nothing -> EQ
        ) significant_fields
        most_sig = to_list (List.head sorted)
    in                    
    case density of
        Field.Compact -> most_sig
        Field.Medium -> significant_fields
        Field.Expanded -> fields
            
            
            
