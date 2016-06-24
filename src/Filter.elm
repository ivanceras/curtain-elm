module Filter exposing (..)

{-| Filter module for each field shown above the tables

-}



type alias Model =
    { field: Field
    , filterValue: FilterValue
    }


type alias FilterValue = String
