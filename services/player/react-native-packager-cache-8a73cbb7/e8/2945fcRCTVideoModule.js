Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VRVideoPlayer = require('../Video/VRVideoPlayer');

var _VRVideoComponent = require('../Video/VRVideoComponent');

var _VRVideoComponent2 = babelHelpers.interopRequireDefault(_VRVideoComponent);

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var _MediaEvent = require('../Events/MediaEvent');

var _MediaEvent2 = babelHelpers.interopRequireDefault(_MediaEvent);

var MEDIA_EVENT_CALLBACK_NAME = {
  canplay: 'onVideoCanPlay',
  durationchange: 'onVideoDurationChange',
  ended: 'onVideoEnded',
  error: 'onVideoError',
  timeupdate: 'onVideoTimeUpdate',
  playing: 'onVideoPlaying',
  pause: 'onVideoPause'
};

var RCTVideoModule = function (_Module) {
  babelHelpers.inherits(RCTVideoModule, _Module);

  function RCTVideoModule(rnctx) {
    babelHelpers.classCallCheck(this, RCTVideoModule);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTVideoModule.__proto__ || Object.getPrototypeOf(RCTVideoModule)).call(this, 'RCTVideoModule'));

    _this.supportedFormats = (0, _VRVideoPlayer.getCustomizedSupportedFormats)() || [];
    _this._videoDefs = {};
    _this._players = {};
    _this._rnctx = rnctx;
    _this._mediaEventCallbacks = {};
    return _this;
  }

  babelHelpers.createClass(RCTVideoModule, [{
    key: 'addHandle',
    value: function addHandle(handle) {
      var player = new _VRVideoComponent2.default();
      this._players[handle] = player;
      this._videoDefs[handle] = this._createVideoDef();
      this._mediaEventCallbacks[handle] = {};
      player.onMediaEvent = this._onMediaEvent.bind(this, handle);
    }
  }, {
    key: '_createVideoDef',
    value: function _createVideoDef() {
      return {};
    }
  }, {
    key: '_onMediaEvent',
    value: function _onMediaEvent(handle, event) {
      var eventType = event.type;
      if (MEDIA_EVENT_CALLBACK_NAME[eventType]) {
        var callbackName = MEDIA_EVENT_CALLBACK_NAME[eventType];
        var mediaEvent = new _MediaEvent2.default(event);

        this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', [callbackName, handle, mediaEvent]);

        var listeners = this._mediaEventCallbacks[handle] ? this._mediaEventCallbacks[handle][eventType] : null;
        if (listeners) {
          listeners.forEach(function (listener) {
            return listener(handle, mediaEvent);
          });
        }
      }
    }
  }, {
    key: '_addMediaEventListener',
    value: function _addMediaEventListener(handle, eventType, listener) {
      if (!this._mediaEventCallbacks[handle]) {
        console.warn('RCTVideoModule.addMediaEventListener: ' + ('can\'t add listener on a not exist handle: ' + handle));
        return;
      }

      if (!MEDIA_EVENT_CALLBACK_NAME[eventType]) {
        console.warn('RCTVideoModule.addMediaEventListener: ' + ('can\'t add listener on a not supported eventType: ' + eventType));
        return;
      }

      if (!this._mediaEventCallbacks[handle][eventType]) {
        this._mediaEventCallbacks[handle][eventType] = [];
      }

      var listeners = this._mediaEventCallbacks[handle][eventType];
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
    }
  }, {
    key: '_removeMediaEventListener',
    value: function _removeMediaEventListener(handle, eventType, listener) {
      if (!this._mediaEventCallbacks[handle] || !this._mediaEventCallbacks[handle][eventType]) {
        return;
      }
      var listeners = this._mediaEventCallbacks[handle][eventType];
      if (listeners) {
        var index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }, {
    key: 'setUrl',
    value: function setUrl(handle, url) {
      this._videoDefs[handle].src = url;
    }
  }, {
    key: 'setFormat',
    value: function setFormat(handle, format) {
      this._videoDefs[handle].format = format;
    }
  }, {
    key: 'setMetaData',
    value: function setMetaData(handle, metaData) {
      this._videoDefs[handle].metaData = metaData;
    }
  }, {
    key: 'getVideoTexture',
    value: function getVideoTexture(handle) {
      if (!handle) {
        return null;
      }
      var player = this._players[handle];
      return player.videoTextures[0];
    }
  }, {
    key: 'load',
    value: function load(handle) {
      this._players[handle].setVideo(this._videoDefs[handle]);

      var monoTextureInfo = {
        type: 'MonoTextureInfo',
        texture: this._players[handle].videoTextures[0]
      };
      this._rnctx.RCTResourceManager.addResource('MonoTexture', handle, monoTextureInfo);
    }
  }, {
    key: 'play',
    value: function play(handle) {
      this._players[handle].videoPlayer.play();
    }
  }, {
    key: 'pause',
    value: function pause(handle) {
      this._players[handle].videoPlayer.pause();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(handle, position) {
      this._players[handle].videoPlayer.seekTo(position);
    }
  }, {
    key: 'setMuted',
    value: function setMuted(handle, muted) {
      this._players[handle].videoPlayer.setMuted(muted);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(handle, volume) {
      this._players[handle].videoPlayer.setVolume(volume);
    }
  }, {
    key: 'unload',
    value: function unload(handle) {
      this._rnctx.RCTResourceManager.removeResource('MonoTexture', handle);
      this._players[handle].dispose();
      delete this._players[handle];
      delete this._videoDefs[handle];
      delete this._mediaEventCallbacks[handle];
    }
  }, {
    key: 'frame',
    value: function frame() {
      for (var key in this._players) {
        this._players[key].frame();
      }
    }
  }]);
  return RCTVideoModule;
}(_Module3.default);

exports.default = RCTVideoModule;