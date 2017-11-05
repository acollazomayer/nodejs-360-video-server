Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactNativeContext = undefined;

var _AndroidConstants = require('./Modules/AndroidConstants');

var _AndroidConstants2 = babelHelpers.interopRequireDefault(_AndroidConstants);

var _AsyncLocalStorage = require('./Modules/AsyncLocalStorage');

var _AsyncLocalStorage2 = babelHelpers.interopRequireDefault(_AsyncLocalStorage);

var _ControllerInfo = require('./Modules/ControllerInfo');

var _ControllerInfo2 = babelHelpers.interopRequireDefault(_ControllerInfo);

var _ExternalAssets = require('./Modules/ExternalAssets');

var _ExternalAssets2 = babelHelpers.interopRequireDefault(_ExternalAssets);

var _GlyphTextures = require('./Modules/GlyphTextures');

var _GlyphTextures2 = babelHelpers.interopRequireDefault(_GlyphTextures);

var _History = require('./Modules/History');

var _History2 = babelHelpers.interopRequireDefault(_History);

var _LinkingManager = require('./Modules/LinkingManager');

var _LinkingManager2 = babelHelpers.interopRequireDefault(_LinkingManager);

var _Location = require('./Modules/Location');

var _Location2 = babelHelpers.interopRequireDefault(_Location);

var _Networking = require('./Modules/Networking');

var _Networking2 = babelHelpers.interopRequireDefault(_Networking);

var _RCTResourceManager = require('./Utils/RCTResourceManager');

var _RCTInputControls = require('./Utils/RCTInputControls');

var _RCTHeadModel = require('./Utils/RCTHeadModel');

var _RCTHeadModel2 = babelHelpers.interopRequireDefault(_RCTHeadModel);

var _RCTVideoModule = require('./Modules/RCTVideoModule');

var _RCTVideoModule2 = babelHelpers.interopRequireDefault(_RCTVideoModule);

var _RCTAudioModule = require('./Modules/RCTAudioModule');

var _RCTAudioModule2 = babelHelpers.interopRequireDefault(_RCTAudioModule);

var _TextureManager = require('./Utils/TextureManager');

var _TextureManager2 = babelHelpers.interopRequireDefault(_TextureManager);

var _Timing = require('./Modules/Timing');

var _Timing2 = babelHelpers.interopRequireDefault(_Timing);

var _UIManager = require('./Modules/UIManager');

var _UIManager2 = babelHelpers.interopRequireDefault(_UIManager);

var _WebSocketModule = require('./Modules/WebSocketModule');

var _WebSocketModule2 = babelHelpers.interopRequireDefault(_WebSocketModule);

var _ReactVRConstants = require('./Modules/ReactVRConstants');

var _ReactVRConstants2 = babelHelpers.interopRequireDefault(_ReactVRConstants);

var _RCTExceptionsManager = require('./Modules/RCTExceptionsManager');

var _RCTExceptionsManager2 = babelHelpers.interopRequireDefault(_RCTExceptionsManager);

var _RCTSourceCode = require('./Modules/RCTSourceCode');

var _RCTSourceCode2 = babelHelpers.interopRequireDefault(_RCTSourceCode);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


var ROOT_VIEW_INCREMENT = 10;
var ONMOVE_EPSILON = 0.0001;

function replaceHiddenAttributes(key, value) {
  if (key.charAt && key.charAt(0) === '_') {
    return undefined;
  } else {
    return value;
  }
}

function describe(ctx) {
  var remoteModuleConfig = [];
  for (var _iterator = ctx.modules, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var module = _ref;

    var description = module._describe();
    if (__DEV__) {
      console.log(description);
    }
    remoteModuleConfig.push(description);
  }

  return remoteModuleConfig;
}

var ReactNativeContext = exports.ReactNativeContext = function () {
  function ReactNativeContext(guiSys, bridgeURL) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    babelHelpers.classCallCheck(this, ReactNativeContext);

    this.modules = [];
    this.currentRootTag = 1;
    this.worker = new Worker(bridgeURL);
    this.guiSys = guiSys;
    this.messages = [];
    this.isLowLatency = !!options.isLowLatency;
    this.enableHotReload = !!options.enableHotReload;

    this.lastHit = null;
    this.lastLocalIntersect = null;
    this.lastSource = null;

    this.UIManager = new _UIManager2.default(this, guiSys, options.customViews);
    this.Timing = new _Timing2.default(this);
    this.RCTResourceManager = new _RCTResourceManager.RCTResourceManager();
    this.RCTInputControls = new _RCTInputControls.RCTInputControls(this, guiSys);
    this.HeadModel = new _RCTHeadModel2.default(this);
    this.VideoModule = new _RCTVideoModule2.default(this);
    this.AudioModule = new _RCTAudioModule2.default(this);
    this.TextureManager = new _TextureManager2.default();
    this.GlyphTextures = new _GlyphTextures2.default(this);
    this._moduleForTag = [];
    this._cameraParentFromTag = [];

    this.registerModule(this.UIManager);
    this.registerModule(new _AndroidConstants2.default(this));
    this.registerModule(new _AsyncLocalStorage2.default(this));
    this.registerModule(new _ControllerInfo2.default(this));
    this.registerModule(new _History2.default(this));
    this.registerModule(new _Networking2.default(this));
    this.registerModule(new _LinkingManager2.default(this));
    this.registerModule(new _Location2.default(this));
    this.registerModule(this.Timing);
    this.registerModule(this.VideoModule);
    this.registerModule(this.AudioModule);
    this.registerModule(new _WebSocketModule2.default(this));
    this.registerModule(new _ReactVRConstants2.default());
    this.registerModule(new _RCTExceptionsManager2.default());
    this.registerModule(new _RCTSourceCode2.default(this));
    this.registerModule(new _ExternalAssets2.default(options.assetRoot || ''));
    this.registerModule(this.GlyphTextures);

    guiSys.eventDispatcher.addEventListener('GuiSysEvent', this._onGuiSysEvent.bind(this));
    guiSys.eventDispatcher.addEventListener('UIViewEvent', this._onUIViewEvent.bind(this));

    this.worker.onmessage = function (e) {
      var msg = e.data;
      if (!msg || !(msg instanceof Object) || !msg.cmd) {
        return;
      }
      if (msg.cmd === 'exec') {
        var results = msg.results;
        if (results && results.length) {
          _this.messages.push(results);
        }
      }
    };
  }

  babelHelpers.createClass(ReactNativeContext, [{
    key: 'init',
    value: function init(bundle) {
      this.worker.postMessage(JSON.stringify({
        cmd: 'moduleConfig',
        moduleConfig: { remoteModuleConfig: describe(this) }
      }, replaceHiddenAttributes));

      this.worker.postMessage(JSON.stringify({ cmd: 'bundle', bundleName: bundle }));
      if (this.enableHotReload) {
        var bundleURL = new URL(bundle);
        console.warn('HotReload on ' + bundle);
        this.callFunction('HMRClient', 'enable', ['vr', bundleURL.pathname.toString().substr(1), bundleURL.hostname, bundleURL.port]);
      }
    }
  }, {
    key: 'shutdown',
    value: function shutdown() {
      for (var _iterator2 = this.modules, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var module = _ref2;

        if (typeof module.shutdown === 'function') {
          module.shutdown();
        }
      }
    }
  }, {
    key: 'createRootView',
    value: function createRootView(module, props) {
      var tag = this.currentRootTag;
      this.currentRootTag += ROOT_VIEW_INCREMENT;
      this.worker.postMessage(JSON.stringify({
        cmd: 'exec',
        module: 'AppRegistry',
        function: 'runApplication',
        args: [module, { initialProps: props, rootTag: tag }]
      }));
      this._moduleForTag[tag] = module;
      this._cameraParentFromTag[tag] = new THREE.Object3D();
      this.UIManager.createRootView(tag);
      return tag;
    }
  }, {
    key: 'updateRootView',
    value: function updateRootView(tag, props) {
      this.worker.postMessage(JSON.stringify({
        cmd: 'exec',
        module: 'AppRegistry',
        function: 'runApplication',
        args: [this._moduleForTag[tag], { initialProps: props, rootTag: tag }]
      }));
    }
  }, {
    key: 'destroyRootView',
    value: function destroyRootView(tag) {
      delete this._moduleForTag[tag];
      var cameraParent = this._cameraParentFromTag[tag];
      if (cameraParent) {
        for (var _iterator3 = cameraParent.children, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
          var _ref3;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref3 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref3 = _i3.value;
          }

          var child = _ref3;

          cameraParent.remove(child);
        }
        delete this._cameraParentFromTag[tag];
      }
      this.worker.postMessage(JSON.stringify({
        cmd: 'exec',
        module: 'AppRegistry',
        function: 'unmountApplicationComponentAtRootTag',
        args: [tag]
      }));
    }
  }, {
    key: '_onGuiSysEvent',
    value: function _onGuiSysEvent(event) {
      switch (event.eventType) {
        case OVRUI.GuiSysEventType.HIT_CHANGED:
          if (this.lastHit !== event.args.currentHit || this.lastSource !== event.args.currentSource) {
            this.lastHit = event.args.currentHit;
            this.lastSource = event.args.currentSource;
          }
          break;
        default:
          break;
      }
    }
  }, {
    key: '_onUIViewEvent',
    value: function _onUIViewEvent(event) {
      switch (event.eventType) {
        case OVRUI.UIViewEventType.FOCUS_LOST:
          {
            var viewTag = event.view ? this.getHitTag(event.view) : undefined;
            var targetTag = event.args.target ? this.getHitTag(event.args.target) : undefined;
            var payload = {
              target: targetTag,
              source: event.args.source
            };
            if (viewTag) {
              this.callFunction('RCTEventEmitter', 'receiveEvent', [viewTag, 'topExit', payload]);
            }
          }
          break;
        case OVRUI.UIViewEventType.FOCUS_GAINED:
          {
            var _viewTag = event.view ? this.getHitTag(event.view) : undefined;
            var _targetTag = event.args.target ? this.getHitTag(event.args.target) : undefined;
            var _payload = {
              target: _targetTag,
              source: event.args.source
            };
            if (_viewTag) {
              this.callFunction('RCTEventEmitter', 'receiveEvent', [_viewTag, 'topEnter', _payload]);
            }
          }
          break;
        default:
          break;
      }
    }
  }, {
    key: 'frame',
    value: function frame(camera, rootTag) {
      var frameStart = window.performance ? performance.now() : Date.now();
      this.Timing && this.Timing.frame(frameStart);

      if (this.lastHit && this.lastHit.owner && this.lastHit.owner.receivesMoveEvent) {
        var intersect = this.guiSys.getLastLocalIntersect();
        if (!intersect) {
          this.lastLocalIntersect = null;
        }
        if (intersect) {
          var lastLocalIntersect = this.lastLocalIntersect;
          if (!lastLocalIntersect || Math.abs(intersect[0] - lastLocalIntersect[0]) > ONMOVE_EPSILON || Math.abs(intersect[1] - lastLocalIntersect[1]) > ONMOVE_EPSILON) {
            var viewTag = this.getHitTag(this.lastHit);
            var payload = { offset: intersect };
            this.callFunction('RCTEventEmitter', 'receiveEvent', [viewTag, 'topMove', payload]);
            this.lastLocalIntersect = intersect;
          }
        }
      }
      this.worker.postMessage(JSON.stringify({ cmd: 'flush' }));
      for (var _iterator4 = this.messages, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
        var _ref4;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref4 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref4 = _i4.value;
        }

        var results = _ref4;

        if (results && results.length >= 3) {
          var moduleIndex = results[0];
          var funcIndex = results[1];
          var params = results[2];
          for (var i = 0; i < moduleIndex.length; i++) {
            this.modules[moduleIndex[i]]._functionMap[funcIndex[i]].apply(this.modules[moduleIndex[i]], params[i]);
          }
        }
      }

      this.messages = [];
      this.UIManager && this.UIManager.frame(frameStart);
      this.HeadModel && this.HeadModel.frame(camera);
      this.VideoModule && this.VideoModule.frame();
      this.AudioModule && this.AudioModule.frame(camera);
      this.TextureManager.frame();

      if (rootTag) {
        this._applySceneTransform(camera, rootTag);
      }

      this.Timing && this.Timing.idle(frameStart);
    }
  }, {
    key: '_applySceneTransform',
    value: function _applySceneTransform(camera, rootTag) {
      var worldMatrix = this.UIManager.getSceneCameraTransform(rootTag);
      var cameraParent = this._cameraParentFromTag[rootTag];

      if (!worldMatrix || !cameraParent) {
        return;
      }

      if (camera.parent && camera.parent.uuid !== cameraParent.uuid) {
        console.warn('Camera object already has a parent; ' + "Use of 'transform' property on <Scene> will have no effect.");
        this._cameraParentFromTag[rootTag] = null;
        return;
      }

      if (cameraParent.children.length === 0) {
        cameraParent.add(camera);
      }

      cameraParent.matrixAutoUpdate = false;
      cameraParent.matrix.fromArray(worldMatrix);
      cameraParent.updateMatrixWorld(true);
    }
  }, {
    key: 'getHitTag',
    value: function getHitTag(hit) {
      while (hit) {
        if (hit.tag) {
          return hit.tag;
        }
        hit = hit.parent;
      }
      return undefined;
    }
  }, {
    key: 'callFunction',
    value: function callFunction(moduleName, functionName, args) {
      this.worker.postMessage(JSON.stringify({
        cmd: 'exec',
        module: moduleName,
        function: functionName,
        args: args
      }));
    }
  }, {
    key: 'invokeCallback',
    value: function invokeCallback(id, args) {
      this.worker.postMessage(JSON.stringify({
        cmd: 'invoke',
        id: id,
        args: args
      }));
    }
  }, {
    key: 'registerModule',
    value: function registerModule(module) {
      this.modules.push(module);
    }
  }, {
    key: 'registerTextureSource',
    value: function registerTextureSource(name, source) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      this.TextureManager.registerLocalTextureSource(name, source, options);
    }
  }]);
  return ReactNativeContext;
}();