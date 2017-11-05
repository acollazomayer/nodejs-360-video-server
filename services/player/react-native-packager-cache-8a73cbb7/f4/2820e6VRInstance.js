Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var _ovrui = require('ovrui');

var _bundleFromRoot = require('./bundleFromRoot');

var _bundleFromRoot2 = babelHelpers.interopRequireDefault(_bundleFromRoot);

var _createRootView = require('./createRootView');

var _createRootView2 = babelHelpers.interopRequireDefault(_createRootView);

var VRInstance = function () {
  function VRInstance(bundle, root, parent) {
    var _this = this;

    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    babelHelpers.classCallCheck(this, VRInstance);

    if (!bundle) {
      throw new Error('Cannot initialize ReactVR without specifying a bundle');
    }
    if (!root) {
      throw new Error('Cannot initialize ReactVR without specifying the root component');
    }

    this.scene = options.scene || new _three.Scene();

    var allowCarmelDeeplink = !!options.allowCarmelDeeplink;

    this.player = new _ovrui.Player({
      elementOrId: parent,

      camera: options.camera,
      width: options.width,
      height: options.height,
      onEnterVR: function onEnterVR() {
        return _this._onEnterVR();
      },
      onExitVR: function onExitVR() {
        return _this._onExitVR();
      },
      allowCarmelDeeplink: allowCarmelDeeplink,
      disableTouchPanning: options.disableTouchPanning,
      pixelRatio: options.pixelRatio,
      hideFullscreen: options.hideFullscreen,
      hideCompass: options.hideCompass
    });

    var defaultAssetRoot = 'static_assets/';
    if (__DEV__) {
      defaultAssetRoot = '../static_assets/';
    }
    var assetRoot = options.assetRoot || defaultAssetRoot;
    if (!assetRoot.endsWith('/')) {
      assetRoot += '/';
    }

    var guiOptions = {
      cursorVisibility: options.hasOwnProperty('cursorVisibility') ? options.cursorVisibility : 'hidden',
      font: options.font,
      raycasters: options.raycasters
    };
    this.guiSys = new _ovrui.GuiSys(this.scene, guiOptions);
    this.rootView = (0, _createRootView2.default)(this.guiSys, root, {
      assetRoot: assetRoot,
      bundle: (0, _bundleFromRoot2.default)(bundle),
      customViews: options.customViews,
      enableHotReload: options.enableHotReload,
      isLowLatency: !this.player.isMobile,
      nativeModules: options.nativeModules
    });

    this._frame = this._frame.bind(this);
  }

  babelHelpers.createClass(VRInstance, [{
    key: '_frame',
    value: function _frame(timestamp) {
      if (typeof this.render === 'function') {
        this.render(timestamp);
      }
      var camera = this.player.camera;
      this.player.frame();

      this.guiSys.frame(camera, this.player.renderer);

      this.rootView.frame(camera);

      var subScenes = this.guiSys.getOffscreenRenders();
      for (var item in subScenes) {
        if (!subScenes.hasOwnProperty(item)) {
          continue;
        }
        var params = subScenes[item];
        this.player.renderOffscreen(params.scene, params.camera, params.renderTarget);
      }
      this.player.render(this.scene);

      if (this._looping) {
        this.player.requestAnimationFrame(this._frame);
      }
    }
  }, {
    key: '_onEnterVR',
    value: function _onEnterVR() {
      this.rootView.context && this.rootView.context.callFunction('RCTDeviceEventEmitter', 'emit', ['onEnterVR', []]);
    }
  }, {
    key: '_onExitVR',
    value: function _onExitVR() {
      this.rootView.context && this.rootView.context.callFunction('RCTDeviceEventEmitter', 'emit', ['onExitVR', []]);
    }
  }, {
    key: 'start',
    value: function start() {
      this._looping = true;
      this.player.requestAnimationFrame(this._frame);
    }
  }, {
    key: 'stop',
    value: function stop() {
      this._looping = false;
    }
  }, {
    key: 'camera',
    value: function camera() {
      return this.player.camera;
    }
  }, {
    key: 'registerTextureSource',
    value: function registerTextureSource(name, source) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (this.rootView && this.rootView.context) {
        this.rootView.context.registerTextureSource(name, source, options);
      }
    }
  }]);
  return VRInstance;
}();

exports.default = VRInstance;