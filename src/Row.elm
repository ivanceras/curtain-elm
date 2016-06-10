module Row exposing (..)

import Field
import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Dict
import Json.Decode as Decode exposing ((:=))
import Task

type alias Model =
    { row_id: Int
    , field_models: List Field.Model
    , mode: Field.Mode
    , presentation: Field.Presentation
    , density: Field.Density
    , is_focused: Bool --determine by dao state
    , is_selected: Bool
    }

empty =
    { row_id = 0 
    , field_models = []
    , mode = Field.Read
    , presentation = Field.Table
    , density = Field.Expanded
    , is_focused = False
    , is_selected = False
    }


create list_fields row_id =
     let field_models = 
        List.map (\f -> Field.create f) list_fields
     in
     {empty | field_models = field_models
            , row_id = row_id
     }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateField String Field.Msg
    | ChangeDensity Field.Density
    | DaoStateReceived DaoState
    | Selection Bool
    | FocusRecord
    | LooseFocusRecord
    | Close

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






view: Model -> Html Msg
view model = 
    let field_models = filter_field_models_with_density model
    in
    case model.presentation of
        Field.Form ->
            div []
                [ --row_controls model,
                  form_record_controls model
                , Html.form [style [("display", "flex"), ("flex-wrap", "wrap"), ("align-items", "flex-end")]] 
                  (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| field_models)
               ]
        Field.Table ->
            tr [onDoubleClick (ChangePresentation Field.Form)
               ,classList [("focused", model.is_focused), ("selected", model.is_selected)]
               ] 
               ((tabular_record_controls model) ++
                (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| field_models)
               )
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
      [text (toString model.row_id)
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



tabular_record_controls model =
    let selection = 
        let tooltip_text = if model.is_selected then "Click to unselect this record"
            else "Click to select this record"
        in
        td [class "tooltip"] 
                [input [type' "checkbox", checked model.is_selected, onCheck Selection] []
                ,span [class "tooltiptext"] [text tooltip_text]
                ]

        modification_controls = 
            case model.mode of
                Field.Read ->
                    td [class "record_control"] 
                        [div [class "icon icon-menu tooltip", onClick (ChangePresentation Field.Form)] 
                               [span [class "tooltiptext"] [text "Click to open record in a form"]
                               ]
                        ,div [class "icon icon-pencil tooltip", onClick (ChangeMode Field.Edit)]
                               [span [class "tooltiptext"] [text "Click to edit record in the grid"]
                               ]
                        ]
                Field.Edit ->
                    td [class "record_control"] 
                                [div [class "icon icon-block tooltip", onClick (ChangeMode Field.Read)] 
                                    [span [class "tooltiptext"][text "Click to cancel your changes"]
                                    ]
                                ,div [class "icon icon-floppy tooltip", onClick (ChangeMode Field.Read)]
                                    [span [class "tooltiptext"][text "Click to save your changes to the database"]
                                    ]
                                ]
                  

    in
        selection :: [modification_controls]


form_record_controls model =
    div []
        [button [class "btn btn-mini btn-default"]
            [text "Prev"
            ,span [class "icon icon-left-open"] []
            ]
        ,button [class "btn btn-mini btn-default"]
            [text "Next"
            ,span [class "icon icon-right-open"] []
            ]
        ,button [class "btn btn-mini btn-default"]
            [text "Maximize"
            ,span [class "icon icon-resize-full"] []
            ]
        ,button [class "btn btn-mini btn-default", onClick Close]
            [text "Close"
            ,span [class "icon icon-cancel"] []
            ]
        ]


update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeMode mode ->
            ({model | mode = mode 
                    , field_models = 
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
            let _ = Debug.log "-->> ROW tapped signal ---->" column 
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

        Selection checked ->
            ({model | is_selected = checked}, Cmd.none)

        Close -> --tab should tap on this event
            (model, Cmd.none)
         
        FocusRecord ->
            ({model | is_focused = True}, Cmd.none)
        LooseFocusRecord ->
            ({model | is_focused = False}, Cmd.none)

significant_fields: List Field.Model -> List Field.Model
significant_fields field_models =
    List.filter (\f -> f.field.is_significant ) field_models 
    

most_significant: List Field.Model -> Maybe Field.Model
most_significant field_models =
    let significants = significant_fields field_models
        sorted = List.sortWith (
                    \a b -> case a.field.significance_priority of
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
            
            
            
