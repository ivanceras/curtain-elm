module Dao exposing (..)

import Dict
import Json.Decode as Decode exposing (Decoder, (:=))
import Json.Encode as Encode
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
    { recordId: Uuid
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
    , deleteReferring: Bool -- whether or not delete referring records too
    }

type alias UpdateResponse =
    { inserted: List Dao
    , deletedCount: Int
    , updated: List Dao
    , totalRecords: Int -- total records on table
    }

changeSetEncoder: ChangeSet -> Encode.Value
changeSetEncoder changeset =
   Encode.object
       [("table", Encode.string changeset.table)
       ,("deleted", daoListEncoder changeset.deleted)
       ,("inserted",  listEncoder daoInsertEncoder changeset.inserted)
       ,("updated", listEncoder daoUpdateEncoder changeset.updated)
       ,("delete_referring", Encode.bool changeset.deleteReferring)
       ]

changeSetListEncoder: List ChangeSet -> Encode.Value
changeSetListEncoder changelist =
    List.map(
        \c ->
         changeSetEncoder c
    ) changelist
        |> Encode.list


deletedChangeSet: String -> List Dao -> Bool -> List ChangeSet
deletedChangeSet table daoList force =
    [{table = table
    , inserted = []
    , deleted = daoList
    , updated = []
    , deleteReferring = force
    }]

forSaveChangeset: String -> List DaoUpdate -> List DaoInsert -> List ChangeSet
forSaveChangeset table daoUpdateList daoInsertList =
    [{table = table
    , inserted = daoInsertList
    , deleted = []
    , updated = daoUpdateList
    , deleteReferring = False
    }]
    

daoInsertEncoder daoInsert =
    Encode.object
        [("dao", daoEncoder daoInsert.dao)
        ,("record_id", Encode.string daoInsert.recordId)
        ]
daoUpdateEncoder daoUpdate =
    Encode.object
        [("original", daoEncoder daoUpdate.original)
        ,("updated", daoEncoder daoUpdate.updated)
        ]

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

encodeValue: Value -> Encode.Value
encodeValue value =
    case value of
        Bool v ->
            Encode.object
                [("variant", Encode.string "Bool")
                ,("fields", Encode.list [Encode.bool v])
                ]
        I8 v ->
            Encode.object
                [("variant", Encode.string "I8")
                ,("fields", Encode.list [Encode.int v])
                ]
        I16 v ->
            Encode.object
                [("variant", Encode.string "I16")
                ,("fields", Encode.list [Encode.int v])
                ]
        I32 v ->
            Encode.object
                [("variant", Encode.string "I32")
                ,("fields", Encode.list [Encode.int v])
                ]
        I64 v ->
            Encode.object
                [("variant", Encode.string "I64")
                ,("fields", Encode.list [Encode.int v])
                ]
        U8 v ->
            Encode.object
                [("variant", Encode.string "U8")
                ,("fields", Encode.list [Encode.int v])
                ]
        U16 v ->
            Encode.object
                [("variant", Encode.string "U16")
                ,("fields", Encode.list [Encode.int v])
                ]
        U32 v ->
            Encode.object
                [("variant", Encode.string "U32")
                ,("fields", Encode.list [Encode.int v])
                ]
        U64 v ->
            Encode.object
                [("variant", Encode.string "U64")
                ,("fields", Encode.list [Encode.int v])
                ]
        F32 v ->
            Encode.object
                [("variant", Encode.string "F32")
                ,("fields", Encode.list [Encode.float v])
                ]
        F64 v ->
            Encode.object
                [("variant", Encode.string "F64")
                ,("fields", Encode.list [Encode.float v])
                ]
        String v ->
            Encode.object
                [("variant", Encode.string "String")
                ,("fields", Encode.list [Encode.string v])
                ]
        Date v ->
            Encode.object
                [("variant", Encode.string "Date")
                ,("fields", Encode.list [Encode.string v])
                ]
        DateTime v ->
            Encode.object
                [("variant", Encode.string "DateTime")
                ,("fields", Encode.list [Encode.string v])
                ]
        Uuid v ->
            Encode.object
                [("variant", Encode.string "Uuid")
                ,("fields", Encode.list [Encode.string v])
                ]


daoEncoder: Dao -> Encode.Value
daoEncoder dao =
    Dict.toList dao
        |> List.map
            (\(k, v) ->
                (k, encodeValue v)
            )
        |> Encode.object

daoListEncoder: List Dao -> Encode.Value
daoListEncoder daoList =
    listEncoder daoEncoder daoList

daoInsertListEncoder: List DaoInsert -> Encode.Value
daoInsertListEncoder daoInsertList =
    listEncoder daoInsertEncoder daoInsertList

daoUpdateListEncoder: List DaoUpdate -> Encode.Value
daoUpdateListEncoder daoUpdateList =
    listEncoder daoUpdateEncoder daoUpdateList

listEncoder: ( a -> Encode.Value ) -> List a  -> Encode.Value
listEncoder encoder payload =
    List.map (
        \p ->
            encoder p
    ) payload
        |> Encode.list

valueDecoder: Decoder Value
valueDecoder = 
    ("variant" := Decode.string) `Decode.andThen` valueVariant

valueVariant: String -> Decoder Value
valueVariant variant =
    case variant of 
        "Bool" ->
            Decode.map Bool
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.bool)
        "I8" ->
            Decode.map I8 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "I16" ->
            Decode.map I16 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "I32" ->
            Decode.map I32 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "I64" ->
            Decode.map I64 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "U8" ->
            Decode.map U8 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "U16" ->
            Decode.map U16 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "U32" ->
            Decode.map U32 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "U64" ->
            Decode.map U64 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.int)
        "F32" ->
            Decode.map F32 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.float)
        "F64" ->
            Decode.map F64 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.float)
        "String" ->
            Decode.map String 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.string)
        "Date" ->
            Decode.map Date 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.string)
        "DateTime" ->
            Decode.map DateTime 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.string)

        "Uuid" ->
            Decode.map Uuid 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.string)

        _ ->
            Decode.map String 
                ("fields" := Decode.tuple1 ( \a -> a ) Decode.string)


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












