Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _extractURL = require('../Utils/extractURL');

var _extractURL2 = babelHelpers.interopRequireDefault(_extractURL);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _getSupportedFormats = require('../Audio/getSupportedFormats');

var _getSupportedFormats2 = babelHelpers.interopRequireDefault(_getSupportedFormats);

var COMMAND_SEEK_TO = 1;
var COMMAND_PLAY = 2;
var COMMAND_PAUSE = 3;

var RCTSound = function (_RCTBaseView) {
  babelHelpers.inherits(RCTSound, _RCTBaseView);

  function RCTSound(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTSound);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTSound.__proto__ || Object.getPrototypeOf(RCTSound)).call(this));

    _this.view = new OVRUI.UIView(guiSys);
    _this._rnctx = rnctx;
    _this._audioModule = rnctx.AudioModule;
    _this._counter = 0;
    _this._handle = null;
    _this._playStatus = 'closed';
    _this._onCanPlay = _this._onCanPlay.bind(_this);
    _this._onPlaying = _this._onPlaying.bind(_this);
    _this._onPause = _this._onPause.bind(_this);
    _this._onEnded = _this._onEnded.bind(_this);
    _this._onError = _this._onError.bind(_this);
    _this._onDurationChange = _this._onDurationChange.bind(_this);
    _this._onTimeUpdate = _this._onTimeUpdate.bind(_this);

    Object.defineProperty(_this.props, 'autoPlay', {
      set: function set(value) {
        _this.props._autoPlay = value;
      }
    });

    Object.defineProperty(_this.props, 'volume', {
      set: function set(value) {
        if (value < 0) {
          if (__DEV__) {
            console.warn('<Sound> volume cannot be negative:', value);
          }
          return;
        }
        _this.props._volume = value;
        if (_this._handle) {
          _this._audioModule.setVolume(_this._handle, _this.props._volume);
        }
      }
    });

    Object.defineProperty(_this.props, 'muted', {
      set: function set(value) {
        _this.props._muted = value;
        if (_this._handle) {
          _this._audioModule.setMuted(_this._handle, _this.props._muted);
        }
      }
    });

    Object.defineProperty(_this.props, 'loop', {
      set: function set(value) {
        _this.props._loop = value;
      }
    });

    Object.defineProperty(_this.props, 'playControl', {
      set: function set(value) {
        _this.props._playControl = value;

        if (!_this._handle) {
          return;
        }

        if (_this.props._playControl === 'stop') {
          _this._audioModule.stop(_this._handle);
        } else if (_this.props._playControl === 'pause') {
          _this._audioModule.pause(_this._handle);
        } else if (_this.props._playControl === 'play') {
          _this._audioModule.play(_this._handle);
        }
      }
    });

    Object.defineProperty(_this.props, 'source', {
      set: function set(value) {
        var url = null;
        if (value && typeof value === 'object' && !('uri' in value)) {
          var format = null;
          for (var key in value) {
            if ((0, _getSupportedFormats2.default)().indexOf(key) > -1) {
              format = key;
              url = (0, _extractURL2.default)(value[key]);
              break;
            }
          }

          if (!format) {
            if (__DEV__) {
              console.warn('No supported audio format found in <Sound> source');
            }
            return;
          }
          if (!url) {
            if (__DEV__) {
              console.warn('<Sound> source format values must be in the form {uri: "..."}');
            }
            return;
          }
        } else if (value) {
          url = (0, _extractURL2.default)(value);
          if (!url) {
            if (__DEV__) {
              console.warn('<Sound> source must be in format {uri: "..."}');
            }
            return;
          }
        }
        _this.props._source = value;

        if (!_this.props._source) {
          var _prevHandle = _this._handle;
          _this._handle = null;
          if (_prevHandle) {
            _this._audioModule.unload(_prevHandle);
          }
          _this._updatePlayStatus('closed');
          return;
        }

        var prevHandle = _this._handle;
        _this._counter += 1;
        _this._handle = [url, _this.view.uuid, _this._counter].join('-');
        _this._audioModule.addHandle(_this._handle);
        _this._audioModule.setUrl(_this._handle, url);

        if (_this.props._volume) {
          _this._audioModule.setVolume(_this._handle, _this.props._volume);
        }
        if (_this.props._muted) {
          _this._audioModule.setMuted(_this._handle, _this.props._muted);
        }

        if (prevHandle) {
          _this._audioModule.unload(prevHandle);
        }

        _this._audioModule._addMediaEventListener(_this._handle, 'canplay', _this._onCanPlay);
        _this._audioModule._addMediaEventListener(_this._handle, 'ended', _this._onEnded);
        _this._audioModule._addMediaEventListener(_this._handle, 'playing', _this._onPlaying);
        _this._audioModule._addMediaEventListener(_this._handle, 'pause', _this._onPause);
        _this._audioModule._addMediaEventListener(_this._handle, 'error', _this._onError);
        _this._audioModule._addMediaEventListener(_this._handle, 'durationchange', _this._onDurationChange);
        _this._audioModule._addMediaEventListener(_this._handle, 'timeupdate', _this._onTimeUpdate);
        _this._audioModule.load(_this._handle);
        _this._updatePlayStatus('loading');
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTSound, [{
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTSound.prototype.__proto__ || Object.getPrototypeOf(RCTSound.prototype), 'presentLayout', this).call(this, this);

      if (this._handle) {
        var position = this.view.getWorldPosition().toArray();
        this._audioModule.setPosition(this._handle, position);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._handle) {
        this._audioModule.unload(this._handle);
      }
      babelHelpers.get(RCTSound.prototype.__proto__ || Object.getPrototypeOf(RCTSound.prototype), 'dispose', this).call(this);
    }
  }, {
    key: 'receiveCommand',
    value: function receiveCommand(commandId, commandArgs) {
      babelHelpers.get(RCTSound.prototype.__proto__ || Object.getPrototypeOf(RCTSound.prototype), 'receiveCommand', this).call(this, commandId, commandArgs);
      switch (commandId) {
        case COMMAND_SEEK_TO:
          if (this._handle) {
            var position = commandArgs ? commandArgs[0] : 0;
            this._audioModule.seekTo(this._handle, position);
          }
          break;
        case COMMAND_PLAY:
          if (this._handle) {
            this._audioModule.play(this._handle);
          }
          break;
        case COMMAND_PAUSE:
          if (this._handle) {
            this._audioModule.pause(this._handle);
          }
          break;
      }
    }
  }, {
    key: '_onCanPlay',
    value: function _onCanPlay(handle) {
      if (handle !== this._handle) {
        return;
      }
      this._updatePlayStatus('ready');

      var status = this.props._playControl;
      if (this.props._autoPlay && status !== 'stop' || status === 'play') {
        this._audioModule.play(handle);
      }
    }
  }, {
    key: '_onEnded',
    value: function _onEnded(handle) {
      if (handle !== this._handle) {
        return;
      }
      this._updatePlayStatus('ended');

      if (this.props._loop && this.props._playControl !== 'stop') {
        this._audioModule.play(handle);
      }

      this._emitEvent('topEnded', []);
    }
  }, {
    key: '_onPlaying',
    value: function _onPlaying(handle) {
      if (handle !== this._handle) {
        return;
      }
      this._updatePlayStatus('playing');
    }
  }, {
    key: '_onPause',
    value: function _onPause(handle) {
      if (handle !== this._handle) {
        return;
      }
      this._updatePlayStatus('paused');
    }
  }, {
    key: '_onError',
    value: function _onError(handle, event) {
      if (handle !== this._handle) {
        return;
      }
      this._updatePlayStatus('error');
    }
  }, {
    key: '_onDurationChange',
    value: function _onDurationChange(handle, event) {
      if (handle !== this._handle) {
        return;
      }
      var duration = event.target && event.target.duration;
      if (duration) {
        this._emitEvent('topDurationChange', { duration: duration });
      }
    }
  }, {
    key: '_onTimeUpdate',
    value: function _onTimeUpdate(handle, event) {
      if (handle !== this._handle) {
        return;
      }
      var currentTime = event.target && event.target.currentTime;
      if (currentTime) {
        this._emitEvent('topTimeUpdate', { currentTime: currentTime });
      }
    }
  }, {
    key: '_emitEvent',
    value: function _emitEvent(eventType, args) {
      this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [this.getTag(), eventType, args]);
    }
  }, {
    key: '_updatePlayStatus',
    value: function _updatePlayStatus(status) {
      if (this._playStatus !== status) {
        this._playStatus = status;
        this._emitEvent('topPlayStatusChange', { playStatus: this._playStatus });
      }
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTSound.__proto__ || Object.getPrototypeOf(RCTSound), 'describe', this).call(this), {
        NativeProps: {
          autoPlay: 'boolean',
          volume: 'number',
          loop: 'boolean',
          muted: 'boolean',
          playControl: 'string',
          source: 'object'
        },
        Commands: {
          seekTo: COMMAND_SEEK_TO,
          play: COMMAND_PLAY,
          pause: COMMAND_PAUSE
        }
      });
    }
  }]);
  return RCTSound;
}(_BaseView2.default);

exports.default = RCTSound;