Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var RCTView = function (_RCTBaseView) {
  babelHelpers.inherits(RCTView, _RCTBaseView);

  function RCTView(guiSys) {
    babelHelpers.classCallCheck(this, RCTView);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTView.__proto__ || Object.getPrototypeOf(RCTView)).call(this));

    _this.view = new OVRUI.UIView(guiSys);

    Object.defineProperty(_this.props, 'pointerEvents', {
      set: function set(value) {
        if (value === null) {
          value = 'auto';
        }
        _this.view.setPointerEvents(value);
      }
    });
    Object.defineProperty(_this.props, 'hitSlop', {
      set: function set(value) {
        if (value === null) {
          value = 0;
        }
        if (typeof value === 'number') {
          _this.view.setHitSlop(value, value, value, value);
        } else {
          _this.view.setHitSlop(value.left, value.top, value.right, value.bottom);
        }
      }
    });
    Object.defineProperty(_this.props, 'cursorVisibilitySlop', {
      set: function set(value) {
        if (value === null) {
          value = 0;
        }
        if (typeof value === 'number') {
          _this.view.setCursorVisibilitySlop(value, value, value, value);
        } else {
          _this.view.setCursorVisibilitySlop(value.left, value.top, value.right, value.bottom);
        }
      }
    });
    Object.defineProperty(_this.props, 'billboarding', {
      set: function set(value) {
        if (value === null) {
          value = 'off';
        }
        _this.view.setBillboarding(value);
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTView, [{
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTView.prototype.__proto__ || Object.getPrototypeOf(RCTView.prototype), 'presentLayout', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTView.__proto__ || Object.getPrototypeOf(RCTView), 'describe', this).call(this), {
        NativeProps: {
          pointerEvents: 'string',
          hitSlop: 'number',
          cursorVisibilitySlop: 'number',
          billboarding: 'string'
        }
      });
    }
  }]);
  return RCTView;
}(_BaseView2.default);

exports.default = RCTView;