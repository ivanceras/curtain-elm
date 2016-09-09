module Mode exposing (..)

{-| Types which describes how the UI is presented into view
 This includes, presentation in Table, Form and Grid view
 Mode is also part of this module such as Edit, Read
 Density of how records displayed as well
-}

type Mode = Edit | Read 



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
