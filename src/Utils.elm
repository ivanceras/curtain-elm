module Utils exposing (..)

import ISO8601
import Date.Format
import Date
import Task
import Task.Extra

{-| Utility functions used in most parts of the code

-}

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


toList: Maybe a -> List a
toList arg =
    case arg of
        Just a -> [a]
        Nothing -> []

msgToCmd msg =
    --Task.perform (always msg) (always msg) (Task.succeed msg)
    Task.Extra.performFailproof identity (Task.succeed msg)
