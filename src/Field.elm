module Field exposing (..)

import Json.Decode as Decode exposing ((:=)) 
import Json.Decode.Extra as Extra exposing ((|:))
import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Task
import String
import Random
import Dict
import Json.Decode as Decode exposing (Decoder)
import Mode exposing 
    (Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing 
    (Dao
    ,Value(Bool,I8,I16,I32,I64,U8,U16,U32,U64,F32,F64,String,Date,DateTime,Uuid)
    )

import Utils

type alias Model = 
    { field: Field
    , value: Maybe Value
    , orig_value: Maybe Value -- the original value, useful for Undo, this is read-only
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
    , density: Density
    }

create: Field -> Model
create field =
    { field = field
    , value = Nothing
    , orig_value = Nothing
    , mode = Read
    , presentation = Table
    , focused = False
    , density = Expanded
    }

{- | Presentation - describes how the data 
    is presented to the client
    Table  - displays in tabular format for large data set 
            but with enough screen space
    Form - displays 1 row of data consuming the work area
           ideal for editing 1 row of record
    Grid - displays the large dataset in a grid like manner
            like icons for apps. This is useful when the screen area is very tight
         - Each record is crumpled into a uniform small box
-}

type Presentation = Table | Form | Grid


type alias Field =
    { name: String
    , column: String
    , completeName: String
    , isKeyfield: Bool
    , dataType: String
    , reference: String
    , referenceValue: Maybe String
    , description: Maybe String
    , info: Maybe String
    , isSignificant: Bool
    , significancePriority: Maybe Int
    , includeInSearch: Bool
    , isMandatory: Bool
    , seqNo: Int
    , isAuxilliary: Bool
    , isSameLine: Bool
    , isDisplayed: Bool
    , isReadonly: Bool
    , isAutocomplete: Bool
    , displayLogic: Maybe String
    , displayLength: Maybe Int
    , displayValue: Maybe String
    }

type Msg
    = ChangeValue String
    | ChangeValueBool Bool
    | ChangeMode Mode 
    | ChangePresentation Presentation
    | ChangeDensity Density
    | SetValue Value -- The value gotten from the server, don't use this when changing the value, since it also sets the orig_value
    | UpdateValue Value
    | CancelChanges

type OutMsg = RequestDataFromTable -- applicable for lookup fields

fieldDecoder = 
   Decode.succeed Field
         |: ("name" := Decode.string)
         |: ("column" :=  Decode.string)
         |: ("complete_name" := Decode.string)
         |: ("is_keyfield" := Decode.bool)
         |: ("data_type" := Decode.string)
         |: ("reference" := Decode.string)
         |: (Decode.maybe ("reference_value" := Decode.string))
         |: (Decode.maybe ("description" := Decode.string))
         |: (Decode.maybe ("info" := Decode.string))
         |: ("is_significant" := Decode.bool)
         |: (Decode.maybe ("significance_priority" := Decode.int))
         |: ("include_in_search" := Decode.bool)
         |: ("is_mandatory" := Decode.bool)
         |: ("seq_no" := Decode.int)
         |: ("is_auxilliary" := Decode.bool)
         |: ("is_same_line" := Decode.bool)
         |: ("is_displayed" := Decode.bool)
         |: ("is_readonly" := Decode.bool)
         |: ("is_autocomplete" := Decode.bool)
         |: (Decode.maybe ("display_logic" := Decode.string))
         |: (Decode.maybe ("display_length" := Decode.int))
         |: (Decode.maybe ("default_value" := Decode.string))


tooltipText: Field -> Html msg
tooltipText field = 
    case field.description of
        Just desc ->
            if not <| String.isEmpty <| String.trim desc then
                span [class "tooltiptext"] [text desc]
            else text ""
        Nothing -> text ""


view : Model -> Html Msg
view model = 
     let labelStyle = style [ ("width", "200px") 
                             , ("text-align", "left")
                             , ("padding-top", "5px")
                             , ("display", "block")
                             , ("margin-bottom", "0px")
                             , ("font-size", "0.8em")
                             ]
         editField = fieldEntry model
         labelCheck = if isMandatoryOk model then
                style []
             else
                style [("color", "red")]

            
         labelHtml = 
            span [class "tooltip"] 
                [label [labelCheck, labelStyle] 
                    [text (model.field.name)
                    ,tooltipText model.field
                    ]
                ]
         width = case model.field.displayLength of
            Just len -> len * 10
            Nothing -> 200

     in
     case model.presentation of
            Form ->
                let formContainerStyle = style [("width","350px"),("padding", "2px")]
                    labelBool = label [style [("margin-left","10px"),("margin-bottom", "0px")]] [text (model.field.name)]
                in
                case model.mode of
                    -- edit form
                    Edit ->
                        case model.field.dataType of
                            "Bool" -> -- checkbox before label
                                div [formContainerStyle]
                                    [div [style [("margin-top", "2em")]]
                                        [editField
                                        ,labelBool
                                        ]
                                    ]

                            _ ->
                                div [formContainerStyle]
                                    [labelHtml
                                    ,editField
                                    ]
                    --read form
                    Read ->
                        case model.field.dataType of
                            "Bool" ->
                                div [formContainerStyle]
                                    [div [style [("padding", "2px"), ("display", "inline-block")]] [(fieldRead model)]
                                    ,labelBool
                                    ]
                            _ ->
                                div [formContainerStyle]
                                    [labelHtml
                                    ,div [style [("padding", "2px")], alignment model.field] [(fieldRead model)]
                                    ]

            Table ->
                let containerStyle = if isMandatoryOk model then
                        style []
                     else
                        style [("border", "1px solid red")]
                in
                case model.mode of
                    -- edit table
                    Edit ->
                        td [alignment model.field
                           ] [editField]
                    --read table
                    Read ->
                        td [(alignment model.field), containerStyle
                           ]
                           [div [style [("width", (toString width)++"px")]] [(fieldRead model)]
                           ]
            Grid ->
                case model.mode of
                    -- edit grid
                    Edit ->
                        editField

                    -- read grid
                    Read ->
                        case model.density of
                            Compact -> -- the most significant field without bold
                                if model.field.isSignificant then
                                    div [] 
                                        [(fieldRead model)
                                        ]
                                else
                                    div[] []
                            Medium -> --only significant fields
                                if model.field.isSignificant then
                                    let textStyle = style [("font-weight", "bold")]
                                    in
                                    div [ textStyle] 
                                        [(fieldRead model)
                                        ]
                                else
                                    div[] []

                            Expanded -> --all fields are displayed
                                let textStyle = if model.field.isSignificant then
                                        style [("font-weight", "bold")]
                                    else
                                        style []

                                    width = case model.field.displayLength of
                                        Just len -> len * 10
                                        Nothing -> 200
                                in
                                div [ textStyle, style [("width", (toString width)++"px")]] 
                                    [(fieldRead model)
                                    ]

update: Msg -> Model -> (Model, List OutMsg)
update msg model =
    case msg of
        ChangeValue v ->
            ({model | value = Just (String v) }
            , [])
        ChangeValueBool b ->
            ({model | value = Just (Bool b)}
            , [])
        CancelChanges ->
            ({ model | value = model.orig_value}
            , []
            )
        ChangeMode mode ->
            ({model | mode = mode }, [])

        ChangePresentation presentation ->
            ({model | presentation = presentation}, [] )

        ChangeDensity density ->
            ({model | density = density}, [])

        SetValue value ->
            ({model | value = Just value
                , orig_value = Just value
             }, [])

        UpdateValue value ->
            ({model | value = Just value
             }, [])


isEmptyValue: Maybe Value -> Bool
isEmptyValue value =
    case value of
        Just fieldValue ->
            case fieldValue of
                String v ->
                    String.isEmpty v
                _ ->
                    False 
        Nothing -> True

isMandatoryOk model =
     if isEmptyValue model.value && model.field.isMandatory then
        False
     else
        True

fieldEntry: Model -> Html Msg
fieldEntry model =
    let focusedField = case model.focused of
            True -> class "focused_field"
            False -> class ""
        width = case model.field.displayLength of
            Just len -> len * 10
            Nothing -> 200

        fieldCheck = if isMandatoryOk model then
            style []
        else
            style [("border", "1px solid red")]
        textWidth = 
              style [("width", (toString width)++"px")
                    ,("border","0")
                    ,("outline", "0")
                    ,("border-bottom", "1px solid #ccc")
                    ,("background-color", "#fff")
                    ]
    in

        case model.field.dataType of
            "String" ->
                if width > 200 && model.presentation == Form then
                    let r = width // 300
                    in
                    textarea [style [("width", "300px")], rows r] [text (Dao.stringifyMaybeValue model.value)]
                else 
                    input [ type' "text"
                          , fieldCheck
                          , leftAlign
                          , textWidth
                          , focusedField
                          , value (Dao.stringifyMaybeValue model.value)
                          , onInput ChangeValue
                          ] []


            "Bool" ->
                let boolValue = 
                    case model.value of
                        Just (Bool b) -> b
                        _ -> False
                in
                input [ type' "checkbox"
                      , fieldCheck
                      , leftAlign
                      , checked boolValue
                      , onCheck ChangeValueBool
                      ] []


            "I64" ->      
                input [ type' "number"
                      , fieldCheck
                      , rightAlign
                      , textWidth
                      , value (Dao.stringifyMaybeValue model.value)
                      ] []

            "I32" ->
                input [ type' "number"
                      , fieldCheck
                      , rightAlign
                      , textWidth
                      , value (Dao.stringifyMaybeValue model.value)
                      ] []
                    
            "F64" ->
                input [ type' "number"
                      , fieldCheck
                      , rightAlign
                      , textWidth
                      , value (Dao.stringifyMaybeValue model.value)
                      ] []

            "Date" ->
                input [ type' "date"
                      , value (Utils.simpleDate <| Dao.stringifyMaybeValue model.value) 
                      , textWidth
                      , rightAlign
                      , onInput ChangeValue
                      ] []

            "DateTime" ->
                input [ type' "datetime"
                      , value (Utils.simpleDate <| Dao.stringifyMaybeValue model.value)
                      , textWidth
                      , rightAlign
                      , onInput ChangeValue
                      ] []
            
            "Uuid" ->
                input [ type' "text"
                      , textWidth
                      , leftAlign
                      , value (Dao.stringifyMaybeValue model.value) 
                      ] []
                        

            _ ->
                input [ type' "text"
                      , textWidth
                      , leftAlign
                      , value (Dao.stringifyMaybeValue model.value)
                      ] []
        



fieldRead: Model -> Html Msg
fieldRead model = 
    case model.value of
        Just fieldValue ->
            case fieldValue of
                String s -> 
                    let width = case model.field.displayLength of
                            Just len -> 10 * len
                            Nothing -> 200

                        fieldStyle = 
                            style [("width", (toString width)++"px")
                                  ,("height", "20px")
                                  ,("overflow", "hidden")
                                  ,("text-overflow", "ellipsis")
                                  ]
                        emptyStyle = style [("border-bottom", "1px solid #eee")]
                    in
                    if String.isEmpty s then
                        div [fieldStyle, emptyStyle] []
                    else
                        div [fieldStyle] [text s]
                Bool b ->
                    case b of
                        True ->
                            span [class "icon icon-check text-center", style [("color", "green")]] []
                        False ->
                            span [class "icon icon-cancel text-center", style [("color", "red")]] []
                I32 v ->
                    text (toString v)
                I64 v ->
                    text (toString v)
                F64 v ->
                    text (toString v)

                Date d ->
                    text d
                DateTime d ->
                    text (Utils.simpleDate d)

                Uuid v ->
                    text v

                _  ->
                    text (toString value)

        Nothing -> text ""



stringifyValue: Model -> String
stringifyValue model =
    Dao.stringifyMaybeValue model.value


leftAlign = style [("text-align", "left")]
rightAlign = style [("text-align", "right")]

alignment: Field -> Attribute msg
alignment field =
    case field.dataType of
        "Bool" -> leftAlign
        "String" -> leftAlign
        "F32" -> rightAlign
        "F64" -> rightAlign
        "I32" -> rightAlign
        "I64" -> rightAlign
        "Date" -> rightAlign
        "DateTime" -> rightAlign
        "Uuid" -> leftAlign
        _ -> leftAlign
 



-- determine if the field has been touched and modified
isModified: Model -> Bool
isModified model =
    model.value /= model.orig_value

-- determine if the field instantiated via new record
isNew: Model -> Bool
isNew model =
    case model.orig_value of
        Just value ->
            False
        Nothing ->
            True


getValue: Field -> Dao -> Maybe Value
getValue field dao =
    Dict.get field.column dao


    

significantModels: List Model -> List Model
significantModels fieldModels =
    List.filter (\f -> f.field.isSignificant ) fieldModels 
    
significantFields: List Field -> List Field
significantFields fields =
    List.filter (\f -> f.isSignificant ) fields

mostSignificantModel: List Model -> Maybe Model
mostSignificantModel fieldModels =
    let significants = significantModels fieldModels
        sorted = List.sortWith (
                    \a b -> case a.field.significancePriority of
                            Just a ->
                                case b.field.significancePriority of
                                    Just b -> compare a b
                                    Nothing -> EQ
                            Nothing -> EQ

                     ) significants
    in List.head sorted


mostSignificantField: List Field -> Maybe Field
mostSignificantField fields =
    let significants = significantFields fields
        sorted = List.sortWith (
                    \a b -> case a.significancePriority of
                            Just a ->
                                case b.significancePriority of
                                    Just b -> compare a b
                                    Nothing -> EQ
                            Nothing -> EQ

                     ) significants
    in List.head sorted
