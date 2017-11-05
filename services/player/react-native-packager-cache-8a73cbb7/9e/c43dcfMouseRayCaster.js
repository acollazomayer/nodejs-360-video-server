
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

var _RayCaster2 = require('./RayCaster');

var _RayCaster3 = _interopRequireDefault(_RayCaster2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ORIGIN = [0, 0, 0];

var MouseRayCaster = function (_RayCaster) {
  _inherits(MouseRayCaster, _RayCaster);

  function MouseRayCaster() {
    _classCallCheck(this, MouseRayCaster);

    var _this = _possibleConstructorReturn(this, (MouseRayCaster.__proto__ || Object.getPrototypeOf(MouseRayCaster)).call(this));

    _this._lastX = null;
    _this._lastY = null;
    _this._lastOrientation = null;
    _this.touchReleaseDelay = 300;

    _this._active = true;

    _this._handleMouseEvent = _this._handleMouseEvent.bind(_this);
    _this._handleTouchEvent = _this._handleTouchEvent.bind(_this);
    _this._handleTouchEnd = _this._handleTouchEnd.bind(_this);
    _this._resetLastReading = _this._resetLastReading.bind(_this);

    document.addEventListener('mousemove', _this._handleMouseEvent);
    document.addEventListener('touchstart', _this._handleTouchEvent);
    document.addEventListener('touchmove', _this._handleTouchEvent);
    document.addEventListener('touchend', _this._handleTouchEnd);
    document.addEventListener('touchcancel', _this._handleTouchEnd);
    window.addEventListener('vrdisplaypresentchange', function (e) {
      _this._active = !e.display.isPresenting;
    });
    return _this;
  }

  _createClass(MouseRayCaster, [{
    key: '_handleMouseEvent',
    value: function _handleMouseEvent(e) {
      if (!this._active) {
        return;
      }
      var width = document.body ? document.body.clientWidth : 0;
      var height = document.body ? document.body.clientHeight : 0;
      var x = e.clientX / width * 2 - 1;
      var y = -(e.clientY / height) * 2 + 1;
      if (this._lastX !== x || this._lastY !== y) {
        this._lastOrientation = null;
      }
      this._lastX = x;
      this._lastY = y;
    }
  }, {
    key: '_handleTouchEvent',
    value: function _handleTouchEvent(e) {
      if (!this._active) {
        return;
      }
      var targetTouches = e.targetTouches;
      if (targetTouches && targetTouches.length > 0) {
        var width = document.body ? document.body.clientWidth : 0;
        var height = document.body ? document.body.clientHeight : 0;
        var rawTouch = e.targetTouches[0];
        var x = rawTouch.clientX / width * 2 - 1;
        var y = -(rawTouch.clientY / height) * 2 + 1;
        if (this._lastX !== x || this._lastY !== y) {
          this._lastOrientation = null;
        }
        this._lastX = x;
        this._lastY = y;
      } else {
        this._endTouch();
      }
    }
  }, {
    key: '_handleTouchEnd',
    value: function _handleTouchEnd(e) {
      if (!this._active) {
        return;
      }
      this._endTouch();
    }
  }, {
    key: '_endTouch',
    value: function _endTouch() {
      if (this._touchReleaseTimeout) {
        clearTimeout(this._touchReleaseTimeout);
      }
      this._touchReleaseTimeout = setTimeout(this._resetLastReading, this.touchReleaseDelay);
    }
  }, {
    key: '_resetLastReading',
    value: function _resetLastReading() {
      this._lastX = null;
      this._lastY = null;
      this._lastOrientation = null;
    }
  }, {
    key: '_clearTouchReleaseTimeout',
    value: function _clearTouchReleaseTimeout() {
      if (this._touchReleaseTimeout) {
        clearTimeout(this._touchReleaseTimeout);
      }
      this._touchReleaseTimeout = null;
    }
  }, {
    key: 'getType',
    value: function getType() {
      return 'mouse';
    }
  }, {
    key: 'getRayOrigin',
    value: function getRayOrigin() {
      if (!this._active) {
        return null;
      }
      return ORIGIN;
    }
  }, {
    key: 'getRayDirection',
    value: function getRayDirection(camera) {
      if (!this._active) {
        return null;
      }
      if (this._lastOrientation) {
        return this._lastOrientation;
      }
      if (this._lastX === null || this._lastY === null) {
        return null;
      }
      var fov = camera.fov * Math.PI / 180;
      var tan = Math.tan(fov / 2);
      var x = camera.aspect * tan * this._lastX;
      var y = tan * this._lastY;
      var mag = Math.sqrt(1 + x * x + y * y);
      this._lastOrientation = [x / mag, y / mag, -1 / mag];
      return this._lastOrientation;
    }
  }, {
    key: 'drawsCursor',
    value: function drawsCursor() {
      return false;
    }
  }]);

  return MouseRayCaster;
}(_RayCaster3.default);

exports.default = MouseRayCaster;