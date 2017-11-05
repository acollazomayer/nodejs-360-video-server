
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

var _MobilePanControls = require('./MobilePanControls');

var _MobilePanControls2 = _interopRequireDefault(_MobilePanControls);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Y_UNIT = new _ThreeShim2.default.Vector3(0, 1, 0);
var Z_UNIT = new _ThreeShim2.default.Vector3(0, 0, 1);

var SCREEN_ROTATION = new _ThreeShim2.default.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));

var rotation = new _ThreeShim2.default.Quaternion();
var euler = new _ThreeShim2.default.Euler();

function getScreenOrientation() {
  var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation || {};
  var angle = orientation.angle || window.orientation || 0;
  return _ThreeShim2.default.Math.degToRad(angle);
}

var DeviceOrientationControls = function () {
  function DeviceOrientationControls(camera, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, DeviceOrientationControls);

    this.camera = camera;
    this.enabled = true;
    this.mobilePanControls = new _MobilePanControls2.default(camera, target);

    if (options.disableTouchPanning) {
      this.mobilePanControls.enabled = false;
    }

    this.screenOrientation = getScreenOrientation();

    this.deviceOrientation = {};

    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
    this.deviceOrientationHandler = this.deviceOrientationHandler.bind(this);

    this._initialAlpha = null;

    this.connect();
  }

  _createClass(DeviceOrientationControls, [{
    key: 'connect',
    value: function connect() {
      this.screenOrientation = getScreenOrientation();
      window.addEventListener('orientationchange', this.orientationChangeHandler);
      window.addEventListener('deviceorientation', this.deviceOrientationHandler);
      this.enabled = true;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      window.removeEventListener('orientationchange', this.orientationChangeHandler);
      window.removeEventListener('deviceorientation', this.deviceOrientationHandler);
      this.enabled = false;
    }
  }, {
    key: 'orientationChangeHandler',
    value: function orientationChangeHandler() {
      this.screenOrientation = getScreenOrientation();
    }
  }, {
    key: 'deviceOrientationHandler',
    value: function deviceOrientationHandler(event) {
      var alpha = _ThreeShim2.default.Math.degToRad(event.alpha);
      var beta = _ThreeShim2.default.Math.degToRad(event.beta);
      var gamma = _ThreeShim2.default.Math.degToRad(event.gamma);
      if (this._initialAlpha === null) {
        this._initialAlpha = alpha - getScreenOrientation();
      }
      this.deviceOrientation.alpha = alpha;
      this.deviceOrientation.beta = beta;
      this.deviceOrientation.gamma = gamma;
    }
  }, {
    key: 'resetRotation',
    value: function resetRotation(x, y, z) {}
  }, {
    key: 'update',
    value: function update() {
      if (!this.enabled) {
        return;
      }
      var alpha = this.deviceOrientation.alpha || 0;
      var beta = this.deviceOrientation.beta || 0;
      var gamma = this.deviceOrientation.gamma || 0;
      var orient = this.screenOrientation;

      var quaternion = this.camera.quaternion;
      euler.set(beta, alpha, -gamma, 'YXZ');
      quaternion.setFromEuler(euler);
      if (this._initialAlpha !== null) {
        rotation.setFromAxisAngle(Y_UNIT, -this._initialAlpha);
        quaternion.premultiply(rotation);
      }
      quaternion.multiply(SCREEN_ROTATION);
      rotation.setFromAxisAngle(Z_UNIT, -orient);
      quaternion.multiply(rotation);

      if (this.mobilePanControls.enabled) {
        this.mobilePanControls.update();
      }
    }
  }], [{
    key: 'isSupported',
    value: function isSupported() {
      return 'DeviceOrientationEvent' in window && /Mobi/i.test(navigator.userAgent) && !/OculusBrowser/i.test(navigator.userAgent);
    }
  }]);

  return DeviceOrientationControls;
}();

exports.default = DeviceOrientationControls;