
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

var _DeviceOrientationControls = require('./DeviceOrientationControls');

var _DeviceOrientationControls2 = _interopRequireDefault(_DeviceOrientationControls);

var _MousePanControls = require('./MousePanControls');

var _MousePanControls2 = _interopRequireDefault(_MousePanControls);

var _VRControls = require('./VRControls');

var _VRControls2 = _interopRequireDefault(_VRControls);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var AppControls = function () {
  function AppControls(camera, target) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, AppControls);

    this._camera = camera;
    this.nonVRControls = _DeviceOrientationControls2.default.isSupported() ? new _DeviceOrientationControls2.default(camera, target, options) : new _MousePanControls2.default(camera, target);
  }

  _createClass(AppControls, [{
    key: 'setVRDisplay',
    value: function setVRDisplay(vrDisplay) {
      if (!vrDisplay) {
        throw new Error('When calling setVRDisplay a non-null value is expected.');
      }
      this.vrControls = new _VRControls2.default(this._camera, vrDisplay);
    }
  }, {
    key: 'setCamera',
    value: function setCamera(camera) {
      this._camera = camera;
      this.nonVRControls.camera = camera;
      this.nonVRControls.resetRotation(camera.rotation.x, camera.rotation.y, camera.rotation.z);
      if (this.vrControls) {
        this.vrControls.camera = camera;
      }
    }
  }, {
    key: 'resetRotation',
    value: function resetRotation(x, y, z) {
      this.nonVRControls.resetRotation(x, y, z);
    }
  }, {
    key: 'frame',
    value: function frame(frameOptions) {
      if (this.vrControls) {
        var display = this.vrControls.vrDisplay;
        if (display && display.isPresenting) {
          return this.vrControls.update(frameOptions);
        }
      }
      this.nonVRControls.update(frameOptions);
    }
  }]);

  return AppControls;
}();

exports.default = AppControls;