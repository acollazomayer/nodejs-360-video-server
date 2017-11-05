Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _RCTVideoPlayer = require('../Utils/RCTVideoPlayer');

var _RCTVideoPlayer2 = babelHelpers.interopRequireDefault(_RCTVideoPlayer);

var _RCTBindedResource = require('../Utils/RCTBindedResource');

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


var COMMAND_SEEK_TO = 1;
var COMMAND_PLAY = 2;
var COMMAND_PAUSE = 3;

var RCTVideo = function (_RCTBaseView) {
  babelHelpers.inherits(RCTVideo, _RCTBaseView);

  function RCTVideo(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTVideo);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTVideo.__proto__ || Object.getPrototypeOf(RCTVideo)).call(this));

    _this.view = new OVRUI.UIView(guiSys);
    _this._localResource = new _RCTBindedResource.RCTBindedResource(rnctx.RCTResourceManager);
    _this._videoModule = rnctx.VideoModule;
    _this._rnctx = rnctx;
    _this.player = new _RCTVideoPlayer2.default(rnctx, _this.view.uuid);
    _this.player.onUpdateTexture = function (source) {
      var loadRemoteTexture = function loadRemoteTexture(url, onLoad) {
        var onError = function onError() {
          return onLoad(undefined);
        };

        var onProgress = undefined;
        if (url == null) {
          onError();
        } else {
          var loader = new THREE.TextureLoader();
          loader.setCrossOrigin('Access-Control-Allow-Origin');
          loader.load(url, onLoad, onProgress, onError);
        }
      };

      var onLoadOrChange = function onLoadOrChange(texture) {
        if (source !== _this._currentSource) {
          return;
        }
        if (texture && texture.type === 'MonoTextureInfo') {
          _this.view.setImageTexture(texture.texture);
        } else if (texture) {
          _this.view.setImageTexture(texture);
        } else {
          _this.view.setImageTexture(undefined);
        }
      };

      _this._currentSource = source;
      if (source && source.uri) {
        if (_this._localResource.isValidUrl(source.uri)) {
          _this._localResource.load(source.uri, onLoadOrChange);
        } else {
          loadRemoteTexture(source.uri, onLoadOrChange);
        }
      } else {
        _this._localResource.unregister();
        onLoadOrChange(undefined);
      }
    };
    _this.player.onEmitEvent = function (eventType, args) {
      _this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), eventType, args]);
    };

    Object.defineProperty(_this.props, 'source', {
      set: function set(value) {
        _this.player.setSource(value);
      }
    });

    Object.defineProperty(_this.props, 'poster', {
      set: function set(value) {
        var url = value ? value.uri : null;
        if (url) {
          _this.player.setPoster(value);
        } else {
          _this.player.setPoster(null);
        }
      }
    });

    Object.defineProperty(_this.props, 'playControl', {
      set: function set(value) {
        _this.player.setPlayControl(value);
      }
    });

    Object.defineProperty(_this.props, 'autoPlay', {
      set: function set(value) {
        _this.player.setAutoPlay(value);
      }
    });

    Object.defineProperty(_this.props, 'loop', {
      set: function set(value) {
        _this.player.setLoop(value);
      }
    });

    Object.defineProperty(_this.props, 'muted', {
      set: function set(value) {
        _this.player.setMuted(value);
      }
    });

    Object.defineProperty(_this.props, 'volume', {
      set: function set(value) {
        _this.player.setVolume(value);
      }
    });

    Object.defineProperty(_this.style, 'tintColor', {
      set: function set(value) {
        _this.view.setImageColor(value);
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTVideo, [{
    key: 'dispose',
    value: function dispose() {
      if (this._localResource) {
        this._localResource.dispose();
      }
      this.player.dispose();
      babelHelpers.get(RCTVideo.prototype.__proto__ || Object.getPrototypeOf(RCTVideo.prototype), 'dispose', this).call(this);
    }
  }, {
    key: 'receiveCommand',
    value: function receiveCommand(commandId, commandArgs) {
      babelHelpers.get(RCTVideo.prototype.__proto__ || Object.getPrototypeOf(RCTVideo.prototype), 'receiveCommand', this).call(this, commandId, commandArgs);
      switch (commandId) {
        case COMMAND_SEEK_TO:
          var position = commandArgs ? commandArgs[0] : 0;
          this.player.seekTo(position);
          break;
        case COMMAND_PLAY:
          this.player.play();
          break;
        case COMMAND_PAUSE:
          this.player.pause();
          break;
      }
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTVideo.__proto__ || Object.getPrototypeOf(RCTVideo), 'describe', this).call(this), {
        NativeProps: {
          autoPlay: 'boolean',
          loop: 'boolean',
          muted: 'boolean',
          playControl: 'string',
          volume: 'number',
          source: 'object',
          poster: 'object'
        },
        Commands: {
          seekTo: COMMAND_SEEK_TO,
          play: COMMAND_PLAY,
          pause: COMMAND_PAUSE
        }
      });
    }
  }]);
  return RCTVideo;
}(_BaseView2.default);

exports.default = RCTVideo;