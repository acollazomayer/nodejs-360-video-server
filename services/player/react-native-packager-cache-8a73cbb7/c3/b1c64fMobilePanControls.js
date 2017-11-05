
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

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Y_UNIT = new _ThreeShim2.default.Vector3(0, 1, 0);

var rotation = new _ThreeShim2.default.Quaternion();

var PAN_SPEED = 0.5;

var MIN_FOV = 10;

var MobilePanControls = function () {
  function MobilePanControls(camera, target) {
    _classCallCheck(this, MobilePanControls);

    this._camera = camera;
    this._target = target || window;

    this.enabled = true;

    this._panStart = new _ThreeShim2.default.Vector2();
    this._panEnd = new _ThreeShim2.default.Vector2();
    this._panDelta = new _ThreeShim2.default.Vector2();
    this._theta = 0;
    this._tracking = false;

    this._pinchLengthStart = 0;
    this._pinchLengthEnd = 0;
    this._zoomNeedsUpdate = false;
    this._originalFov = this._camera.fov;

    this._downHandler = this._downHandler.bind(this);
    this._moveHandler = this._moveHandler.bind(this);
    this._upHandler = this._upHandler.bind(this);

    this.connect();
  }

  _createClass(MobilePanControls, [{
    key: 'connect',
    value: function connect() {
      this._target.addEventListener('touchstart', this._downHandler);
      window.addEventListener('touchmove', this._moveHandler);
      window.addEventListener('touchend', this._upHandler);
      this.enabled = true;

      this._tracking = false;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this._target.removeEventListener('touchstart', this._downHandler);
      window.removeEventListener('touchmove', this._moveHandler);
      window.removeEventListener('touchend', this._upHandler);
      this.enabled = false;
    }
  }, {
    key: '_downHandler',
    value: function _downHandler(e) {
      this._tracking = true;

      if (e.touches.length > 1) {
        var dx = e.touches[0].pageX - e.touches[1].pageX;
        var dy = e.touches[0].pageY - e.touches[1].pageY;
        this._pinchLengthStart = Math.sqrt(dx * dx + dy * dy);
        this._pinchLengthEnd = this.pinchLengthStart;
        return;
      }
      var touch = e.touches[0];
      this._panStart.set(touch.pageX, touch.pageY);
    }
  }, {
    key: '_upHandler',
    value: function _upHandler() {
      this._tracking = false;
    }
  }, {
    key: '_moveHandler',
    value: function _moveHandler(e) {
      if (!this._tracking) {
        return;
      }

      if (e.touches.length > 1) {
        var dx = e.touches[0].pageX - e.touches[1].pageX;
        var dy = e.touches[0].pageY - e.touches[1].pageY;
        this._pinchLengthEnd = Math.sqrt(dx * dx + dy * dy);
        this._zoomNeedsUpdate = true;
        return;
      }

      var touch = e.touches[0];
      this._panEnd.set(touch.pageX, touch.pageY);
      this._panDelta.subVectors(this._panEnd, this._panStart);
      this._panStart.copy(this._panEnd);

      this._panDelta.x *= -1;

      var element = document.body;
      this._theta += 2 * Math.PI * this._panDelta.x / element.clientWidth * PAN_SPEED;
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.enabled) {
        return;
      }

      var quaternion = this._camera.quaternion;
      rotation.setFromAxisAngle(Y_UNIT, -this._theta);
      quaternion.premultiply(rotation);

      if (this._zoomNeedsUpdate) {
        var zoomFactor = this._pinchLengthStart / this._pinchLengthEnd;
        this._pinchLengthStart = this._pinchLengthEnd;
        var newFov = this._camera.fov * zoomFactor;

        if (newFov > MIN_FOV && newFov < this._originalFov) {
          this._camera.fov = newFov;
          this._camera.updateProjectionMatrix();
        }
        this._zoomNeedsUpdate = false;
      }
    }
  }]);

  return MobilePanControls;
}();

exports.default = MobilePanControls;