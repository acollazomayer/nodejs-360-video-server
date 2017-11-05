Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var RCTSourceCode = function (_Module) {
  babelHelpers.inherits(RCTSourceCode, _Module);

  function RCTSourceCode(rnctx) {
    babelHelpers.classCallCheck(this, RCTSourceCode);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTSourceCode.__proto__ || Object.getPrototypeOf(RCTSourceCode)).call(this, 'RCTSourceCode'));

    _this._rnctx = rnctx;

    _this.scriptURL = location.protocol + '//' + location.host;

    var match = location.pathname && location.pathname.match(/^.*\//);
    var path = match ? match[0] : null;
    _this.scriptURL += path ? path : '/';
    return _this;
  }

  babelHelpers.createClass(RCTSourceCode, [{
    key: 'getScriptText',
    value: function getScriptText(resolve, reject) {
      this._rnctx.invokeCallback(resolve, [{ fullSourceMappingURL: location.protocol + '//' + location.host + '/' }]);
    }
  }]);
  return RCTSourceCode;
}(_Module3.default);

exports.default = RCTSourceCode;