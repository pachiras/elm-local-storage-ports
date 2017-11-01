# Full API Reference

## Commands

### `storageGetItem`

> Retrieve an item from LocalStorage.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    GetCart ->
      (model, LocalStorage.storageGetItem "cart") -- "cart" is the key in local storage
```

Note that you'll have to use the `storageGetItemResponse` Subscription in order to receive the response.

---

### `storageSetItem`

> Set an item from LocalStorage.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage
import Json.Encode as JE


type Msg
  = CacheUserId String


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    CacheUserId userId ->
      ( model
      , LocalStorage.storageSetItem ("userId", JE.string userId)
      )
```

---

### `storageRemoveItem`

> Remove an item from LocalStorage.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = LogOut


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    LogOut ->
      ( model
      , LocalStorage.storageRemoveItem "userId"
      )
```

---

### `storageClear`

> Clear all items in LocalStorage.

Note that `()` (i.e. "unit", or an empty tuple) must be passed to this port, since all ports must receive some data.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = EraseLocalData


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    EraseLocalData ->
      ( model
      , LocalStorage.storageClear ()
      )
```

---

### `storagePushToSet`

> Push a value into a "set" in LocalStorage.

A "set" is analogous to a `Set` in Elm. (It's essentially a List with no duplicate values.)

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage
import Json.Encode as JE


type Msg
  = ViewedItem String


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    ViewedItem itemId ->
      ( model
      , LocalStorage.storagePushToSet ("viewedItems", JE.string itemId)
      )
```

Sets are stored as JSON arrays in LocalStorage, so they can be retrieved as Lists using `storageGetItem`. If an item is pushed to a LocalStorage key that does *not* contain a JSON array, that key will be overwritten with a new array/set.

---

### `storageRemoveFromSet`

> Remove a value from a "set" in LocalStorage.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage
import Json.Encode as JE


type Msg
  = UnFavoriteItem String


update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    UnFavoriteItem itemId ->
      ( model
      , LocalStorage.storageRemoveFromSet ("favoritedItems", JE.string itemId)
      )
```

### `storageEnumKeys`

> Enumerates Keys in LocalStorage.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage

type Msg
  = ReloadItem

update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    ReloadItem ->
        ( model, LocalStorage.storageEnumKeys () )
```

## Subscriptions

### `storageGetItemResponse`

> This subscription must be in place in order to receive anything when the `storageGetItem` Cmd is dispatched.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = ReceiveStorageGetItem (LocalStorage.Key, LocalStorage.Value)

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageGetItemResponse ReceiveStorageGetItem
```

### `storageSetItemResponse`

> This subscription will be in place in order to receive when the `storageSetItem` Cmd is finished.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage

type Msg
  = ReceiveStorageSetItem

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageSetItemResponse ReceiveStorageSetItem
```

### `storageRemoveItemResponse`

> This subscription will be in place in order to receive when the `storageRemoveItem` Cmd is finished.


**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = ReceiveStorageRemoveItem

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageRemoveItemResponse ReceiveStorageRemoveItem

```

### `storageClearResponse`

> This subscription will be in place in order to receive when the `storageClear` Cmd is finished.


**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = ReceiveStorageClear

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageClearResponse ReceiveStorageClear
```

### `storagePushToSetResponse`

> This subscription will be in place in order to receive when the `storagePushToSet` Cmd is finished.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = ReceiveStoragePushToSet

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storagePushToSetResponse ReceiveStoragePushToSet
```

### `storageRemoveFromSetResponse`

> This subscription will be in place in order to receive when the `storageRemoveFromSet` Cmd is finished.


**Usage:**

```elm
import Ports.LocalStorage as LocalStorage

type Msg
  = ReceiveStorageRemoveFromSet

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageRemoveFromSetResponse ReceiveStorageRemoveFromSet
```

### `storageEnumKeys`

> This subscription must be in place in order to receive anything when the `storageEnumKeys` Cmd is dispatched.

**Usage:**

```elm
import Ports.LocalStorage as LocalStorage


type Msg
  = ReceiveStorageEnumKeys (List Key)

subscriptions : Model -> Sub Msg
subscriptions model =
  LocalStorage.storageEnumKeysResponse ReceiveStorageEnumKeys

update : Msg -> Model -> (Cmd Msg)
update msg model =
  case msg of
    ReceiveStorageEnumKeys keys ->
      ( { model | keys = keys }
      , updateMyList keys
      )
```
