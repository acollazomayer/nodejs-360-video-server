Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var History = function (_Module) {
  babelHelpers.inherits(History, _Module);

  function History(rnctx) {
    babelHelpers.classCallCheck(this, History);

    var _this = babelHelpers.possibleConstructorReturn(this, (History.__proto__ || Object.getPrototypeOf(History)).call(this, 'History'));

    _this._rnctx = rnctx;

    window.addEventListener('popstate', function (event) {
      _this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['historyPopState', { state: event.state }]);
      _this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['url', window.location.toString()]);
    });
    return _this;
  }

  babelHelpers.createClass(History, [{
    key: '$length',
    value: function $length(success) {
      this._rnctx.invokeCallback(success, [window.history.length]);
    }
  }, {
    key: '$state',
    value: function $state(success) {
      this._rnctx.invokeCallback(success, [window.history.state]);
    }
  }, {
    key: '$back',
    value: function $back(success) {
      window.history.back();
      this._rnctx.invokeCallback(success, [true]);
    }
  }, {
    key: '$forward',
    value: function $forward(success) {
      window.history.forward();
      this._rnctx.invokeCallback(success, [true]);
    }
  }, {
    key: '$go',
    value: function $go(delta, success) {
      window.history.go(delta);
      this._rnctx.invokeCallback(success, [true]);
    }
  }, {
    key: '$pushState',
    value: function $pushState() {
      var _ref2, _ref3;

      if (arguments.length < 4) {
        var _ref;

        this._rnctx.invokeCallback((_ref = arguments.length - 1, arguments.length <= _ref ? undefined : arguments[_ref]), [new Error('pushState requires at least two arguments')]);
        return;
      }
      var state = arguments.length <= 0 ? undefined : arguments[0];
      var title = arguments.length <= 1 ? undefined : arguments[1];
      var success = (_ref2 = arguments.length - 2, arguments.length <= _ref2 ? undefined : arguments[_ref2]);
      var fail = (_ref3 = arguments.length - 1, arguments.length <= _ref3 ? undefined : arguments[_ref3]);
      var url = arguments.length === 4 ? undefined : arguments.length <= 2 ? undefined : arguments[2];
      try {
        window.history.pushState(state, title, url);
        this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['url', window.location.toString()]);
        this._rnctx.invokeCallback(success, [true]);
      } catch (e) {
        this._rnctx.invokeCallback(fail, [e]);
      }
    }
  }, {
    key: '$replaceState',
    value: function $replaceState() {
      var _ref5, _ref6;

      if (arguments.length < 4) {
        var _ref4;

        this._rnctx.invokeCallback((_ref4 = arguments.length - 1, arguments.length <= _ref4 ? undefined : arguments[_ref4]), [new Error('replaceState requires at least two arguments')]);
        return;
      }
      var state = arguments.length <= 0 ? undefined : arguments[0];
      var title = arguments.length <= 1 ? undefined : arguments[1];
      var success = (_ref5 = arguments.length - 2, arguments.length <= _ref5 ? undefined : arguments[_ref5]);
      var fail = (_ref6 = arguments.length - 1, arguments.length <= _ref6 ? undefined : arguments[_ref6]);
      var url = arguments.length === 4 ? undefined : arguments.length <= 2 ? undefined : arguments[2];
      try {
        window.history.pushState(state, title, url);
        this._rnctx.invokeCallback(success, [true]);
      } catch (e) {
        this._rnctx.invokeCallback(fail, [e]);
      }
    }
  }]);
  return History;
}(_Module3.default);

exports.default = History;