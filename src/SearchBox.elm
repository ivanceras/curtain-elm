module SearchBox exposing (..)

import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html exposing (..)
import Html.App as App
import Utils exposing (px)
import Field
import DatePicker exposing (defaultSettings)
import Dao exposing (
    Value(String, Bool)
    )
import String

type Msg 
    = ChangeValue String
    | ChangeValueBool Bool
    | ToDatePicker DatePicker.Msg
    | Clear

type OutMsg
    = None

type alias Model =
    { field: Field.Field
    , operatorValue: List (Operator, Value)
    , fromDate: DatePicker.DatePicker
    , toDate: Maybe DatePicker.DatePicker
    }
 
searchBoxToQuery: Model -> String
searchBoxToQuery model =
    let conditions =
        List.foldl (
            \(op, value) conditions ->
                let ops =  operatorToQuery op
                    sv = Dao.stringValue value
                in 
                if String.isEmpty sv then
                    conditions
                else
                    let
                        cond = model.field.column ++ "=" ++ ops ++ "." ++ sv
                    in
                    conditions ++ [cond]
            ) 
            [] model.operatorValue
    in String.join "&" conditions

type Operator
    = StartsWith
    | Equal
    | Like
    | GreaterThan
    | GreaterThanEqual
    | LessThan
    | LessThanEqual

operatorToQuery: Operator -> String
operatorToQuery op =
    case op of
        StartsWith -> "st"
        Equal -> "eq"
        Like -> "like"
        GreaterThan -> "gt"
        GreaterThanEqual -> "gte"
        LessThan -> "lt"
        LessThanEqual -> "lte"


create: Field.Field -> Model
create field =
    { field = field
    , operatorValue = []
    , fromDate = DatePicker.init { defaultSettings | placeholder = "from"} 
                    |> fst 
    , toDate = Nothing
    }

update:Msg -> Model -> (Model, List OutMsg) 
update msg model =
    case msg of
        Clear ->
            ({model | operatorValue = []}
            ,[])
        ChangeValue str ->
            ({model | operatorValue = [(StartsWith, String str)]
             },[])
        ChangeValueBool b ->
            ({model | operatorValue = [(Equal, Bool b)]
             },[])
        ToDatePicker datePickerMsg ->
            let
                ( datePicker, datePickerFx, mDate ) =
                    DatePicker.update datePickerMsg model.fromDate
            in
            ({model | fromDate = datePicker
             }, []
            )


view: Model -> Html Msg
view model =
    let field = model.field
        (width, height) =
        Field.computeSizeFromField field Field.Table
        search_width = width - 18
        firstValue = 
            case List.head model.operatorValue of
                Just (op, value) ->
                    value
                Nothing ->
                    String ""
    in
    case field.dataType of
        "Bool" ->
            div []
                [input [type' "checkbox"
                       ,onCheck ChangeValueBool
                       ,checked (case firstValue of
                                    Bool b -> b
                                    _ -> False
                                )
                                 
                       ]
                    []
                ]
        "DateTime" ->
            DatePicker.view model.fromDate
                |> App.map ToDatePicker

        _ ->
            div []
                [input [style [("width", px search_width)
                              ,("border-radius", "6px")
                              ,("border", "1px  solid #ccc")
                              ,("padding-right", "18px")
                              ]
                        ,type' "text"
                        ,name "search"
                        ,value (Dao.stringValue firstValue)
                        ,onInput ChangeValue
                       ] []
                 ,i [class "fa fa-search"
                     ,style [("left", "-15px")
                            ,("position", "relative")
                            ,("color", "#ddd")
                            ]
                     ][]
                ]
