Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


var IS_SUPPORTED = window.hasOwnProperty('webkitAudioContext') || window.hasOwnProperty('AudioContext');
var ContextConstructor = IS_SUPPORTED ? window.AudioContext || window.webkitAudioContext : null;
if (window.hasOwnProperty('webkitAudioContext') && !window.hasOwnProperty('AudioContext')) {
  console.log('Outdated version of Web Audio API detected.');
}

var VRAudioContext = function () {
  function VRAudioContext() {
    babelHelpers.classCallCheck(this, VRAudioContext);

    if (IS_SUPPORTED && typeof ContextConstructor === 'function') {
      this._context = new ContextConstructor();
    } else {
      throw new Error('Cannot create VRAudioContext, AudioContext is not supported');
    }
  }

  babelHelpers.createClass(VRAudioContext, [{
    key: 'getWebAudioContext',
    value: function getWebAudioContext() {
      return this._context;
    }
  }, {
    key: 'frame',
    value: function frame(camera) {
      if (!this._context) {
        return;
      }
      var listener = this._context.listener;
      var origin = camera.localToWorld(new THREE.Vector3(0, 0, 0));
      var front = camera.localToWorld(new THREE.Vector3(0, 0, -1)).sub(origin).normalize();
      var up = camera.localToWorld(new THREE.Vector3(0, 1, 0)).sub(origin).normalize();
      listener.setOrientation(front.x, front.y, front.z, up.x, up.y, up.z);
      if (typeof listener.setPosition === 'function') {
        listener.setPosition(origin.x, origin.y, origin.z);
      } else if (listener.positionX && listener.positionY && listener.positionZ) {
        listener.positionX.value = origin.x;
        listener.positionY.value = origin.y;
        listener.positionZ.value = origin.z;
      }
    }
  }], [{
    key: 'supported',
    value: function supported() {
      return IS_SUPPORTED;
    }
  }]);
  return VRAudioContext;
}();

exports.default = VRAudioContext;