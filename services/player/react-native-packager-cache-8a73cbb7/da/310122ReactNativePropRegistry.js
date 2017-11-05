
'use strict';

var objects = {};
var uniqueID = 1;
var emptyObject = {};

var ReactNativePropRegistry = function () {
  function ReactNativePropRegistry() {
    babelHelpers.classCallCheck(this, ReactNativePropRegistry);
  }

  babelHelpers.createClass(ReactNativePropRegistry, null, [{
    key: 'register',
    value: function register(object) {
      var id = ++uniqueID;
      if (__DEV__) {
        Object.freeze(object);
      }
      objects[id] = object;
      return id;
    }
  }, {
    key: 'getByID',
    value: function getByID(id) {
      if (!id) {
        return emptyObject;
      }

      var object = objects[id];
      if (!object) {
        console.warn('Invalid style with id `' + id + '`. Skipping ...');
        return emptyObject;
      }
      return object;
    }
  }]);
  return ReactNativePropRegistry;
}();

module.exports = ReactNativePropRegistry;