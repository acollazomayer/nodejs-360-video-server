
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

var VRControls = function () {
  function VRControls(camera, vrDisplay) {
    _classCallCheck(this, VRControls);

    this.camera = camera;
    this._vrDisplay = vrDisplay;
  }

  _createClass(VRControls, [{
    key: 'update',
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var pose = options.frameData ? options.frameData.pose : null;
      if (pose) {
        if (pose.position) {
          this.camera.position.fromArray(pose.position);
        }
        if (pose.orientation) {
          this.camera.quaternion.fromArray(pose.orientation);
        }
      }
    }
  }, {
    key: 'vrDisplay',
    get: function get() {
      return this._vrDisplay;
    }
  }]);

  return VRControls;
}();

exports.default = VRControls;