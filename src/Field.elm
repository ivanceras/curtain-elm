module Field exposing (..)

import Json.Decode as Decode exposing ((:=)) 
import Json.Decode.Extra as Extra exposing ((|:))
import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Date
import Task
import String
import ISO8601
import Date.Format
import Random

type alias Model = 
    { field: Field
    , value: Value
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
    , density: Density
    , lookups: List Lookup
    }

create field =
    { field = field
    , value = defaultValue
    , mode = Read
    , presentation = Table
    , focused = False
    , density = Expanded
    , lookups = []
    }

type alias Lookup =
    { table: String
    , fields: List Field
    }

type Mode = Edit | Read 

{- | Presentation - describes how the data 
    is presented to the client
    Table  - displays in tabular format for large data set 
            but with enough screen space
    Form - displays 1 row of data consuming the work area
           ideal for editing 1 row of record
    Grid - displays the large dataset in a grid like manner
            like icons for apps. This is useful when the screen area is very tight
         - Each record is crumpled into a uniform small box
    List - displays the record in a listbox
         - used when refered by some other fields as a dropdown
-}
type Presentation = Table | Form | Grid | List


{- | Density - a layman's term to describe how compact the data set to be presented
    Compact - for mobile devices, and when displayed as dropdown choices (1-2) fields only are displayed
            - (ie. country list: code, flag image as background)
            - (person list: (first_name + last_name mangled as 1)
    Medium  - for Tablets -  insignificant fields are not displayed
            - (ie. country list: code, name, flag)
            - (person list: (first_name, last_name, photo)
    Expanded - for PC - all fields are displayed

-}
type Density = Compact | Medium | Expanded

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
    , isSameLine: Bool
    , isDisplayed: Bool
    , isReadonly: Bool
    , isAutocomplete: Bool
    , displayLogic: Maybe String
    , displayLength: Maybe Int
    , displayValue: Maybe String
    }
 

type Value
    = Bool Bool
    | I8 Int
    | I16 Int
    | I32 Int
    | I64 Int
    | U8 Int
    | U16 Int
    | U32 Int
    | U64 Int
    | F32 Int
    | F64 Float
    | String String
    | Date String
    | DateTime String

defaultValue = String "" 

type Msg
    = ChangeValue String
    | ChangeValueBool Bool
    | ChangeMode Mode 
    | ChangePresentation Presentation
    | ChangeDensity Density
    | SetValue Value
    | FocusRecord




valueDecoder: Decode.Decoder Value
valueDecoder = 
    ("variant" := Decode.string) `Decode.andThen` valueVariant

valueVariant: String -> Decode.Decoder Value
valueVariant tag =
    case tag of 
        "String" ->
            Decode.map String 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` firstValue "")
        "Bool" ->
            Decode.map Bool
                (("fields" := Decode.list Decode.bool)
                    `Decode.andThen` firstValue False)
        "F64" ->
            Decode.map F64 
                (("fields" := Decode.list Decode.float)
                    `Decode.andThen` firstValue 0)
        "I32" ->
            Decode.map I32 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "Date" ->
            Decode.map Date 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` firstValue "")
        "DateTime" ->
            Decode.map DateTime 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` firstValue "")
        _ ->
            Decode.map String 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` firstValue "")

firstValue: a -> List a -> Decode.Decoder a
firstValue default args =
    Decode.succeed (Maybe.withDefault default (List.head args))



fieldDecoder: Decode.Decoder Field
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
         |: ("is_same_line" := Decode.bool)
         |: ("is_displayed" := Decode.bool)
         |: ("is_readonly" := Decode.bool)
         |: ("is_autocomplete" := Decode.bool)
         |: (Decode.maybe ("display_logic" := Decode.string))
         |: (Decode.maybe ("display_length" := Decode.int))
         |: (Decode.maybe ("default_value" := Decode.string))



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

         labelHtml = label [labelCheck, labelStyle] [text (model.field.name)]

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
                           ,onClick FocusRecord
                           ] [editField]
                    --read table
                    Read ->
                        td [onClick FocusRecord
                           ,(alignment model.field), containerStyle
                           ]
                           [(fieldRead model)
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
                                in
                                div [ textStyle] 
                                    [(fieldRead model)
                                    ]
            List -> 
                -- edit or read  the same
                fieldReadList model

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeValue v ->
        ({model | value = String v }, Cmd.none)
        ChangeValueBool b ->
        ({model | value = Bool b}, Cmd.none)
        ChangeMode mode ->
            case mode of
                Edit ->
                    ({model | mode = mode, focused = True }, Cmd.none)
                Read ->
                    ({model | mode = mode }, Cmd.none)

        ChangePresentation presentation ->
            ({model | presentation = presentation}, Cmd.none )
        ChangeDensity density ->
            ({model | density = density}, Cmd.none)
        SetValue value ->
            ({model | value = value}, Cmd.none)
        FocusRecord ->
            (model, Cmd.none)



isEmptyValue: Value -> Bool
isEmptyValue value =
    case value of
        String v ->
            String.isEmpty v
        Bool b ->
            False
        _ ->
            False 

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
        
        fieldCheck = if isMandatoryOk model then
            style []
        else
            style [("border", "1px solid red")]
        textWidth = 
              style [("width", "300px")
                    ,("border","0")
                    ,("outline", "0")
                    ,("border-bottom", "1px solid #ccc")
                    ,("background-color", "#fff")
                    ]

    in
    case model.value of
        String s ->
            input [ type' "text"
                  , fieldCheck
                  , leftAlign
                  , textWidth
                  , focusedField
                  , value s
                  , onInput ChangeValue
                  ] []
        Bool b -> 
            input [ type' "checkbox"
                  , fieldCheck
                  , leftAlign
                  , checked b
                  , onCheck ChangeValueBool
                  ] []
        I64 v -> 
            input [ type' "number"
                  , fieldCheck
                  , rightAlign
                  , textWidth
                  , value (toString v)
                  ] []
        F64 v -> 
            input [ type' "number"
                  , fieldCheck
                  , rightAlign
                  , textWidth
                  , value (toString v)
                  ] []

        Date d -> 
            input [ type' "date"
                  , value d
                  , textWidth
                  , rightAlign
                  , onInput ChangeValue
                  ] []

        DateTime d -> 
            input [ type' "datetime"
                  , value (simpleDate d)
                  , textWidth
                  , rightAlign
                  , onInput ChangeValue
                  ] []
        _ ->
            input [ type' "text"
                  , textWidth
                  , leftAlign
                  , value (toString model.value)
                  , onClick FocusRecord
                  ] []
            

simpleDate: String -> String
simpleDate str =
    let time = ISO8601.fromString str 
                |> Result.withDefault (ISO8601.fromTime 0)
                |> ISO8601.toTime
        date = Date.fromTime (toFloat time)
        iso = Date.Format.formatISO8601 date
        simple = Date.Format.format "%Y-%m-%d %H:%M" date
    in
    simple

fieldRead: Model -> Html Msg 
fieldRead model =
    case model.value of
        String s -> 
            let fieldStyle = style [("width", "300px"), ("height", "20px")]
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
            text (simpleDate d)

        _  ->
            text (toString value)
            

fieldReadList: Model -> Html Msg
fieldReadList model = 
    case model.value of
        String s ->
            text (" "++s)

        Bool b ->
            case b of
                True -> text " true"
                False -> text " false"
        I32 v ->
            text (" "++(toString v))
        I64 v ->
            text (" "++(toString v))
        F64 v ->
            text (" "++(toString v))

        Date d ->
            text (" "++(toString d))

        _ ->
            text (" "++(toString model.value))


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
        _ -> leftAlign
