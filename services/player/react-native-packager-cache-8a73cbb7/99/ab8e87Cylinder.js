Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMesh = require('./BaseMesh');

var _BaseMesh2 = babelHelpers.interopRequireDefault(_BaseMesh);

var _three = require('three');

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTCylinder = function (_RCTBaseMesh) {
  babelHelpers.inherits(RCTCylinder, _RCTBaseMesh);

  function RCTCylinder(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTCylinder);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTCylinder.__proto__ || Object.getPrototypeOf(RCTCylinder)).call(this, guiSys, rnctx));

    _this._radiusTop = 0.5;
    _this._radiusBottom = 0.5;
    _this._dimHeight = 1;
    _this._segments = 8;
    _this._needsUpdate = false;

    Object.defineProperty(_this.props, 'radiusTop', {
      set: function set(radiusTop) {
        _this._radiusTop = radiusTop;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'radiusBottom', {
      set: function set(radiusBottom) {
        _this._radiusBottom = radiusBottom;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'dimHeight', {
      set: function set(height) {
        _this._dimHeight = height;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'segments', {
      set: function set(segments) {
        _this._segments = segments;
        _this._needsUpdate = true;
      }
    });

    _this._generateGeometry = _this._generateGeometry.bind(_this);
    return _this;
  }

  babelHelpers.createClass(RCTCylinder, [{
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
      var geometry = new _three.CylinderBufferGeometry(this._radiusTop, this._radiusBottom, this._dimHeight, this._segments);
      this._setGeometry(geometry);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTCylinder.__proto__ || Object.getPrototypeOf(RCTCylinder), 'describe', this).call(this), {
        NativeProps: {
          radiusTop: 'number',
          radiusBottom: 'number',
          dimHeight: 'number',
          segments: 'number'
        }
      });
    }
  }]);
  return RCTCylinder;
}(_BaseMesh2.default);

exports.default = RCTCylinder;