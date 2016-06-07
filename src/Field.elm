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

type alias Model = 
    { field: Field
    , value: Value
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
    , density: Density
    }

create field =
    { field = field
    , value = default_value
    , mode = Read
    , presentation = Table
    , focused = False
    , density = Expanded
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
    , complete_name: String
    , is_keyfield: Bool
    , data_type: String
    , reference: String
    , reference_value: Maybe String
    , description: Maybe String
    , info: Maybe String
    , is_significant: Bool
    , significance_priority: Maybe Int
    , include_in_search: Bool
    , is_mandatory: Bool
    , seq_no: Int
    , is_same_line: Bool
    , is_displayed: Bool
    , is_readonly: Bool
    , is_autocomplete: Bool
    , display_logic: Maybe String
    , display_length: Maybe Int
    , display_value: Maybe String
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

default_value = String "" 

type Msg
    = ChangeValue String
    | ChangeValueBool Bool
    | ChangeMode Mode 
    | ChangePresentation Presentation
    | ChangeDensity Density
    | SetValue Value




value_decoder: Decode.Decoder Value
value_decoder = 
    ("variant" := Decode.string) `Decode.andThen` value_variant

value_variant: String -> Decode.Decoder Value
value_variant tag =
    case tag of 
        "String" ->
            Decode.map String 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` first_value "")
        "Bool" ->
            Decode.map Bool
                (("fields" := Decode.list Decode.bool)
                    `Decode.andThen` first_value False)
        "F64" ->
            Decode.map F64 
                (("fields" := Decode.list Decode.float)
                    `Decode.andThen` first_value 0)
        "I32" ->
            Decode.map I32 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` first_value 0)
        "Date" ->
            Decode.map Date 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` first_value "")
        "DateTime" ->
            Decode.map DateTime 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` first_value "")
        _ ->
            Decode.map String 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` first_value "")

first_value: a -> List a -> Decode.Decoder a
first_value default args =
    Decode.succeed (Maybe.withDefault default (List.head args))



field_decoder: Decode.Decoder Field
field_decoder = 
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
     let label_style = style [ ("width", "200px") 
                             , ("text-align", "left")
                             , ("padding-top", "5px")
                             , ("display", "block")
                             , ("margin-bottom", "0px")
                             , ("font-weight", "bold")
                             ]
         edit_field = field_entry model
         label_check = if is_mandatory_ok model then
                style []
             else
                style [("color", "red")]
         container_style = if is_mandatory_ok model then
                style []
             else
                style [("border", "1px solid red")]

         label_html = label [label_check, label_style] [text (model.field.name)]

     in
     case model.mode of
        Edit ->
            case model.presentation of
                Form ->
                    let container_style = style [("width","350px"),("padding", "2px")]
                    in
                    case model.field.data_type of
                        "Bool" -> -- checkbox before label
                            let label_bool = label [style [("margin-left","10px"),("margin-bottom", "0px"),("font-weight","bold")]] [text (model.field.name)]
                            in
                            div [container_style]
                                [div [style [("margin-top", "2em")]]
                                    [edit_field
                                    ,label_bool
                                    ]
                                ]

                        _ ->
                            div [container_style]
                                [label_html
                                ,edit_field
                                ]

                Table ->
                    td [] [edit_field]

                Grid ->
                    edit_field
                List -> 
                    field_read_list model
        Read ->
            case model.presentation of
                Form ->
                    div []
                        [label [label_check, label_style] [text (model.field.name ++ ":")]
                        ,(field_read model)
                        ]
                Table ->
                    td [container_style]
                       [(field_read model)
                       ]
                Grid ->
                    case model.density of
                        Compact -> -- the most significant field without bold
                            if model.field.is_significant then
                                div [] 
                                    [(field_read model)
                                    ]
                            else
                                div[] []
                        Medium -> --only significant fields
                            if model.field.is_significant then
                                let text_style = style [("font-weight", "bold")]
                                in
                                div [ text_style] 
                                    [(field_read model)
                                    ]
                            else
                                div[] []

                        Expanded -> --all fields are displayed
                            let text_style = if model.field.is_significant then
                                    style [("font-weight", "bold")]
                                else
                                    style []
                            in
                            div [ text_style] 
                                [(field_read model)
                                ]
                List ->
                        field_read_list model

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


is_empty_value: Value -> Bool
is_empty_value value =
    case value of
        String v ->
            String.isEmpty v
        Bool b ->
            False
        _ ->
            False 

is_mandatory_ok model =
     if is_empty_value model.value && model.field.is_mandatory then
        False
     else
        True

field_entry: Model -> Html Msg
field_entry model =
    let focused_field = case model.focused of
            True -> class "focused_field"
            False -> class ""
        
        field_check = if is_mandatory_ok model then
            style []
        else
            style [("border", "1px solid red")]
        text_width = style [("width", "300px")]
    in
    case model.value of
        String s ->
            input [ type' "text"
                  , field_check
                  , text_width
                  , focused_field
                  , value s
                  , onInput ChangeValue
                  ] []
        Bool b -> 
            input [ type' "checkbox"
                  , field_check
                  , checked b
                  , onCheck ChangeValueBool] []
        I64 v -> 
            input [ type' "number"
                  , field_check
                  , text_width
                  , value (toString v)
                  ] []
        F64 v -> 
            input [ type' "number"
                  , field_check
                  , text_width
                  , value (toString v)
                  ] []

        Date d -> 
            input [ type' "date"
                  , value d
                  , text_width
                  , onInput ChangeValue] []

        DateTime d -> 
            input [ type' "datetime-local"
                  , value d
                  , text_width
                  , onInput ChangeValue] []
        _ ->
            input [ type' "text"
                  , text_width
                  , value (toString model.value)
                  ] []
            

field_read: Model -> Html Msg 
field_read model =
    case model.value of
        String s -> 
            text s
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
            text d

        _  ->
            text (toString value)
            

field_read_list: Model -> Html Msg
field_read_list model = 
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
