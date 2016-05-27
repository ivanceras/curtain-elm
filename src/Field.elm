port module Field exposing (..)

import Json.Decode as Decode
import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Date
import Task

type alias Model = 
    { field: Field
    , value: Value
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
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
-}
type Presentation = Table | Form | Grid


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
    , reference: String
    , data_type: String
    }
 
type alias FieldVariant =
    { variant: String
    , value: String 
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


bday_field = 
    {name = "birthday"
    ,reference = "Date"
    ,data_type = "Timestamp with time zone"
    }

name_field = 
    {name = "name"
     ,reference = "String"
     ,data_type = "character varying"
     }

active_field = 
    {name = "active"
     ,reference = "Bool"
     ,data_type = "boolean"
     }

birthday =
    {field = bday_field
    , value = String "2016-05-01"
    , mode = Read 
    , presentation = Form
    , focused = False
    }

name =
    {field = name_field 
    , value = String "Jon Snow"
    , mode = Read 
    , presentation = Form 
    , focused = False
    }

    
active =
    {field = active_field
    , value = Bool True 
    , mode = Read 
    , presentation = Form 
    , focused = False
    }

view : Model -> Html Msg
view model = 
     let label_style = style [ ("width", "200px") 
                             , ("text-align", "right")
                             , ("padding", "5px")
                             ]
         field = field_entry model
     in
     case model.mode of
        Edit ->
            case model.presentation of
                Form ->
                    div []
                        [label [label_style] [text (model.field.name ++ ": ")]
                        ,field
                        ]
                Table ->
                    td [] [field
                          ]
                Grid ->
                    field
        Read ->
            case model.presentation of
                Form ->
                    div [onClick (ChangeMode Edit)]
                        [label [label_style] [text (model.field.name ++ ":")]
                        ,(field_read model.value model.field)
                        ]
                Table ->
                    td [onClick (ChangeMode Edit)]
                       [(field_read model.value model.field)
                       ]
                Grid ->
                    div [onClick (ChangeMode Edit)] 
                        [(field_read model.value model.field)
                        ]
 
update: Msg -> Model -> (Model, Cmd msg)
update msg model =
    case msg of
        ChangeValue v ->
        ({model | value = String v }, Cmd.none)
        ChangeValueBool b ->
        ({model | value = Bool b}, Cmd.none)
        ChangeMode mode ->
            case mode of
                Edit ->
                    ({model | mode = mode, focused = True }, focus_field "focusing field")
                Read ->
                    ({model | mode = mode }, Cmd.none)

        ChangePresentation presentation ->
            ({model | presentation = presentation}, Cmd.none )




field_entry: Model -> Html Msg
field_entry model =
    let focused_field = case model.focused of
        True -> class "focused_field"
        False -> class ""
    in
    case model.value of
        String s ->
            input [type' "text", focused_field, value s, onInput ChangeValue, onBlur (ChangeMode Read), placeholder model.field.name] []
        Bool b -> 
            input [type' "checkbox", checked b, onCheck ChangeValueBool] []
        Date d -> 
            input [type' "text", value (toString d), onInput ChangeValue] []


field_read: Value -> Field -> Html Msg 
field_read v field =
    case v of
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
            
port focus_field: String -> Cmd msg 
