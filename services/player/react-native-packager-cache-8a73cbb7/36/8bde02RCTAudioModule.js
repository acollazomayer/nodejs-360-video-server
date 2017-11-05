Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getSupportedFormats = require('../Audio/getSupportedFormats');

var _getSupportedFormats2 = babelHelpers.interopRequireDefault(_getSupportedFormats);

var _VRAudioComponent = require('../Audio/VRAudioComponent');

var _VRAudioComponent2 = babelHelpers.interopRequireDefault(_VRAudioComponent);

var _VRAudioContext = require('../Audio/VRAudioContext');

var _VRAudioContext2 = babelHelpers.interopRequireDefault(_VRAudioContext);

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _MediaEvent = require('../Events/MediaEvent');

var _MediaEvent2 = babelHelpers.interopRequireDefault(_MediaEvent);

var MEDIA_EVENT_CALLBACK_NAME = {
  canplay: 'onAudioCanPlay',
  durationchange: 'onAudioDurationChange',
  ended: 'onAudioEnded',
  error: 'onAudioError',
  timeupdate: 'onAudioTimeUpdate',
  playing: 'onAudioPlaying',
  pause: 'onAudioPause'
};

var RCTAudioModule = function (_Module) {
  babelHelpers.inherits(RCTAudioModule, _Module);

  function RCTAudioModule(rnctx) {
    babelHelpers.classCallCheck(this, RCTAudioModule);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTAudioModule.__proto__ || Object.getPrototypeOf(RCTAudioModule)).call(this, 'RCTAudioModule'));

    _this.audioContext = _VRAudioContext2.default.supported() ? new _VRAudioContext2.default() : null;
    _this.supportedFormats = (0, _getSupportedFormats2.default)() || [];
    _this._audioDefs = {};
    _this._components = {};
    _this._rnctx = rnctx;
    _this._mediaEventCallbacks = {};
    return _this;
  }

  babelHelpers.createClass(RCTAudioModule, [{
    key: 'addHandle',
    value: function addHandle(handle) {
      var audioConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!this.audioContext) {
        return;
      }
      var component = new _VRAudioComponent2.default(this.audioContext, audioConfig);
      this._components[handle] = component;
      this._audioDefs[handle] = this._createAudioDef();
      this._mediaEventCallbacks[handle] = {};
      component.onMediaEvent = this._onMediaEvent.bind(this, handle);
    }
  }, {
    key: '_createAudioDef',
    value: function _createAudioDef() {
      return {
        streamingType: 'buffer'
      };
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
        console.warn('RCTAudioModule.addMediaEventListener: ' + ('can\'t add listener on a not exist handle: ' + handle));
        return;
      }

      if (!MEDIA_EVENT_CALLBACK_NAME[eventType]) {
        console.warn('RCTAudioModule.addMediaEventListener: ' + ('can\'t add listener on a not supported eventType: ' + eventType));
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
      this._audioDefs[handle].src = url;
    }
  }, {
    key: 'load',
    value: function load(handle) {
      this._components[handle].setAudio(this._audioDefs[handle]);
    }
  }, {
    key: 'play',
    value: function play(handle) {
      this._components[handle].play();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(handle, position) {
      this._components[handle].seekTo(position);
    }
  }, {
    key: 'pause',
    value: function pause(handle) {
      this._components[handle].pause();
    }
  }, {
    key: 'stop',
    value: function stop(handle) {
      this._components[handle].stop();
    }
  }, {
    key: 'unload',
    value: function unload(handle) {
      this._components[handle].dispose();
      delete this._components[handle];
      delete this._audioDefs[handle];
      delete this._mediaEventCallbacks[handle];
    }
  }, {
    key: 'setPosition',
    value: function setPosition(handle, position) {
      var vec = new THREE.Vector3();
      vec.fromArray(position);
      this._components[handle].position = vec;
    }
  }, {
    key: 'setVolume',
    value: function setVolume(handle, volume) {
      if (typeof volume !== 'number') {
        console.warn('AudioModule setVolume expected args (handle: string, volume: number)');
        return;
      }
      this._components[handle].volume = volume;
    }
  }, {
    key: 'setMuted',
    value: function setMuted(handle, muted) {
      this._components[handle].muted = muted;
    }
  }, {
    key: 'frame',
    value: function frame(camera) {
      if (this.audioContext) {
        this.audioContext.frame(camera);
      }
      for (var key in this._components) {
        this._components[key].frame();
      }
    }
  }]);
  return RCTAudioModule;
}(_Module3.default);

exports.default = RCTAudioModule;