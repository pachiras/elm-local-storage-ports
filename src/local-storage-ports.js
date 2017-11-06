module.exports = {
  register: register,
  samplePortName: 'storageGetItem'
};

/**
 * Subscribe the given Elm app ports to ports from the Elm LocalStorage ports module.
 *
 * @param  {Object}   ports  Ports object from an Elm app
 * @param  {Function} log    Function to log ports for the given Elm app
 */
function register(ports, log) {
  // Mapped to Storage API: https://developer.mozilla.org/en-US/docs/Web/API/Storage
  ports.storageGetItem.subscribe(storageGetItem);
  ports.storageGetItems.subscribe(storageGetItems);
  ports.storageSetItem.subscribe(storageSetItem);
  ports.storageSetItems.subscribe(storageSetItems);
  ports.storageRemoveItem.subscribe(storageRemoveItem);
  ports.storageClear.subscribe(storageClear);

  // Not in Storage API
  ports.storagePushToSet.subscribe(storagePushToSet);
  ports.storageRemoveFromSet.subscribe(storageRemoveFromSet);
  ports.storageEnumKeys.subscribe(storageEnumKeys);

  log = log || function() {};

  function storageGetItem(key) {
    log('storageGetItem', key);
    const response = getLocalStorageItem(key);

    log('storageGetItemResponse', key, response);
    ports.storageGetItemResponse.send([key, response]);
  }

  function storageGetItems(keys) {
    log('storageGetItems', keys);

    var kv = [];
    for (var i=0; i < keys.length; ++i) {
      const response = getLocalStorageItem(keys[i]);
      if (response != null) {
          kv.push([keys[i], value]);
      }
    }
    log('storageGetItemsResponse', kv);
    ports.storageGetItemsResponse.send(kv);
  }

  function storageSetItem([key, value]) {
    log('storageSetItem', key, value);
    setLocalStorageItem(key, value);

    log('storageSetItemResponse');
    ports.storageSetItemResponse.send(null);
  }

  function storageSetItems(kv) {
    log('storageSetItem', kv);
    for (var i=0; i < kv.length; ++i) {
        const kvItem = kv[i];
        setLocalStorageItem(kvItem[0],kvItem[1]);
    }

    log('storageSetItemsResponse');
    ports.storageSetItemsResponse.send(null);
  }

  function storageRemoveItem(key) {
    log('storageRemoveItem', key);
    window.localStorage.removeItem(key);

    log('storageRemoveItemResponse');
    ports.storageRemoveItemResponse.send(null);
  }

  function storageClear() {
    log('storageClear');
    window.localStorage.clear();

    log('storageClearResponse');
    ports.storageClearResponse.send(null);
  }

  // A Set is a list with only unique values. (No duplication.)
  function storagePushToSet([key, value]) {
    log('storagePushToSet', key, value);

    const item = getLocalStorageItem(key);
    const list = Array.isArray(item) ? item : [];

    if (list.indexOf(value) === -1) {
      list.push(value);
    }

    setLocalStorageItem(key, list);

    log('storagePushToSetResponse');
    ports.storagePushToSetResponse.send(null);
  }

  function storageRemoveFromSet([key, value]) {
    log('storageRemoveFromSet', key, value);

    const list = getLocalStorageItem(key);

    if (!Array.isArray(list)) {
      log('storageRemoveFromSet [aborting; not a list]', key, value, list);
      return;
    }

    // Filter based on JSON strings in to ensure equality-by-value instead of equality-by-reference
    const jsonValue = JSON.stringify(value);
    const updatedSet = list.filter(item => jsonValue !== JSON.stringify(item));

    setLocalStorageItem(key, updatedSet);

    log('storageRemoveFromSetResponse');
    ports.storageRemoveFromSetResponse.send(null);
  }

  function storageEnumKeys() {
    log('storageEnumKeys');
    const response = enumerateLocalStorageKeys()

    log('storageEnumKeysResponse', response);
    ports.storageEnumKeysResponse.send(response);

  }
}

/**
 * Get a JSON serialized value from localStorage. (Return the deserialized version.)
 *
 * @param  {String} key Key in localStorage
 * @return {*}      The deserialized value
 */
function getLocalStorageItem(key) {
  try {
    return JSON.parse(
      window.localStorage.getItem(key)
    );
  } catch (e) {
    return null;
  }
}

/**
 * Set a value of any type in localStorage.
 * (Serializes in JSON before storing since Storage objects can only hold strings.)
 *
 * @param {String} key   Key in localStorage
 * @param {*}      value The value to set
 */
function setLocalStorageItem(key, value) {
  window.localStorage.setItem(key,
    JSON.stringify(value)
  );
}

/**
 * Enumerate the keys of localStorage.
 *
 * @return {[*]}    The list of keys in localStorage
 */
function enumerateLocalStorageKeys() {
  var keys = [];
  for (var i = 0; i < window.localStorage.length; ++i) {
      keys.push(window.localStorage.key(i));
  }
  return(keys);
}

