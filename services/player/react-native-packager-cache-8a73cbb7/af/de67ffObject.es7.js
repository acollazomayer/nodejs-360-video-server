

(function () {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  if (typeof Object.entries !== 'function') {
    Object.entries = function (object) {
      if (object == null) {
        throw new TypeError('Object.entries called on non-object');
      }

      var entries = [];
      for (var key in object) {
        if (hasOwnProperty.call(object, key)) {
          entries.push([key, object[key]]);
        }
      }
      return entries;
    };
  }

  if (typeof Object.values !== 'function') {
    Object.values = function (object) {
      if (object == null) {
        throw new TypeError('Object.values called on non-object');
      }

      var values = [];
      for (var key in object) {
        if (hasOwnProperty.call(object, key)) {
          values.push(object[key]);
        }
      }
      return values;
    };
  }
})();