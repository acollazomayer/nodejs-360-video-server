Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Pano = require('./Pano');

var _Pano2 = babelHelpers.interopRequireDefault(_Pano);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _RCTVideoPlayer = require('../Utils/RCTVideoPlayer');

var _RCTVideoPlayer2 = babelHelpers.interopRequireDefault(_RCTVideoPlayer);

var COMMAND_SEEK_TO = 1;
var COMMAND_PLAY = 2;
var COMMAND_PAUSE = 3;

var RCTVideoPano = function (_RCTPano) {
  babelHelpers.inherits(RCTVideoPano, _RCTPano);

  function RCTVideoPano(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTVideoPano);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTVideoPano.__proto__ || Object.getPrototypeOf(RCTVideoPano)).call(this, guiSys, rnctx));

    _this._rnctx = rnctx;
    _this.player = new _RCTVideoPlayer2.default(rnctx, _this.view.uuid);
    _this.player.onUpdateTexture = function (source) {
      babelHelpers.get(RCTVideoPano.prototype.__proto__ || Object.getPrototypeOf(RCTVideoPano.prototype), 'setSource', _this).call(_this, source);
    };
    _this.player.onEmitEvent = function (eventType, args) {
      _this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), eventType, args]);
    };

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
    return _this;
  }

  babelHelpers.createClass(RCTVideoPano, [{
    key: 'receiveCommand',
    value: function receiveCommand(commandId, commandArgs) {
      babelHelpers.get(RCTVideoPano.prototype.__proto__ || Object.getPrototypeOf(RCTVideoPano.prototype), 'receiveCommand', this).call(this, commandId, commandArgs);
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
  }, {
    key: 'setSource',
    value: function setSource(value) {
      this.player.setSource(value);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.player.dispose();
      babelHelpers.get(RCTVideoPano.prototype.__proto__ || Object.getPrototypeOf(RCTVideoPano.prototype), 'dispose', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTVideoPano.__proto__ || Object.getPrototypeOf(RCTVideoPano), 'describe', this).call(this), {
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
  return RCTVideoPano;
}(_Pano2.default);

exports.default = RCTVideoPano;