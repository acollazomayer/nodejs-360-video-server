
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

var HALF_PI = Math.PI / 2;

var RADIAN_CONVERT = Math.PI / 180;

var MousePanControls = function () {
  function MousePanControls(camera, target) {
    _classCallCheck(this, MousePanControls);

    this.yaw = camera.rotation.y;
    this.pitch = camera.rotation.x;
    this.camera = camera;
    this.enabled = true;
    this.tracking = false;
    this.target = target || window;

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);

    this.connect();
  }

  _createClass(MousePanControls, [{
    key: 'connect',
    value: function connect() {
      this.target.addEventListener('mousedown', this.mouseDownHandler);
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('mouseup', this.mouseUpHandler);
      this.enabled = true;

      this.tracking = false;
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.target.removeEventListener('mousedown', this.mouseDownHandler);
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('mouseup', this.mouseUpHandler);
      this.enabled = false;
    }
  }, {
    key: 'mouseDownHandler',
    value: function mouseDownHandler(e) {
      this.tracking = true;
      this.lastX = e.screenX;
      this.lastY = e.screenY;
    }
  }, {
    key: 'mouseUpHandler',
    value: function mouseUpHandler() {
      this.tracking = false;
    }
  }, {
    key: 'mouseMoveHandler',
    value: function mouseMoveHandler(e) {
      if (!this.tracking) {
        return;
      }

      var width = window.innerWidth;
      var height = window.innerHeight;
      if (this.target !== window) {
        width = this.target.clientWidth;
        height = this.target.clientHeight;
      }
      var deltaX = typeof this.lastX === 'number' ? e.screenX - this.lastX : 0;
      var deltaY = typeof this.lastY === 'number' ? e.screenY - this.lastY : 0;
      this.lastX = e.screenX;
      this.lastY = e.screenY;
      this.yaw += deltaX / width * this.camera.fov * this.camera.aspect * RADIAN_CONVERT;
      this.pitch += deltaY / height * this.camera.fov * RADIAN_CONVERT;
      this.pitch = Math.max(-HALF_PI, Math.min(HALF_PI, this.pitch));
    }
  }, {
    key: 'resetRotation',
    value: function resetRotation(x, y, z) {
      this.yaw = y;
      this.pitch = x;
    }
  }, {
    key: 'update',
    value: function update() {
      if (!this.enabled) {
        return;
      }
      this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    }
  }]);

  return MousePanControls;
}();

exports.default = MousePanControls;