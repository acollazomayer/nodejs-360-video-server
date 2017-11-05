Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTRawText = function (_RCTBaseView) {
  babelHelpers.inherits(RCTRawText, _RCTBaseView);

  function RCTRawText(guiSys) {
    babelHelpers.classCallCheck(this, RCTRawText);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTRawText.__proto__ || Object.getPrototypeOf(RCTRawText)).call(this));

    _this.isRawText = true;
    Object.defineProperty(_this.props, 'text', {
      set: function set(value) {
        _this._text = value || '';
        _this._textDirty = true;
        _this.markTextDirty();
      },
      get: function get() {
        return _this._text;
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTRawText, [{
    key: 'markTextDirty',
    value: function markTextDirty() {
      var cur = this.getParent();
      while (cur) {
        cur.isDirty = true;
        cur.markTextDirty && cur.markTextDirty();
        cur = cur.getParent();
      }
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTRawText.__proto__ || Object.getPrototypeOf(RCTRawText), 'describe', this).call(this), {
        NativeProps: {
          text: 'string'
        }
      });
    }
  }]);
  return RCTRawText;
}(_BaseView2.default);

exports.default = RCTRawText;