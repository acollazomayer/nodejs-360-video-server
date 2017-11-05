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

var RCTPointLight = function (_RCTBaseView) {
  babelHelpers.inherits(RCTPointLight, _RCTBaseView);

  function RCTPointLight(guiSys) {
    babelHelpers.classCallCheck(this, RCTPointLight);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTPointLight.__proto__ || Object.getPrototypeOf(RCTPointLight)).call(this));

    var light = new THREE.PointLight();
    _this.view = new OVRUI.UIView(guiSys);
    _this.view.add(light);

    Object.defineProperty(_this.props, 'intensity', {
      set: function set(value) {
        light.intensity = value;
      }
    });

    Object.defineProperty(_this.props, 'distance', {
      set: function set(value) {
        light.distance = value;
      }
    });

    Object.defineProperty(_this.props, 'decay', {
      set: function set(value) {
        light.decay = value;
      }
    });

    Object.defineProperty(_this.style, 'color', {
      set: function set(value) {
        light.color.set(value);
      }
    });

    _this.props.intensity = 1;
    _this.props.distance = 0;
    _this.props.decay = 1;
    return _this;
  }

  babelHelpers.createClass(RCTPointLight, null, [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTPointLight.__proto__ || Object.getPrototypeOf(RCTPointLight), 'describe', this).call(this), {
        NativeProps: {
          intensity: 'number',
          distance: 'number',
          decay: 'number'
        }
      });
    }
  }]);
  return RCTPointLight;
}(_BaseView2.default);

exports.default = RCTPointLight;