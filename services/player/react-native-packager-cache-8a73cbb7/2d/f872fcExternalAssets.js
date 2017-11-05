Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var ExternalAssets = function (_Module) {
  babelHelpers.inherits(ExternalAssets, _Module);

  function ExternalAssets(assetRoot) {
    babelHelpers.classCallCheck(this, ExternalAssets);

    var _this = babelHelpers.possibleConstructorReturn(this, (ExternalAssets.__proto__ || Object.getPrototypeOf(ExternalAssets)).call(this, 'ExternalAssets'));

    _this.assetRoot = assetRoot;
    return _this;
  }

  return ExternalAssets;
}(_Module3.default);

exports.default = ExternalAssets;