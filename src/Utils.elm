module Utils exposing (..)

import ISO8601
import Date.Format
import Date
import Task
import Task.Extra
import String

{-| Utility functions used in most parts of the code

-}

px: number -> String
px number =
    (toString number) ++ "px"

simpleDate: String -> String
simpleDate str =
    if not (String.isEmpty str) then
        let time = ISO8601.fromString str 
                    |> Result.withDefault (ISO8601.fromTime 0)
                    |> ISO8601.toTime
            date = Date.fromTime (toFloat time)
            iso = Date.Format.formatISO8601 date
            simple = Date.Format.format "%Y-%m-%d %H:%M" date
        in
        simple
    else
        ""


toList: Maybe a -> List a
toList arg =
    case arg of
        Just a -> [a]
        Nothing -> []

msgToCmd msg =
    --Task.perform (always msg) (always msg) (Task.succeed msg)
    Task.Extra.performFailproof identity (Task.succeed msg)


fstNoneEmpty: List (Maybe a) -> Maybe a
fstNoneEmpty outmsgs =
    let ne = 
        List.filter (\o -> o /= Nothing) outmsgs
          |> List.head
    in
        case ne of
            Nothing -> Nothing
            Just outmsg -> outmsg
 
unwrap: Maybe String -> String
unwrap v =
    case v of
        Nothing -> ""
        Just v -> v

