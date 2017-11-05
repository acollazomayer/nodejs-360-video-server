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

var RCTSpotLight = function (_RCTBaseView) {
  babelHelpers.inherits(RCTSpotLight, _RCTBaseView);

  function RCTSpotLight(guiSys) {
    babelHelpers.classCallCheck(this, RCTSpotLight);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTSpotLight.__proto__ || Object.getPrototypeOf(RCTSpotLight)).call(this));

    var light = new THREE.SpotLight();
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

    Object.defineProperty(_this.props, 'angle', {
      set: function set(value) {
        light.angle = value * Math.PI / 180;
      }
    });

    Object.defineProperty(_this.props, 'penumbra', {
      set: function set(value) {
        light.penumbra = Math.min(Math.max(value, 0), 100) / 100.0;
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
    _this.props.angle = 180;
    _this.props.penumbra = 0;
    return _this;
  }

  babelHelpers.createClass(RCTSpotLight, null, [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTSpotLight.__proto__ || Object.getPrototypeOf(RCTSpotLight), 'describe', this).call(this), {
        NativeProps: {
          intensity: 'number',
          distance: 'number',
          decay: 'number',
          angle: 'number',
          penumbra: 'number'
        }
      });
    }
  }]);
  return RCTSpotLight;
}(_BaseView2.default);

exports.default = RCTSpotLight;