
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var RayCaster = function () {
  function RayCaster() {
    _classCallCheck(this, RayCaster);
  }

  _createClass(RayCaster, [{
    key: 'getType',
    value: function getType() {
      throw new Error('RayCaster subclasses must override getType()');
    }
  }, {
    key: 'frame',
    value: function frame(startTime) {}
  }, {
    key: 'getRayOrigin',
    value: function getRayOrigin(camera) {
      throw new Error('RayCaster subclasses must override getRayOrigin()');
    }
  }, {
    key: 'getRayDirection',
    value: function getRayDirection(camera) {
      throw new Error('RayCaster subclasses must override getRayDirection()');
    }
  }, {
    key: 'drawsCursor',
    value: function drawsCursor() {
      return true;
    }
  }]);

  return RayCaster;
}();

exports.default = RayCaster;