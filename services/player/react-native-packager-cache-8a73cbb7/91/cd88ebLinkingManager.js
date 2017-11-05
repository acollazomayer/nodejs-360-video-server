Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var initialURL = location.href;

var LinkingManager = function (_Module) {
  babelHelpers.inherits(LinkingManager, _Module);

  function LinkingManager(rnctx) {
    babelHelpers.classCallCheck(this, LinkingManager);

    var _this = babelHelpers.possibleConstructorReturn(this, (LinkingManager.__proto__ || Object.getPrototypeOf(LinkingManager)).call(this, 'LinkingManager'));

    _this._rnctx = rnctx;
    return _this;
  }

  babelHelpers.createClass(LinkingManager, [{
    key: '$openURL',
    value: function $openURL(url, success, fail) {
      window.location = new URL(url, window.location).toString();
      this._rnctx.invokeCallback(success, [true]);
    }
  }, {
    key: '$canOpenURL',
    value: function $canOpenURL(url, success, fail) {
      this._rnctx.invokeCallback(success, [true]);
    }
  }, {
    key: '$getInitialURL',
    value: function $getInitialURL(success, fail) {
      this._rnctx.invokeCallback(success, [initialURL]);
    }
  }]);
  return LinkingManager;
}(_Module3.default);

exports.default = LinkingManager;