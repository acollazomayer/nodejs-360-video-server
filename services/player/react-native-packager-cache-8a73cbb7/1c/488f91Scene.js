Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var RCTScene = function (_RCTBaseView) {
  babelHelpers.inherits(RCTScene, _RCTBaseView);

  function RCTScene(guiSys) {
    babelHelpers.classCallCheck(this, RCTScene);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTScene.__proto__ || Object.getPrototypeOf(RCTScene)).call(this));

    _this.view = new OVRUI.UIView(guiSys);
    return _this;
  }

  babelHelpers.createClass(RCTScene, [{
    key: 'presentLayout',
    value: function presentLayout() {}
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTScene.__proto__ || Object.getPrototypeOf(RCTScene), 'describe', this).call(this), {});
    }
  }]);
  return RCTScene;
}(_BaseView2.default);

exports.default = RCTScene;