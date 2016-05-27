module Field exposing (..)

import Json.Decode as Decode
import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Date

type alias Model = 
    { field: Field
    , value: Value
    , mode: Mode
    , presentation: Presentation
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
    Compact - for mobile devices
    Medium - for Tablets
    Expanded - for PC

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


birthday mode =
    {field = {name = "birthday"
             ,reference = "Date"
             ,data_type = "Timestamp with time zone"
             }
    , value = String "2016-05-01"
    , mode = mode 
    , presentation = Form
    }

name mode =
    {field = {name = "name"
             ,reference = "String"
             ,data_type = "character varying"
             }
    , value = String "Jon Snow"
    , mode = mode 
    , presentation = Form 
    }

active mode =
    {field = {name = "active"
             ,reference = "Bool"
             ,data_type = "boolean"
             }
    , value = Bool True 
    , mode = mode 
    , presentation = Form 
    }

view : Model -> Html Msg
view model = 
     let label_style = style [ ("width", "200px") 
                             , ("text-align", "right")
                             , ("padding", "5px")
                             ]
         field = field_entry model.value model.field
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
 
update: Msg -> Model -> Model
update msg model =
    case msg of
        ChangeValue v ->
        {model | value = String v }
        ChangeValueBool b ->
        {model | value = Bool b}
        ChangeMode mode ->
        ( {model | mode = mode })
        ChangePresentation presentation ->
        ( {model | presentation = presentation} )




field_entry: Value -> Field -> Html Msg
field_entry v field =
    case v of
        String s ->
            input [type' "text", value s, onInput ChangeValue, placeholder field.name] []
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
            
 
    
