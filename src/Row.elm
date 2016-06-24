module Row exposing (..)

import Field
import Html exposing (..)
import Html.App as App
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Dict
import Json.Decode as Decode exposing ((:=))
import Task
import String

type alias Model =
    { rowId: Int
    , fieldModels: List Field.Model
    , mode: Field.Mode
    , presentation: Field.Presentation
    , density: Field.Density
    , isFocused: Bool --determine by dao state
    , isSelected: Bool
    }

empty =
    { rowId = 0 
    , fieldModels = []
    , mode = Field.Read
    , presentation = Field.Table
    , density = Field.Expanded
    , isFocused = False
    , isSelected = False
    }


create listFields rowId =
     let fieldModels = 
        List.map (\f -> Field.create f) listFields
     in
     {empty | fieldModels = fieldModels
            , rowId = rowId
     }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | UpdateField String Field.Msg
    | ChangeDensity Field.Density
    | DaoStateReceived DaoState
    | Selection Bool
    | ToggleSelect
    | FocusRecord
    | LooseFocusRecord
    | LookupTabsReceived (List Field.LookupTab)
    | LookupDataReceived (List Field.LookupData)
    | EditRecordInForm
    | EditRecordInPlace

type alias DaoState =
    { dao: Field.Dao
    , focused: Bool
    }

daoStateDecoder =
    Decode.object2 DaoState
        ("dao" := Field.daoDecoder)
        ("focused" := Decode.bool)



excludeKeyfields: List Field.Field -> List Field.Field
excludeKeyfields fieldList =
    List.filter (\f -> not f.isKeyfield) fieldList


excludeKeyfieldModels: List Field.Model -> List Field.Model
excludeKeyfieldModels fieldModels =
    List.filter (\f -> not f.field.isKeyfield) fieldModels 

keyFieldModels: List Field.Model -> List Field.Model
keyFieldModels fieldModels =
    List.filter (\f -> f.field.isKeyfield) fieldModels


-- get the focused record param expressed in [pk_value1, pk_value2]
focusedRecordParam: Model -> String
focusedRecordParam model =
    keyFieldModels model.fieldModels
        |> List.map(
            \f ->
              Field.stringifyValue f 
        )
        |> String.join ","

view: Model -> Html Msg
view model = 
    let fieldModels = filterFieldModelsWithDensity model
                        |> excludeKeyfieldModels
    in
    case model.presentation of
        Field.Form ->
            div []
                [Html.form [style [("display", "flex"), ("flex-wrap", "wrap"), ("align-items", "flex-end")]] 
                  (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| fieldModels)
                ]
        Field.Table ->
            tr [onDoubleClick EditRecordInForm
               ,onClick FocusRecord
               ,classList [("focused", model.isFocused), ("selected", model.isSelected)]
               ,style [("height", "35px")]
               ] 
               (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| fieldModels)
        Field.Grid ->
            div []
                [ div [style [("border", "1px solid green"), ("width", "200px")]] 
                  (List.map (\f -> 
                        App.map (UpdateField f.field.name) <| Field.view f 
                     ) <| fieldModels
                  )
               ]


onClickNoPropagate: msg -> Attribute msg
onClickNoPropagate msg = 
    Decode.succeed msg
        |> onWithOptions "click" {defaultOptions | stopPropagation = True}

onDoubleClickNoPropagate: msg -> Attribute msg
onDoubleClickNoPropagate msg = 
    Decode.succeed msg
        |> onWithOptions "dblclick" {defaultOptions | stopPropagation = True}



rowShadowRecordControls: Model -> Html Msg
rowShadowRecordControls model =
    tr [onDoubleClick EditRecordInForm
       ,onClick FocusRecord
       ,classList [("focused", model.isFocused), ("selected", model.isSelected)]
       ,style [("height", "35px")]
       ] 
       (tabularRecordControls model)


tabularRecordControls: Model -> List (Html Msg)
tabularRecordControls model =
    let selection = 
        let tooltipText = if model.isSelected then "Click to unselect this record"
            else "Click to select this record"
        in
        td [class "tooltip"
           , onClickNoPropagate ToggleSelect
             -- prevent unexpected opening of record in form
           , onDoubleClickNoPropagate ToggleSelect
           ] 
                [input [type' "checkbox"
                       , checked model.isSelected
                       , onCheckNoPropagate Selection
                       , onDoubleCheckNoPropagate Selection
                       ] []
                ,span [class "tooltiptext"] [text tooltipText]
                ]

        modificationControls = 
            case model.mode of
                Field.Read ->
                    td [class "record_control"] 
                        [div [class "icon icon-menu tooltip", onClick EditRecordInForm] 
                               [span [class "tooltiptext"] [text "Click to open record in a form"]
                               ]
                        ,div [class "icon icon-pencil tooltip", onClick EditRecordInPlace]
                               [span [class "tooltiptext"] [text "Click to edit record in the grid"]
                               ]
                        ]
                Field.Edit ->
                    td [class "record_control"] 
                                [div [class "icon icon-block tooltip"] 
                                    [span [class "tooltiptext"][text "Click to cancel your changes"]
                                    ]
                                ,div [class "icon icon-floppy tooltip"]
                                    [span [class "tooltiptext"][text "Click to save your changes to the database"]
                                    ]
                                ]
                  

    in
        selection :: [modificationControls]



update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeMode mode ->
            ({model | mode = mode 
                    , fieldModels = 
                 List.map (\f -> 
                    let (mr,cmd) = Field.update (Field.ChangeMode mode) f
                    in mr
                  ) <| model.fieldModels
              }, Cmd.none)
 

        ChangePresentation presentation ->
            ({ model | presentation = presentation
                     , fieldModels = 
                           List.map (\f ->
                                     let (mr,cmd) = Field.update (Field.ChangePresentation presentation) f
                                     in mr
                                    ) <| model.fieldModels
                                 
             }
             , Cmd.none
             )

        ChangeDensity density ->
            ({model | density = density
                , fieldModels =
                    List.map (
                        \f -> let (mr, cmd) = Field.update (Field.ChangeDensity density) f
                        in mr
                    ) <| model.fieldModels
             }
             , Cmd.none
            )

        UpdateField column fieldMsg ->
           ({model | fieldModels = model.fieldModels
            |> List.map (\f -> 
                if f.field.column == column then
                    let (mr,cmd) = Field.update fieldMsg f
                    in mr
                else
                    f
              ) }, Cmd.none)

        DaoStateReceived daoState ->
            let fieldModels =
                List.map(
                    \f ->
                        let value = Dict.get f.field.column daoState.dao
                        in
                        case value of
                            Just value ->
                                let (mo, cmd) = Field.update (Field.SetValue value) f
                                in mo
                            Nothing -> f
                ) model.fieldModels
            in
            ({model | isFocused = daoState.focused
                    , fieldModels = fieldModels
              }
            , Cmd.none
            )

        Selection checked ->
            ({model | isSelected = checked}, Cmd.none)

        ToggleSelect ->
            ({model | isSelected = not model.isSelected}, Cmd.none)

        FocusRecord ->
            ({model | isFocused = True}, Cmd.none)
        LooseFocusRecord ->
            ({model | isFocused = False}, Cmd.none)

        LookupTabsReceived lookupTabFields ->
            (updateLookupFields (Field.LookupTabsReceived lookupTabFields) model
            , Cmd.none
            ) 
        LookupDataReceived lookupDataList ->
            (updateLookupFields (Field.LookupDataReceived lookupDataList) model
            , Cmd.none
            ) 
        EditRecordInForm -> -- tapped in Tab
            (model, Cmd.none)
        EditRecordInPlace -> -- tapped in Tab
            (model, Cmd.none)

--add lookup fields only to those which needed it
updateLookupFields: Field.Msg -> Model -> Model
updateLookupFields fieldMsg model =
    let updatedFields = 
           List.map (
                \f ->
                    if f.field.reference == "Table" then
                        let (updatedField, cmd) = Field.update fieldMsg f
                        in updatedField
                    else f
           ) model.fieldModels 
    in
    {model | fieldModels = updatedFields}

updateFields: Field.Msg -> Model -> Model
updateFields fieldMsg model =
    let updatedFields = 
           List.map (
                \f ->
                    let (updatedField, cmd) = Field.update fieldMsg f
                    in updatedField
           ) model.fieldModels 
    in
    {model | fieldModels = updatedFields}


onCheckNoPropagate: (Bool -> msg ) -> Attribute msg
onCheckNoPropagate msg =
    Decode.map msg targetChecked
        |> onWithOptions "click" {defaultOptions | stopPropagation = True}


onDoubleCheckNoPropagate: (Bool -> msg ) -> Attribute msg
onDoubleCheckNoPropagate msg =
    Decode.map msg targetChecked
        |> onWithOptions "dblclick" {defaultOptions | stopPropagation = True}

toList: Maybe a -> List a
toList arg =
    case arg of
        Just a -> [a]
        Nothing -> []


filterFieldModelsWithDensity: Model -> List Field.Model
filterFieldModelsWithDensity model =
    case model.density of
        Field.Compact -> --only the most significant
            toList (Field.mostSignificantModel model.fieldModels)
        Field.Medium -> -- all significant fields
            Field.significantModels model.fieldModels
        Field.Expanded -> model.fieldModels -- all fields
 

filterFieldsWithDensity: List Field.Field -> Field.Density -> List Field.Field
filterFieldsWithDensity fields density =
    case density of
        Field.Compact -> toList (Field.mostSignificantField fields)
        Field.Medium -> Field.significantFields fields
        Field.Expanded -> fields
            
            
            
