module Dao exposing (..)

import Dict
import Json.Decode as Decode exposing (Decoder)
import Json.Decode as Decode exposing ((:=)) 
import Json.Decode.Extra as Extra exposing ((|:))


type alias TableDao =
    { table: String
    , daoList: List DaoState
    , page: Maybe Int
    , pageSize: Maybe Int
    , total: Maybe Int
    }

tableDaoDecoder =
    Decode.object5 TableDao
        ("table" := Decode.string)
        ("dao_list" := Decode.list daoStateDecoder)
        (Decode.maybe ("page" := Decode.int))
        (Decode.maybe ("page_size" := Decode.int))
        (Decode.maybe ("total" := Decode.int))

type alias DaoState =
    { dao: Dao
    , focused: Bool
    }

type alias Uuid = String

type alias DaoInsert = 
    { record_id: Uuid
    , dao: Dao
    }

type alias DaoUpdate =
    { original: Dao
    , updated: Dao
    }

type alias ChangeSet = 
    { table: String
    , inserted: List DaoInsert
    , deleted: List Dao
    , updated: List DaoUpdate
    }

daoStateDecoder =
    Decode.object2 DaoState
        ("dao" := daoDecoder)
        ("focused" := Decode.bool)

type alias Dao = Dict.Dict String Value

daoDecoder: Decoder Dao
daoDecoder =
    Decode.dict valueDecoder

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
    | F32 Float
    | F64 Float
    | String String
    | Date String
    | DateTime String
    | Uuid String

valueDecoder: Decode.Decoder Value
valueDecoder = 
    ("variant" := Decode.string) `Decode.andThen` valueVariant

valueVariant: String -> Decode.Decoder Value
valueVariant tag =
    case tag of 
        "Bool" ->
            Decode.map Bool
                (("fields" := Decode.list Decode.bool)
                    `Decode.andThen` firstValue False)
        "I8" ->
            Decode.map I8 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "I16" ->
            Decode.map I16 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "I32" ->
            Decode.map I32 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "I64" ->
            Decode.map I64 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "U8" ->
            Decode.map U8 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "U16" ->
            Decode.map U16 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "U32" ->
            Decode.map U32 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "U64" ->
            Decode.map U64 
                (("fields" := Decode.list Decode.int)
                    `Decode.andThen` firstValue 0)
        "F32" ->
            Decode.map F32 
                (("fields" := Decode.list Decode.float)
                    `Decode.andThen` firstValue 0)
        "F64" ->
            Decode.map F64 
                (("fields" := Decode.list Decode.float)
                    `Decode.andThen` firstValue 0)
        "String" ->
            Decode.map String 
                (("fields" := Decode.list Decode.string)
                    `Decode.andThen` firstValue "")
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


stringValue: Value -> String
stringValue value =
    case value of
        Bool b -> toString b
        I8 v -> toString v
        I16 v -> toString v
        I32 v -> toString v
        I64 v -> toString v
        U8 v -> toString v
        U16 v -> toString v
        U32 v -> toString v
        U64 v -> toString v
        F32 v -> toString v
        F64 v -> toString v
        String s -> s
        Date d -> d
        DateTime d -> d
        Uuid v -> v 

 
stringifyMaybeValue: Maybe Value -> String
stringifyMaybeValue value =
    case value of
        Just v -> stringValue v
        Nothing -> ""












