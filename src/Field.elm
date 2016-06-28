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
import Presentation exposing 
    (Presentation (Table, Form, Grid)
    ,Mode (Edit,Read)
    ,Density(Compact, Medium, Expanded))

import Dao exposing 
    (Dao
    ,Value(Bool,I8,I16,I32,I64,U8,U16,U32,U64,F32,F64,String,Date,DateTime,Uuid)
    )

import Utils

type alias Model = 
    { field: Field
    , value: Maybe Value
    , mode: Mode
    , presentation: Presentation
    , focused: Bool
    , density: Density
    , lookupTabs: List LookupTab
    , lookupData: List LookupData
    }

create field =
    { field = field
    , value = Nothing
    , mode = Read
    , presentation = Table
    , focused = False
    , density = Expanded
    , lookupTabs = []
    , lookupData = []
    }




type alias LookupTab =
    { table: String
    , fields: List Field
    }

newLookupTab table fields =
    { table = table
    , fields = fields
    }

type alias LookupData =
    { table: String
    , daoList: List Dao
    }


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
    | SetValue Value
    | LookupTabsReceived (List LookupTab)
    | LookupDataReceived (List LookupData)
    | ListScrolled Decode.Value 

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

update: Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        ChangeValue v ->
        ({model | value = Just (String v) }, Cmd.none)
        ChangeValueBool b ->
        ({model | value = Just (Bool b)}, Cmd.none)
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
            ({model | value = Just value}, Cmd.none)

        LookupTabsReceived lookupTabList ->
            ({model | lookupTabs = lookupTabList}
            , Cmd.none
            )

        LookupDataReceived lookupDataList ->
            ({model | lookupData = lookupDataList}
            , Cmd.none
            )

        ListScrolled target ->
            ( model, Cmd.none)



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

    case model.field.reference of
        "Table" -> 
            lookupView model
        _ ->
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
    case model.field.reference of
        "Table" -> lookupView model
        _ -> fieldReadNoLookup model

fieldReadNoLookup: Model -> Html Msg 
fieldReadNoLookup model =
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

                _  ->
                    text (toString value)

        Nothing -> text ""



stringifyValue: Model -> String
stringifyValue model =
    Dao.stringifyMaybeValue model.value

fieldReadList: Model -> Html Msg
fieldReadList model = 
    case model.value of
        Just (String s) ->
            text (" "++s)

        Just (Bool b) ->
            case b of
                True -> text " true"
                False -> text " false"
        Just (I32 v) ->
            text (" "++(toString v))
        Just (I64 v) ->
            text (" "++(toString v))
        Just (F64 v) ->
            text (" "++(toString v))

        Just (Date d) ->
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
 

lookupView: Model -> Html Msg
lookupView model =
    let table = model.field.referenceValue
    in
    case table of
        Just table ->
            let daoList = tableLookupData model.lookupData table
                fieldList = tableLookupTabFields model.lookupTabs table
            in
            case model.mode of
                Edit ->
                    div [] [createCompactListField fieldList daoList model
                           ]
                Read ->
                    div [] [createSelectedLookupValue fieldList daoList model
                           ]
        Nothing ->
            div [] [text "no matching table"]



getKeyField: List Field -> Maybe Field
getKeyField fieldList =
    List.filter (
        \f -> f.isKeyfield
    ) fieldList
    |> List.head

onSelectionChange msg =
    Decode.map msg targetValue
        |> on "change"


createCompactListField: List Field -> List Dao -> Model ->Html Msg
createCompactListField fieldList daoList model =
    let fields = case mostSignificantField fieldList of
            Just field ->
                [field]
            Nothing -> 
                allNonAuxilliaryNonKeyFields fieldList

        keyField = getKeyField fieldList
        rows  = 
            List.map(
                \ dao ->
                    createListboxRow fields keyField dao model
                ) daoList
        blankOption = option [] []
        width = case model.field.displayLength of
            Just len -> 10 * len
            Nothing -> 200
    in
    select [style [("width", (toString width)++"px")
                  ,("text-overflow","ellipsis")
                  ]
            ,attribute "onscroll" "scrollListener(event)"
            ] (blankOption :: rows)

allNonAuxilliaryNonKeyFields: List Field -> List Field
allNonAuxilliaryNonKeyFields fieldList =
    List.filter (\f -> not f.isAuxilliary && not f.isKeyfield) fieldList

-- in read mode
createSelectedLookupValue: List Field -> List Dao -> Model -> Html Msg
createSelectedLookupValue fieldList daoList model =
    let fields = case mostSignificantField fieldList of
            Just field ->
                [field]
            Nothing -> 
                allNonAuxilliaryNonKeyFields fieldList

        keyField: Maybe Field
        keyField = getKeyField fieldList
        selectedRowView = 
            List.map(
                \ dao ->
                    createSelectedReadRow fields keyField dao model
                ) daoList
    in
    div [] selectedRowView
    

createSelectedReadRow: List Field -> Maybe Field -> Dao -> Model ->Html Msg 
createSelectedReadRow fields keyField dao model =
    let width = case model.field.displayLength of
        Just len -> len * 10
        Nothing -> 200
    in
    div [style [("width", (toString width)++"px")]] <|
    List.map (
        \f ->
            case keyField of
                Just keyField ->
                    let pkValue = getValue keyField dao
                    in
                    if pkValue == model.value then
                        case getValue f dao of
                            Just sigValue ->
                                text (Dao.stringValue sigValue ++ " ")
                            Nothing -> text "" 
                    else
                        text ""
                Nothing ->
                    Debug.crash "no keyfield"

        ) fields
        

createListboxRow: List Field -> Maybe Field -> Dao -> Model ->Html Msg 
createListboxRow fields keyField dao model =
    let attributes = 
        case keyField of 
            Just keyField ->
                let pkValue = getValue keyField dao 
                in
                [value (Dao.stringifyMaybeValue pkValue)
                ,selected (model.value == pkValue)
                ,style [("width","300px")
                       ,("text-overflow", "ellipsis")
                       ]
                ]

            Nothing -> []

        rowView = 
            List.map (
                \f ->
                    case getValue f dao of
                        Just sigValue ->
                            text (Dao.stringValue sigValue ++ " ")
                        Nothing -> text "" 

                ) fields
        
    in
    option attributes rowView

getValue: Field -> Dao -> Maybe Value
getValue field dao =
    Dict.get field.column dao


tableLookupData: List LookupData -> String -> List Dao 
tableLookupData lookupDataList table =
    let lookupData = 
        List.filter (
            \l -> 
                l.table == table
        ) lookupDataList
        |> List.head
    in
    case lookupData of
        Just lookupData ->
            lookupData.daoList
        Nothing -> []
    
tableLookupTabFields: List LookupTab -> String -> List Field 
tableLookupTabFields lookupTabList table =
    let lookupTab= 
        List.filter (
            \l -> 
                l.table == table
        ) lookupTabList
        |> List.head
    in
    case lookupTab of
        Just lookupTab ->
            lookupTab.fields
        Nothing -> []
    

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
