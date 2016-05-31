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
import SampleData

type alias Model = 
    { field: Field
    , value: Value
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
    , density: Density
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
    | String String
    | Date Date.Date


type Msg
    = ChangeValue String
    | ChangeValueBool Bool
    | ChangeMode Mode 
    | ChangePresentation Presentation
    | ChangeDensity Density


bday_field = 
    { name = "Birthday"
    , column = "birthday"
    , complete_name = "person.birthday"
    , is_keyfield = False
    , data_type = "Timestamp with time zone"
    , reference = "Date"
    , reference_value = Nothing
    , description = Nothing
    , info = Nothing
    , is_significant = False
    , significance_priority = Nothing
    , include_in_search = False
    , is_mandatory = False
    , seq_no = 0
    , is_same_line = False
    , is_displayed = True
    , is_readonly = False
    , is_autocomplete = False
    , display_logic = Nothing
    , display_length = Just 1
    , display_value = Nothing
    }

name_field1 = 
    { name = "Err_Name"
    , column= "name"
    , complete_name = "person.name"
    , is_keyfield = False
    , data_type = "character varying"
    , reference = "String"
    , reference_value = Nothing
    , description = Nothing
    , info = Nothing
    , is_significant = True
    , significance_priority = Just 10
    , include_in_search = False
    , is_mandatory = True 
    , seq_no = 0
    , is_same_line = False
    , is_displayed = True
    , is_readonly = False
    , is_autocomplete = False
    , display_logic = Nothing
    , display_length = Just 20
    , display_value = Nothing
     }

name_field_result = 
    let _ = Debug.log "json:" SampleData.name_json_field
    in
    Decode.decodeString field_decoder SampleData.name_json_field
name_field = case name_field_result of
    Ok name_field -> name_field
    Err e -> let _ =Debug.log "Error" e
                in name_field1


active_field = 
    {name = "Active"
     ,column = "active"
     ,complete_name = "person.active"
     ,is_keyfield = False
     ,data_type = "boolean"
     ,reference = "Bool"
     ,reference_value = Nothing
     ,description = Nothing
     ,info = Nothing
     ,is_significant = True
     ,significance_priority = Just 20
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

birthday =
    {field = bday_field
    , value = String "2016-05-01"
    , mode = Read 
    , presentation = Form
    , focused = False
    , density = Medium 
    }

name =
    {field = name_field 
    , value = String "Jon Snow"
    , mode = Read 
    , presentation = Form 
    , focused = False
    , density = Medium
    }

    
active =
    {field = active_field
    , value = Result.withDefault (Bool False) (Decode.decodeString value_decoder SampleData.json_active)
    , mode = Read 
    , presentation = Form 
    , focused = False
    , density = Medium
    }




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
        _ ->
            Decode.map String 
                ("fields" := Decode.string)

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
                             , ("text-align", "right")
                             , ("padding", "5px")
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

     in
     case model.mode of
        Edit ->
            case model.presentation of
                Form ->
                    div []
                        [label [label_check, label_style] [text (model.field.name ++ ": ")]
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
                    div [onClick (ChangeMode Edit)]
                        [label [label_check, label_style] [text (model.field.name ++ ":")]
                        ,(field_read model)
                        ]
                Table ->
                    td [container_style 
                       , onClick (ChangeMode Edit)]
                       [(field_read model)
                       ]
                Grid ->
                    case model.density of
                        Compact -> -- the most significant field without bold
                            if model.field.is_significant then
                                div [onClick (ChangeMode Edit)] 
                                    [(field_read model)
                                    ]
                            else
                                div[] []
                        Medium -> --only significant fields
                            if model.field.is_significant then
                                let text_style = style [("font-weight", "bold")]
                                in
                                div [ text_style
                                    , onClick (ChangeMode Edit)] 
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
                            div [ text_style
                                , onClick (ChangeMode Edit)] 
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
    in
    case model.value of
        String s ->
            input [ type' "text"
                  , field_check
                  , focused_field
                  , value s
                  , onInput ChangeValue
                  , placeholder model.field.name] []
        Bool b -> 
            input [ type' "checkbox"
                  , field_check
                  , checked b
                  , onCheck ChangeValueBool] []
        Date d -> 
            input [ type' "text"
                  , value (toString d)
                  , onInput ChangeValue] []


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
        Date d ->
            text (toString d)
            

field_read_list: Model -> Html Msg
field_read_list model = 
    case model.value of
        String s ->
            text (" "++s)

        Bool b ->
            case b of
                True -> text " true"
                False -> text " false"
        Date d ->
            text (" "++(toString d))
