Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var AsyncLocalStorage = function (_Module) {
  babelHelpers.inherits(AsyncLocalStorage, _Module);

  function AsyncLocalStorage(rnctx) {
    babelHelpers.classCallCheck(this, AsyncLocalStorage);

    var _this = babelHelpers.possibleConstructorReturn(this, (AsyncLocalStorage.__proto__ || Object.getPrototypeOf(AsyncLocalStorage)).call(this, 'AsyncLocalStorage'));

    _this._rnctx = rnctx;
    _this._db = null;
    return _this;
  }

  babelHelpers.createClass(AsyncLocalStorage, [{
    key: '_prepareDB',
    value: function _prepareDB() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2._db) {
          return resolve(_this2._db);
        }

        var request = window.indexedDB.open('AsyncStorage', 1);
        request.onerror = function (event) {
          reject({
            message: 'Error opening database'
          });
        };
        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          _this2._db = db;

          db.createObjectStore('pairs', { keyPath: 'key' });
          resolve(db);
        };
        request.onsuccess = function (event) {
          var db = event.target.result;
          _this2._db = db;
          resolve(db);
        };
      });
    }
  }, {
    key: '_getRow',
    value: function _getRow(objectStore, key) {
      return new Promise(function (resolve, reject) {
        var request = objectStore.get(key);
        request.onerror = function (event) {
          reject({
            message: event.target.error.name,
            key: key
          });
        };
        request.onsuccess = function (event) {
          var row = event.target.result;
          if (!row) {
            resolve([key, undefined]);
          } else {
            resolve([row.key, row.value]);
          }
        };
      });
    }
  }, {
    key: '_putRow',
    value: function _putRow(objectStore, row) {
      return new Promise(function (resolve, reject) {
        var request = objectStore.put(row);
        request.onerror = function (event) {
          reject({
            message: event.target.error.name,
            key: row.key
          });
        };
        request.onsuccess = function () {
          resolve();
        };
      });
    }
  }, {
    key: '_deleteRow',
    value: function _deleteRow(objectStore, key) {
      return new Promise(function (resolve, reject) {
        var request = objectStore.delete(key);
        request.onerror = function (event) {
          reject({
            message: event.target.error.name,
            key: key
          });
        };
        request.onsuccess = function () {
          resolve();
        };
      });
    }
  }, {
    key: 'multiGet',
    value: function multiGet(keys, cb) {
      var _this3 = this;

      this._prepareDB().then(function (db) {
        var transaction = db.transaction(['pairs']);
        var objectStore = transaction.objectStore('pairs');
        var gets = [];
        keys.forEach(function (key) {
          return gets.push(_this3._getRow(objectStore, key));
        });
        return Promise.all(gets);
      }).then(function (rows) {
        _this3._rnctx.invokeCallback(cb, [undefined, rows]);
      }, function (err) {
        _this3._rnctx.invokeCallback(cb, [err]);
      });
    }
  }, {
    key: 'multiSet',
    value: function multiSet(pairs, cb) {
      var _this4 = this;

      this._prepareDB().then(function (db) {
        var transaction = db.transaction(['pairs'], 'readwrite');
        var objectStore = transaction.objectStore('pairs');
        var puts = [];
        pairs.forEach(function (pair) {
          var row = { key: pair[0], value: pair[1] };
          puts.push(_this4._putRow(objectStore, row));
        });
        return Promise.all(puts);
      }).then(function () {
        _this4._rnctx.invokeCallback(cb, []);
      }, function (err) {
        _this4._rnctx.invokeCallback(cb, [err]);
      });
    }
  }, {
    key: 'multiRemove',
    value: function multiRemove(keys, cb) {
      var _this5 = this;

      this._prepareDB().then(function (db) {
        var transaction = db.transaction(['pairs'], 'readwrite');
        var objectStore = transaction.objectStore('pairs');
        var deletes = [];
        keys.forEach(function (key) {
          return deletes.push(_this5._deleteRow(objectStore, key));
        });
        return Promise.all(deletes);
      }).then(function () {
        _this5._rnctx.invokeCallback(cb, []);
      }, function (err) {
        _this5._rnctx.invokeCallback(cb, [err]);
      });
    }
  }, {
    key: 'clear',
    value: function clear(cb) {
      var _this6 = this;

      this._prepareDB().then(function (db) {
        return new Promise(function (resolve, reject) {
          var transaction = db.transaction(['pairs'], 'readwrite');
          var objectStore = transaction.objectStore('pairs');
          var request = objectStore.clear();
          request.onerror = function (event) {
            reject({
              message: event.target.error.name
            });
          };
          request.onsuccess = function () {
            resolve();
          };
        });
      }).then(function () {
        _this6._rnctx.invokeCallback(cb, []);
      }, function (err) {
        _this6._rnctx.invokeCallback(cb, [err]);
      });
    }
  }, {
    key: 'getAllKeys',
    value: function getAllKeys(cb) {
      var _this7 = this;

      this._prepareDB().then(function (db) {
        return new Promise(function (resolve, reject) {
          var transaction = db.transaction(['pairs']);
          var objectStore = transaction.objectStore('pairs');
          var request = objectStore.openCursor();
          var keys = [];
          request.onerror = function (event) {
            reject({
              message: event.target.error.name
            });
          };
          request.onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
              keys.push(cursor.key);
              cursor.continue();
            } else {
              resolve(keys);
            }
          };
        });
      }).then(function (keys) {
        _this7._rnctx.invokeCallback(cb, [undefined, keys]);
      }, function (err) {
        _this7._rnctx.invokeCallback(cb, [err]);
      });
    }
  }]);
  return AsyncLocalStorage;
}(_Module3.default);

exports.default = AsyncLocalStorage;