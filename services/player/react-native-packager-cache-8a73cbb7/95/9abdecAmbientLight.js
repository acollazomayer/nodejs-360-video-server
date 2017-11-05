Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var RCTAmbientLight = function (_RCTBaseView) {
  babelHelpers.inherits(RCTAmbientLight, _RCTBaseView);

  function RCTAmbientLight(guiSys) {
    babelHelpers.classCallCheck(this, RCTAmbientLight);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTAmbientLight.__proto__ || Object.getPrototypeOf(RCTAmbientLight)).call(this));

    var light = new THREE.AmbientLight();
    _this.view = new OVRUI.UIView(guiSys);
    _this.view.add(light);

    Object.defineProperty(_this.props, 'intensity', {
      set: function set(value) {
        light.intensity = value;
      }
    });

    Object.defineProperty(_this.style, 'color', {
      set: function set(value) {
        light.color.set(value);
      }
    });

    _this.props.intensity = 1;
    return _this;
  }

  babelHelpers.createClass(RCTAmbientLight, null, [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTAmbientLight.__proto__ || Object.getPrototypeOf(RCTAmbientLight), 'describe', this).call(this), {
        NativeProps: {
          intensity: 'number'
        }
      });
    }
  }]);
  return RCTAmbientLight;
}(_BaseView2.default);

exports.default = RCTAmbientLight;