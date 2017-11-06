'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

  log = log || function () {};

  function storageGetItem(key) {
    log('storageGetItem', key);
    var response = getLocalStorageItem(key);

    log('storageGetItemResponse', key, response);
    ports.storageGetItemResponse.send([key, response]);
  }

  function storageGetItems(keys) {
    log('storageGetItems', keys);

    var kv = [];
    for (i = 0; i < keys.length; ++i) {
      var response = getLocalStorageItem(keys[i]);
      if (response != null) {
        kv.push([keys[i], value]);
      }
    }
    log('storageGetItemsResponse', kv);
    ports.storageGetItemsResponse.send(kv);
  }

  function storageSetItem(_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    log('storageSetItem', key, value);
    setLocalStorageItem(key, value);

    log('storageSetItemResponse');
    ports.storageSetItemResponse.send(null);
  }

  function storageSetItems(kv) {
    log('storageSetItem', kv);
    for (i = 0; i < kv.length; ++i) {
      var kvItem = kv[i];
      setLocalStorageItem(kvItem[0], kvItem[1]);
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
  function storagePushToSet(_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    log('storagePushToSet', key, value);

    var item = getLocalStorageItem(key);
    var list = Array.isArray(item) ? item : [];

    if (list.indexOf(value) === -1) {
      list.push(value);
    }

    setLocalStorageItem(key, list);

    log('storagePushToSetResponse');
    ports.storagePushToSetResponse.send(null);
  }

  function storageRemoveFromSet(_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];

    log('storageRemoveFromSet', key, value);

    var list = getLocalStorageItem(key);

    if (!Array.isArray(list)) {
      log('storageRemoveFromSet [aborting; not a list]', key, value, list);
      return;
    }

    // Filter based on JSON strings in to ensure equality-by-value instead of equality-by-reference
    var jsonValue = JSON.stringify(value);
    var updatedSet = list.filter(function (item) {
      return jsonValue !== JSON.stringify(item);
    });

    setLocalStorageItem(key, updatedSet);

    log('storageRemoveFromSetResponse');
    ports.storageRemoveFromSetResponse.send(null);
  }

  function storageEnumKeys() {
    log('storageEnumKeys');
    var response = enumerateLocalStorageKeys();

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
    return JSON.parse(window.localStorage.getItem(key));
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
  window.localStorage.setItem(key, JSON.stringify(value));
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
  return keys;
}