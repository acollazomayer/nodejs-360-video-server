Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var ReactVRConstants = function (_Module) {
  babelHelpers.inherits(ReactVRConstants, _Module);

  function ReactVRConstants() {
    babelHelpers.classCallCheck(this, ReactVRConstants);

    var _this = babelHelpers.possibleConstructorReturn(this, (ReactVRConstants.__proto__ || Object.getPrototypeOf(ReactVRConstants)).call(this, 'ReactVRConstants'));

    _this.Version = '0.1.0';
    _this.Runtime = 'WebVR';
    _this.RuntimeVersion = _this.Version;
    _this.userAgent = navigator && navigator.userAgent;
    _this.platform = navigator && navigator.platform;
    return _this;
  }

  return ReactVRConstants;
}(_Module3.default);

exports.default = ReactVRConstants;