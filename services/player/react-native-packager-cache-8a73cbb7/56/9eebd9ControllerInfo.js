Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var getGamepads = (navigator.getGamepads ? navigator.getGamepads : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : function () {
  return [];
}).bind(navigator);

function extractInfo(gamepad) {
  if (!gamepad) {
    return null;
  }

  return {
    index: gamepad.index,
    id: gamepad.id,
    buttons: gamepad.buttons.length,
    axes: gamepad.axes.length,
    hand: gamepad.hand || null
  };
}

var ControllerInfo = function (_Module) {
  babelHelpers.inherits(ControllerInfo, _Module);

  function ControllerInfo(rnctx) {
    babelHelpers.classCallCheck(this, ControllerInfo);

    var _this = babelHelpers.possibleConstructorReturn(this, (ControllerInfo.__proto__ || Object.getPrototypeOf(ControllerInfo)).call(this, 'ControllerInfo'));

    _this._rnctx = rnctx;

    window.addEventListener('gamepadconnected', function (e) {
      _this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['controllerConnected', extractInfo(e.gamepad)]);
    });

    window.addEventListener('gamepaddisconnected', function (e) {
      _this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['controllerDisconnected', extractInfo(e.gamepad)]);
    });
    return _this;
  }

  babelHelpers.createClass(ControllerInfo, [{
    key: '$getControllers',
    value: function $getControllers(success) {
      var controllers = [];
      var gamepads = getGamepads();
      for (var i = 0; i < gamepads.length; i++) {
        var gamepad = gamepads[i];
        if (gamepad) {
          controllers.push(extractInfo(gamepads[i]));
        }
      }
      this._rnctx.invokeCallback(success, [controllers]);
    }
  }]);
  return ControllerInfo;
}(_Module3.default);

exports.default = ControllerInfo;