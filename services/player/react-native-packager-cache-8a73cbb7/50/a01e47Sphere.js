Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMesh = require('./BaseMesh');

var _BaseMesh2 = babelHelpers.interopRequireDefault(_BaseMesh);

var _three = require('three');

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTSphere = function (_RCTBaseMesh) {
  babelHelpers.inherits(RCTSphere, _RCTBaseMesh);

  function RCTSphere(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTSphere);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTSphere.__proto__ || Object.getPrototypeOf(RCTSphere)).call(this, guiSys, rnctx));

    _this._radius = 0.5;
    _this._heightSegments = 6;
    _this._widthSegments = 8;
    _this._needsUpdate = false;

    Object.defineProperty(_this.props, 'radius', {
      set: function set(radius) {
        _this._radius = radius;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'heightSegments', {
      set: function set(segments) {
        _this._heightSegments = segments;
        _this._needsUpdate = true;
      }
    });

    Object.defineProperty(_this.props, 'widthSegments', {
      set: function set(segments) {
        _this._widthSegments = segments;
        _this._needsUpdate = true;
      }
    });

    _this._generateGeometry = _this._generateGeometry.bind(_this);
    return _this;
  }

  babelHelpers.createClass(RCTSphere, [{
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
      var geometry = new _three.SphereBufferGeometry(this._radius, this._widthSegments, this._heightSegments);
      this._setGeometry(geometry);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTSphere.__proto__ || Object.getPrototypeOf(RCTSphere), 'describe', this).call(this), {
        NativeProps: {
          radius: 'number',
          widthSegments: 'number',
          heightSegments: 'number'
        }
      });
    }
  }]);
  return RCTSphere;
}(_BaseMesh2.default);

exports.default = RCTSphere;