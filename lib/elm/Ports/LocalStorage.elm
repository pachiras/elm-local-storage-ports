port module Ports.LocalStorage exposing (..)

import Json.Encode


type alias Key =
    String


type alias Value =
    Json.Encode.Value


{-| Subscriptions (Receive from JS)
-}
port storageGetItemResponse : (( Key, Value ) -> msg) -> Sub msg


port storageGetItemsResponse : (List ( Key, Value ) -> msg) -> Sub msg


port storageSetItemResponse : (() -> msg) -> Sub msg


port storageSetItemsResponse : (() -> msg) -> Sub msg


port storageRemoveItemResponse : (() -> msg) -> Sub msg


port storageClearResponse : (() -> msg) -> Sub msg


port storagePushToSetResponse : (() -> msg) -> Sub msg


port storageRemoveFromSetResponse : (() -> msg) -> Sub msg


port storageEnumKeysResponse : (List Key -> msg) -> Sub msg


{-| Commands (Send to JS)
-}



-- Mapped to Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Storage


port storageGetItem : Key -> Cmd msg


port storageGetItems : List Key -> Cmd msg


port storageSetItem : ( Key, Value ) -> Cmd msg


port storageSetItems : List ( Key, Value ) -> Cmd msg


port storageRemoveItem : Key -> Cmd msg


port storageClear : () -> Cmd msg



-- Not in Storage API


port storagePushToSet : ( Key, Value ) -> Cmd msg


port storageRemoveFromSet : ( Key, Value ) -> Cmd msg


port storageEnumKeys : () -> Cmd msg
