
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

var DEFAULT_LEFT_BOUNDS = [0.0, 0.0, 0.5, 1.0];
var DEFAULT_RIGHT_BOUNDS = [0.5, 0.0, 0.5, 1.0];

var leftCamera = new _ThreeShim2.default.PerspectiveCamera();
leftCamera.layers.enable(1);
leftCamera.viewID = 0;
var rightCamera = new _ThreeShim2.default.PerspectiveCamera();
rightCamera.layers.enable(2);
rightCamera.viewID = 1;
var leftTranslation = new _ThreeShim2.default.Vector3();
var rightTranslation = new _ThreeShim2.default.Vector3();

var VREffect = function () {
  function VREffect(renderer, vrDisplay) {
    _classCallCheck(this, VREffect);

    this.renderer = renderer;
    this.vrDisplay = vrDisplay;
    this.leftBounds = DEFAULT_LEFT_BOUNDS;
    this.rightBounds = DEFAULT_RIGHT_BOUNDS;

    this.originalSize = renderer.getSize();
    this.originalPixelRatio = renderer.getPixelRatio();
  }

  _createClass(VREffect, [{
    key: '_configureRendererForVRDisplay',
    value: function _configureRendererForVRDisplay() {
      var leftParams = this.vrDisplay.getEyeParameters('left');
      var rightParams = this.vrDisplay.getEyeParameters('right');

      this.renderer.setPixelRatio(1);
      this.renderer.setSize(leftParams.renderWidth + rightParams.renderWidth, Math.min(leftParams.renderHeight, rightParams.renderHeight), false);
    }
  }, {
    key: 'requestPresent',
    value: function requestPresent() {
      var _this = this;

      if (!this.vrDisplay) {
        return Promise.reject();
      }
      if (this.vrDisplay.isPresenting) {
        return Promise.resolve();
      }
      return this.vrDisplay.requestPresent([{
        source: this.renderer.domElement
      }]).then(function () {
        _this._configureRendererForVRDisplay();
      });
    }
  }, {
    key: 'exitPresent',
    value: function exitPresent() {
      var _this2 = this;

      if (!this.vrDisplay) {
        return Promise.resolve();
      }
      if (!this.vrDisplay.isPresenting) {
        return Promise.resolve();
      }

      return this.vrDisplay.exitPresent().then(function () {
        _this2.renderer.setPixelRatio(_this2.originalPixelRatio);
        _this2.renderer.setSize(_this2.originalSize.width, _this2.originalSize.height, false);
      });
    }
  }, {
    key: 'setSize',
    value: function setSize(width, height) {
      this.originalSize = { width: width, height: height };

      if (this.vrDisplay && this.vrDisplay.isPresenting) {
        this._configureRendererForVRDisplay();
      } else {
        this.renderer.setPixelRatio(this.originalPixelRatio);
        this.renderer.setSize(width, height, false);
      }
    }
  }, {
    key: 'render',
    value: function render(scene, camera, frameData) {
      if (this.vrDisplay && this.vrDisplay.isPresenting) {
        var preserveAutoUpdate = scene.autoUpdate;
        if (preserveAutoUpdate) {
          scene.updateMatrixWorld();
          scene.autoUpdate = false;
        }

        var leftParams = this.vrDisplay.getEyeParameters('left');
        leftTranslation.fromArray(leftParams.offset);
        var rightParams = this.vrDisplay.getEyeParameters('right');
        rightTranslation.fromArray(rightParams.offset);

        var size = this.renderer.getSize();
        var leftRect = {
          x: Math.round(size.width * this.leftBounds[0]),
          y: Math.round(size.height * this.leftBounds[1]),
          width: Math.round(size.width * this.leftBounds[2]),
          height: Math.round(size.height * this.leftBounds[3])
        };
        var rightRect = {
          x: Math.round(size.width * this.rightBounds[0]),
          y: Math.round(size.height * this.rightBounds[1]),
          width: Math.round(size.width * this.rightBounds[2]),
          height: Math.round(size.height * this.rightBounds[3])
        };

        this.renderer.setScissorTest(true);

        if (this.renderer.autoClear) {
          this.renderer.clear();
        }

        if (!camera.parent) {
          camera.updateMatrixWorld();
        }

        camera.matrixWorld.decompose(leftCamera.position, leftCamera.quaternion, leftCamera.scale);
        camera.matrixWorld.decompose(rightCamera.position, rightCamera.quaternion, rightCamera.scale);

        leftCamera.translateOnAxis(leftTranslation, 1);
        rightCamera.translateOnAxis(rightTranslation, 1);

        leftCamera.projectionMatrix.elements = frameData.leftProjectionMatrix;
        rightCamera.projectionMatrix.elements = frameData.rightProjectionMatrix;

        var backupScene = scene.background;

        var isStereoBackgroundReady = !!scene.backgroundLeft && !!scene.backgroundRight;

        if (isStereoBackgroundReady) {
          scene.background = scene.backgroundLeft;
        }

        this.renderer.setViewport(leftRect.x, leftRect.y, leftRect.width, leftRect.height);
        this.renderer.setScissor(leftRect.x, leftRect.y, leftRect.width, leftRect.height);
        this.renderer.render(scene, leftCamera);

        if (isStereoBackgroundReady) {
          scene.background = scene.backgroundRight;
        }

        this.renderer.setViewport(rightRect.x, rightRect.y, rightRect.width, rightRect.height);
        this.renderer.setScissor(rightRect.x, rightRect.y, rightRect.width, rightRect.height);
        this.renderer.render(scene, rightCamera);

        scene.background = backupScene;

        this.renderer.setViewport(0, 0, size.width, size.height);
        this.renderer.setScissorTest(false);

        if (preserveAutoUpdate) {
          scene.autoUpdate = true;
        }
        this.vrDisplay.submitFrame();
      }
    }
  }]);

  return VREffect;
}();

exports.default = VREffect;