
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

var _AppControls = require('../Control/AppControls');

var _AppControls2 = _interopRequireDefault(_AppControls);

var _OculusPlayer = require('./OculusPlayer');

var _Overlay = require('./Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

var _setStyles = require('./setStyles');

var _setStyles2 = _interopRequireDefault(_setStyles);

var _VREffect = require('../Control/VREffect');

var _VREffect2 = _interopRequireDefault(_VREffect);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var isMobile = /Mobi/i.test(navigator.userAgent);
var isAndroid = /Android/i.test(navigator.userAgent);
var isSamsung = isAndroid && /SM-[GN]/i.test(navigator.userAgent);
var fullscreenEvent = 'fullscreenchange';
if (!('onfullscreenchange' in document)) {
  if ('onwebkitfullscreenchange' in document) {
    fullscreenEvent = 'webkitfullscreenchange';
  } else if ('onmozfullscreenchange' in document) {
    fullscreenEvent = 'mozfullscreenchange';
  } else if ('onmsfullscreenchange' in document) {
    fullscreenEvent = 'msfullscreenchange';
  }
}

function isVRBrowser() {
  return 'VRDisplay' in window;
}

var FALLBACK_STYLES = {
  backgroundColor: '#000000',
  cursor: 'not-allowed',
  position: 'relative'
};
var FALLBACK_MESSAGE_STYLES = {
  background: 'rgba(0, 0, 0, 0.7)',
  border: '2px solid #ffffff',
  borderRadius: '5px',
  color: '#ffffff',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'normal',
  left: '50%',
  padding: '10px',
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '190px'
};

function isWebGLSupported() {
  var canvas = document.createElement('canvas');
  var gl = null;
  try {
    gl = canvas.getContext('webgl');
  } catch (e) {}
  if (gl) {
    return true;
  }
  try {
    gl = canvas.getContext('experimental-webgl');
  } catch (e) {}
  return !!gl;
}

function isMobileInLandscapeOrientation() {
  if (!isMobile) {
    return false;
  }

  var orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
  if (orientation) {
    if (orientation.type === 'landscape-primary' || orientation.type === 'landscape-secondary') {
      return true;
    } else if (orientation.type === 'portrait-secondary' || orientation.type === 'portrait-primary') {
      return false;
    }
  }

  if (!window.orientation) {
    return false;
  }
  var quadrant = Math.round(window.orientation / 90);
  while (quadrant < 0) {
    quadrant += 4;
  }
  while (quadrant >= 4) {
    quadrant -= 4;
  }
  return quadrant === 1 || quadrant === 3;
}

var Player = function () {
  function Player() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Player);

    this.attemptEnterVR = this.attemptEnterVR.bind(this);
    this.attemptEnterFullscreen = this.attemptEnterFullscreen.bind(this);
    this.enterVR = this.enterVR.bind(this);
    this.exitVR = this.exitVR.bind(this);
    this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
    this.resetAngles = this.resetAngles.bind(this);

    this.isMobile = isMobile;
    this.allowCarmelDeeplink = !!options.allowCarmelDeeplink && isSamsung;
    this.calculateVerticalFOV = options.calculateVerticalFOV;

    this.controlOptions = { disableTouchPanning: !!options.disableTouchPanning };

    var width = options.width;
    var height = options.height;
    var pixelRatio = options.pixelRatio;
    var el = void 0;
    if (typeof options.elementOrId === 'string') {
      var id = options.elementOrId;
      var elementById = document.getElementById(id);
      if (!elementById) {
        throw new Error('No DOM element with id: ' + id);
      }
      el = elementById;
    } else {
      el = options.elementOrId;
    }
    var camera = options.camera;

    if (!el) {
      var body = document.body;
      if (!body) {
        throw new Error('Cannot automatically attach the Player to a document with no body');
      }
      el = body;
    }
    this._el = el;

    var fixedSize = true;
    if (!width) {
      if (this._el === document.body) {
        fixedSize = false;
        width = window.innerWidth;
      } else {
        width = this._el.clientWidth;
      }
    }
    if (!height) {
      if (this._el === document.body) {
        fixedSize = false;
        height = window.innerHeight;
      } else {
        height = this._el.clientHeight;
      }
    }
    if (!pixelRatio) {
      this.fixedPixelRatio = false;
      pixelRatio = window.devicePixelRatio || 1;
    } else {
      this.fixedPixelRatio = true;
    }

    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;

    if (!fixedSize && this._el === document.body) {
      this.addResizeHandler();
    }

    if (camera) {
      this._camera = camera;
    } else {
      var fov = void 0;
      if (isMobileInLandscapeOrientation()) {
        fov = Math.max(30, Math.min(70, 60 / (width / height)));
      } else {
        fov = 60;
      }
      if (typeof this.calculateVerticalFOV === 'function') {
        fov = this.calculateVerticalFOV(width, height);
      }
      this._camera = new _ThreeShim2.default.PerspectiveCamera(fov, width / height, 0.01, 10000.0);
    }
    this._initialAngles = {
      x: this._camera.rotation.x,
      y: this._camera.rotation.y,
      z: this._camera.rotation.z
    };
    this._lastAngle = this._camera.rotation.y;

    if (!isWebGLSupported()) {
      this.renderFallback(width, height);
      return this;
    }

    var antialias = options.hasOwnProperty('antialias') ? options.antialias : true;
    var alpha = options.hasOwnProperty('canvasAlpha') ? options.canvasAlpha : true;
    var renderer = new _ThreeShim2.default.WebGLRenderer({
      antialias: antialias,
      alpha: alpha
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    this.glRenderer = renderer;
    this.controls = new _AppControls2.default(this._camera, this.glRenderer.domElement, this.controlOptions);
    this.onEnterVR = options.onEnterVR;
    this.onExitVR = options.onExitVR;

    var overlay = new _Overlay2.default({
      vrButtonHandler: this.attemptEnterVR,
      fullscreenButtonHandler: this.attemptEnterFullscreen,
      hideCompass: options.hideCompass,
      hideFullscreen: options.hideFullscreen,
      resetAngles: isMobile ? null : this.resetAngles
    });
    this.overlay = overlay;
    if (isVRBrowser() || this.allowCarmelDeeplink) {
      this.overlay.enableVRButton();
    }

    var wrapper = document.createElement('div');
    this._wrapper = wrapper;
    (0, _setStyles2.default)(wrapper, {
      width: width + 'px',
      height: height + 'px',
      position: 'relative',
      cursor: 'grab'
    });
    if (wrapper.style.cursor === '') {
      wrapper.style.cursor = '-webkit-grab';
      if (wrapper.style.cursor === '') {
        wrapper.style.cursor = '-moz-grab';
      }
    }
    wrapper.appendChild(overlay.domElement);
    wrapper.appendChild(renderer.domElement);

    this._el.appendChild(wrapper);

    var hideAndCleanUp = function hideAndCleanUp() {
      wrapper.removeEventListener('mouseover', hideAndCleanUp);
      wrapper.removeEventListener('touchstart', hideAndCleanUp);
      _this.overlay.hideGyro();
    };
    wrapper.addEventListener('mouseover', hideAndCleanUp);
    wrapper.addEventListener('touchstart', hideAndCleanUp);
    if (isMobile) {
      setTimeout(hideAndCleanUp, 4000);
    }
    this._compass = new _ThreeShim2.default.Vector3();

    this.frameData = null;
    if ('VRFrameData' in window) {
      this.frameData = new VRFrameData();
    }

    window.addEventListener('vrdisplayactivate', this.enterVR);
    window.addEventListener('vrdisplaydeactivate', this.exitVR);

    if ('getVRDisplays' in navigator) {
      navigator.getVRDisplays().then(function (displays) {
        if (displays.length) {
          var display = displays[0];
          _this.vrDisplay = display;
          _this.controls.setVRDisplay(display);
          var effect = new _VREffect2.default(_this.glRenderer, display);
          _this.effect = effect;
          var size = renderer.getSize();
          effect.setSize(size.width, size.height);
          _this.onEnterVR && _this.onEnterVR();

          return effect.requestPresent();
        }
      }).catch(function (err) {
        _this.onExitVR && _this.onExitVR();
      });
    }
  }

  _createClass(Player, [{
    key: 'renderFallback',
    value: function renderFallback(width, height) {
      var fallback = document.createElement('div');
      (0, _setStyles2.default)(fallback, FALLBACK_STYLES);
      (0, _setStyles2.default)(fallback, {
        width: width + 'px',
        height: height + 'px'
      });
      var message = document.createElement('div');
      message.appendChild(document.createTextNode('The current browser does not support WebGL.'));
      (0, _setStyles2.default)(message, FALLBACK_MESSAGE_STYLES);
      fallback.appendChild(message);
      this._el.appendChild(fallback);
    }

  }, {
    key: 'frame',
    value: function frame() {
      var frameOptions = {};
      if (this.frameData && this.vrDisplay && this.vrDisplay.isPresenting) {
        this.vrDisplay.getFrameData(this.frameData);
        frameOptions.frameData = this.frameData;
      }
      this.controls.frame(frameOptions);

      this._camera.updateMatrixWorld(true);

      if (!(this.vrDisplay && this.vrDisplay.isPresenting && isMobile)) {
        this._compass.set(1, 0, 0);
        this._compass.applyQuaternion(this._camera.quaternion);
        var rotationY = Math.acos(this._compass.x) * -Math.sign(this._compass.z);
        if (rotationY !== this._lastAngle) {
          this._lastAngle = rotationY;
          this.overlay.setCompassAngle(this._lastAngle);
        }
      }
    }
  }, {
    key: '_renderUpdate',
    value: function _renderUpdate(node, scene, camera) {
      node.onUpdate && node.onUpdate(scene, camera);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = node.children[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          this._renderUpdate(child, scene, camera);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

  }, {
    key: 'render',
    value: function render(scene) {
      this._renderUpdate(scene, scene, this._camera);
      if (this.effect && this.frameData && this.vrDisplay && this.vrDisplay.isPresenting) {
        this.effect.render(scene, this._camera, this.frameData);
        if (!isMobile) {
          this._renderMonoCamera(scene);
        }
      } else {
        this._renderMonoCamera(scene);
      }
    }
  }, {
    key: 'renderOffscreen',
    value: function renderOffscreen(scene, camera, target) {
      this._renderUpdate(scene, scene, camera);
      var oldClearColor = this.glRenderer.getClearColor();
      var oldClearAlpha = this.glRenderer.getClearAlpha();
      var oldSort = this.glRenderer.sortObjects;
      var oldClipping = this.glRenderer.localClippingEnabled;
      this.glRenderer.localClippingEnabled = true;
      this.glRenderer.setClearColor('#000', 0);
      this.glRenderer.sortObjects = false;
      this.glRenderer.render(scene, camera, target, true);
      this.glRenderer.sortObjects = oldSort;
      this.glRenderer.setClearColor(oldClearColor, oldClearAlpha);
      this.glRenderer.setRenderTarget(null);
      this.glRenderer.localClippingEnabled = oldClipping;
    }

  }, {
    key: '_renderMonoCamera',
    value: function _renderMonoCamera(scene) {
      var backupScene = scene.background;

      if (scene.backgroundLeft) {
        scene.background = scene.backgroundLeft;
      }
      this.glRenderer.render(scene, this._camera);
      scene.background = backupScene;
    }

  }, {
    key: 'requestAnimationFrame',
    value: function requestAnimationFrame(fn) {
      if (this.vrDisplay) {
        return this.vrDisplay.requestAnimationFrame(fn);
      }
      return window.requestAnimationFrame(fn);
    }

  }, {
    key: 'enterVR',
    value: function enterVR() {
      var _this2 = this;

      if (!this.vrDisplay || !this.effect) {
        return Promise.reject('Cannot enter VR, no display detected');
      }
      return this.effect.requestPresent([{
        source: this.glRenderer.domElement
      }]).then(function () {
        _this2.onEnterVR && _this2.onEnterVR();
        _this2.overlay.setVRButtonText('Exit VR');
        _this2.overlay.setVRButtonHandler(_this2.exitVR);
      }, function (err) {
        console.error(err);
      });
    }

  }, {
    key: 'exitVR',
    value: function exitVR() {
      var _this3 = this;

      if (!this.vrDisplay || !this.vrDisplay.isPresenting || !this.effect) {
        return Promise.reject('Cannot exit, not currently presenting');
      }
      return this.effect.exitPresent().then(function () {
        _this3.onExitVR && _this3.onExitVR();
        _this3.overlay.setVRButtonText('View in VR');
        _this3.overlay.setVRButtonHandler(_this3.attemptEnterVR);
      }, function (err) {
        console.error(err);
      });
    }

  }, {
    key: 'attemptEnterVR',
    value: function attemptEnterVR() {
      var _this4 = this;

      if (isVRBrowser() && this.vrDisplay) {
        console.log('Entering VR');
        this.enterVR().then(function () {
          console.log('Presenting to VR Display');
        }, function (err) {
          console.error('Failed to present. Is another application is already using the display?');
        });
      } else if (this.allowCarmelDeeplink) {
        console.log('Attempting Oculus Browser');

        this.overlay.disableVRButton();
        (0, _OculusPlayer.attemptOculusPlayer)().then(function () {
          _this4.overlay.enableVRButton();
        }, function () {
          console.log('No VR support!');
          _this4.overlay.enableVRButton();
          _this4.overlay.showSupportMessage();
        });
      }
    }

  }, {
    key: 'attemptEnterFullscreen',
    value: function attemptEnterFullscreen(fullscreenMethod) {
      document.addEventListener(fullscreenEvent, this.handleFullscreenChange);
      var canvas = this.glRenderer.domElement;
      if (typeof canvas[fullscreenMethod] === 'function') {
        canvas[fullscreenMethod]();
      }
    }

  }, {
    key: 'handleFullscreenChange',
    value: function handleFullscreenChange() {
      var element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
      if (element === this.glRenderer.domElement) {
        this.resize(window.innerWidth, window.innerHeight);
      } else if (!element) {
        this.resize(this.width, this.height);
        document.removeEventListener(fullscreenEvent, this.handleFullscreenChange);
      }
    }

  }, {
    key: 'resize',
    value: function resize(width, height) {
      if (this.glRenderer && this._camera) {
        this._wrapper.style.width = width + 'px';
        this._wrapper.style.height = height + 'px';
        if (!this.fixedPixelRatio) {
          this.pixelRatio = window.devicePixelRatio || 1;
        }
        this.glRenderer.setPixelRatio(this.pixelRatio);
        this.glRenderer.setSize(width, height, true);
        var fov = void 0;
        if (isMobileInLandscapeOrientation()) {
          fov = Math.max(30, Math.min(70, 60 / (width / height)));
        } else {
          fov = 60;
        }
        if (typeof this.calculateVerticalFOV === 'function') {
          fov = this.calculateVerticalFOV(width, height);
        }
        this._camera.fov = fov;
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
      }
    }

  }, {
    key: 'addResizeHandler',
    value: function addResizeHandler() {
      var _this5 = this;

      var last = 0;
      var timer = null;
      var delay = 100;

      this._resizeHandler = function () {
        if (_this5.vrDisplay && _this5.vrDisplay.isPresenting) {
          return;
        }
        var now = Date.now();
        if (!last) {
          last = now;
        }
        if (timer) {
          clearTimeout(timer);
        }
        if (now > last + delay) {
          last = now;
          _this5.resize(window.innerWidth, window.innerHeight);
          return;
        }
        timer = setTimeout(function () {
          last = now;
          _this5.resize(window.innerWidth, window.innerHeight);
        }, delay);
      };
      window.addEventListener('resize', this._resizeHandler);
    }

  }, {
    key: 'removeResizeHandler',
    value: function removeResizeHandler() {
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
        this._resizeHandler = null;
      }
    }

  }, {
    key: 'resetAngles',
    value: function resetAngles() {
      var _initialAngles = this._initialAngles,
          x = _initialAngles.x,
          y = _initialAngles.y,
          z = _initialAngles.z;

      this.controls.resetRotation(x, y, z);
    }

  }, {
    key: 'camera',
    get: function get() {
      return this._camera;
    },
    set: function set(value) {
      this._camera = value;
      this._initialAngles = {
        x: value.rotation.x,
        y: value.rotation.y,
        z: value.rotation.z
      };
      if (typeof this.controls.setCamera === 'function') {
        this.controls.setCamera(value);
      }
    }

  }, {
    key: 'renderer',
    get: function get() {
      return this.glRenderer;
    }
  }]);

  return Player;
}();

exports.default = Player;