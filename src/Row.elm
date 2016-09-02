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
import Presentation exposing 
    (Presentation (Table, Form, Grid)
    ,Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing (DaoState)

type alias Model =
    { rowId: Int
    , fieldModels: List Field.Model
    , mode: Mode
    , presentation: Presentation
    , density: Density
    , isFocused: Bool --determine by dao state
    , isSelected: Bool
    }



-- get the Dao which also contain the changes
getDao: Model -> Dao.Dao
getDao model =
    List.filterMap(
        \f ->
        case f.value of
            Nothing -> Nothing
            Just value ->
                Just (f.field.column, value)
    ) model.fieldModels
        |> Dict.fromList


getDaoUpdate: Model -> Dao.DaoUpdate
getDaoUpdate model =
    { original = getOrigDao model
    , updated = getDao model
    }

getDaoInsert: Model -> Dao.DaoInsert
getDaoInsert model =
    { recordId = "00000000-0000-0000-0000-000000000000"
    , dao = getDao model
    }

-- get the original Dao, used for deletion
getOrigDao: Model -> Dao.Dao
getOrigDao model =
    List.filterMap(
        \f ->
        case f.orig_value of
            Nothing -> Nothing
            Just orig_value ->
                Just (f.field.column, orig_value)
    ) model.fieldModels
        |> Dict.fromList


empty =
    { rowId = 0 
    , fieldModels = []
    , mode = Read
    , presentation = Table
    , density = Expanded
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
    = ChangeMode Mode
    | ChangePresentation Presentation
    | UpdateField String Field.Msg
    | ChangeDensity Density
    | DaoStateReceived DaoState
    | Selection Bool
    | ToggleSelect
    | FocusRecord
    | LooseFocusRecord
    | LookupTabsReceived (List Field.LookupTab)
    | LookupDataReceived (List Field.LookupData)
    | EditRecordInForm
    | EditRecordInPlace
    | ClickedCancelChanges
    | ClickedSaveChanges

type OutMsg = Remove
    | TabChangePresentation Presentation
    | CancelChanges
    | SaveChanges
    | TabEditRecordInForm
    | FocusChanged




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
        Form ->
            div []
                [Html.form [style [("display", "flex"), ("flex-wrap", "wrap"), ("align-items", "flex-end")]] 
                  (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| fieldModels)
                ]
        Table ->
            tr [onDoubleClick EditRecordInForm
               ,onClick FocusRecord
               ,classList [
                     ("focused", model.isFocused)
                    ,("selected", model.isSelected)
                    ,("modified", isModified model)
                    ,("inserted", isNew model)
                   ]
               ,style [("height", "35px")]
               ] 
               (List.map (\f -> App.map (UpdateField f.field.column) <| Field.view f ) <| fieldModels)
        Grid ->
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
       ,classList [
             ("focused", model.isFocused)
            ,("selected", model.isSelected)
            ,("modified", isModified model)
            ,("inserted", isNew model)
            ]
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
                Read ->
                    td [class "record_control"] 
                        [div [class "icon icon-menu tooltip"
                              ,onClickNoPropagate EditRecordInForm] 
                               [span [class "tooltiptext"] [text "Click to open record in a form"]
                               ]
                        ,div [class "icon icon-pencil tooltip"
                             ,onClick EditRecordInPlace]
                               [span [class "tooltiptext"] [text "Click to edit record in the grid"]
                               ]
                        ]
                Edit ->
                    td [class "record_control"] 
                                [div [class "icon icon-block tooltip"
                                      ,onClick ClickedCancelChanges] 
                                    [span [class "tooltiptext"][text "Click to cancel your changes"]
                                    ]
                                ,div [class "icon icon-floppy tooltip"
                                        ,onClick ClickedSaveChanges]
                                    [span [class "tooltiptext"][text "Click to save your changes to the database"]
                                    ]
                                ]
                  

    in
        selection :: [modificationControls]



update: Msg -> Model -> (Model, Maybe OutMsg)
update msg model =
    case msg of
        ChangeMode mode ->
            ({ model | mode = mode }
                |> updateFields (Field.ChangeMode mode)
              ,Nothing)
 

        ChangePresentation presentation ->
            ({ model | presentation = presentation }
                |> updateFields (Field.ChangePresentation presentation) 
             , Nothing
             )

        ChangeDensity density ->
            ({model | density = density }
                |> updateFields (Field.ChangeDensity density)
             , Nothing
            )

        UpdateField column fieldMsg ->
           ({model | fieldModels = model.fieldModels
            |> List.map (\f -> 
                if f.field.column == column then
                    let (mr,cmd) = Field.update fieldMsg f
                    in mr
                else
                    f
              ) }, Nothing)

        DaoStateReceived daoState ->
            let fieldModels =
                List.map(
                    \f ->
                        let value = Dict.get f.field.column daoState.dao
                        in
                        case value of
                            Just value ->
                                let (field', outmsg') = Field.update (Field.SetValue value) f
                                in 
                                    field'
                            Nothing -> f
                ) model.fieldModels
            in
            ({model | isFocused = daoState.focused
                    , fieldModels = fieldModels
              }
            , Nothing
            )

        Selection checked ->
            ({model | isSelected = checked}, Nothing)

        ToggleSelect ->
            ({model | isSelected = not model.isSelected}, Nothing)

        FocusRecord ->
            ({model | isFocused = True}, Just FocusChanged)
        LooseFocusRecord ->
            ({model | isFocused = False}, Nothing)

        LookupTabsReceived lookupTabFields ->
            (updateLookupFields (Field.LookupTabsReceived lookupTabFields) model
            , Nothing
            ) 
        LookupDataReceived lookupDataList ->
            (updateLookupFields (Field.LookupDataReceived lookupDataList) model
            , Nothing
            ) 
        EditRecordInForm -> -- tapped in Tab
            ({ model | mode = Edit
             ,presentation = Form
             }
                |> updateFields (Field.ChangeMode Edit)
                |> updateFields (Field.ChangePresentation Form)
             ,Just TabEditRecordInForm
            )
        EditRecordInPlace -> -- tapped in Tab
            ({model | mode = Edit
             ,presentation = Table
              }
                |> updateFields (Field.ChangeMode Edit)
                |> updateFields (Field.ChangePresentation Table)
            , Nothing)

        ClickedCancelChanges ->
            ({model | mode = Read
             ,presentation = Table
             }
                |> updateFields Field.CancelChanges
            , Just CancelChanges)

        ClickedSaveChanges ->
            ({model | mode = Read
             ,presentation = Table
             }
            , Just SaveChanges)


--determine whether at least 1 field of the row is modified
isModified: Model -> Bool
isModified model =
    List.any
        (\f ->
            Field.isModified f 
        ) model.fieldModels

-- if all of the fields is new then this is a new record
isNew: Model -> Bool
isNew model =
    List.all
        (\f ->
            Field.isNew f
        ) model.fieldModels


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
                    let (updatedField, outmsg) = Field.update fieldMsg f
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
        Compact -> --only the most significant
            toList (Field.mostSignificantModel model.fieldModels)
        Medium -> -- all significant fields
            Field.significantModels model.fieldModels
        Expanded -> model.fieldModels -- all fields
 

filterFieldsWithDensity: List Field.Field -> Density -> List Field.Field
filterFieldsWithDensity fields density =
    case density of
        Compact -> toList (Field.mostSignificantField fields)
        Medium -> Field.significantFields fields
        Expanded -> fields
            
            
            
