module Window exposing (..)

import Tab


type alias Model =
    { name: String
    , main_tab: Tab.Model
    , ext_tabs: List Tab.Model
    , has_many_tab: List Tab.Model
    , presentation: Field.Presentation
    , mode: Field.Mode
    }

type Msg
    = ChangeMode Field.Mode
    | ChangePresentation Field.Presentation
    | TabChangeMode String Tab.Msg
    
