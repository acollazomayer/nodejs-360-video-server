Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMesh = require('./BaseMesh');

var _BaseMesh2 = babelHelpers.interopRequireDefault(_BaseMesh);

var _three = require('three');

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTBox = function (_RCTBaseMesh) {
  babelHelpers.inherits(RCTBox, _RCTBaseMesh);

  function RCTBox(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTBox);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTBox.__proto__ || Object.getPrototypeOf(RCTBox)).call(this, guiSys, rnctx));

    _this._dimWidth = 1;
    _this._dimHeight = 1;
    _this._dimDepth = 1;
    _this._needsUpdate = false;

    Object.defineProperty(_this.props, 'dimWidth', {
      set: function set(width) {
        _this._dimWidth = width;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'dimHeight', {
      set: function set(height) {
        _this._dimHeight = height;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'dimDepth', {
      set: function set(depth) {
        _this._dimDepth = depth;
        _this._needsUpdate = true;
      }
    });

    _this._generateGeometry = _this._generateGeometry.bind(_this);
    return _this;
  }

  babelHelpers.createClass(RCTBox, [{
    key: 'frame',
    value: function frame() {
      if (this._needsUpdate) {
        this._needsUpdate = false;
        this._generateGeometry();
      }
    }
  }, {
    key: '_generateGeometry',
    value: function _generateGeometry() {
      var geometry = new _three.BoxBufferGeometry(this._dimWidth, this._dimHeight, this._dimDepth);
      this._setGeometry(geometry);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTBox.__proto__ || Object.getPrototypeOf(RCTBox), 'describe', this).call(this), {
        NativeProps: {
          dimWidth: 'number',
          dimHeight: 'number',
          dimDepth: 'number'
        }
      });
    }
  }]);
  return RCTBox;
}(_BaseMesh2.default);

exports.default = RCTBox;