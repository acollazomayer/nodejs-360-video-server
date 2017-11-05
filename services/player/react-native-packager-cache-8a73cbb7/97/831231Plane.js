Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMesh = require('./BaseMesh');

var _BaseMesh2 = babelHelpers.interopRequireDefault(_BaseMesh);

var _three = require('three');

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTPlane = function (_RCTBaseMesh) {
  babelHelpers.inherits(RCTPlane, _RCTBaseMesh);

  function RCTPlane(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTPlane);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTPlane.__proto__ || Object.getPrototypeOf(RCTPlane)).call(this, guiSys, rnctx));

    _this._dimWidth = 1;
    _this._dimHeight = 1;
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

    _this._generateGeometry = _this._generateGeometry.bind(_this);
    return _this;
  }

  babelHelpers.createClass(RCTPlane, [{
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
      var geometry = new _three.PlaneBufferGeometry(this._dimWidth, this._dimHeight);
      this._setGeometry(geometry);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTPlane.__proto__ || Object.getPrototypeOf(RCTPlane), 'describe', this).call(this), {
        NativeProps: {
          dimWidth: 'number',
          dimHeight: 'number'
        }
      });
    }
  }]);
  return RCTPlane;
}(_BaseMesh2.default);

exports.default = RCTPlane;