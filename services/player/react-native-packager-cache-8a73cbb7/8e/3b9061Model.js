Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseMesh = require('./BaseMesh');

var _BaseMesh2 = babelHelpers.interopRequireDefault(_BaseMesh);

var _ModelLoaderRegistry = require('../Loaders/ModelLoaderRegistry');

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var RCTModel = function (_RCTBaseMesh) {
  babelHelpers.inherits(RCTModel, _RCTBaseMesh);

  function RCTModel(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTModel);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTModel.__proto__ || Object.getPrototypeOf(RCTModel)).call(this, guiSys, rnctx));

    _this.instance = null;

    Object.defineProperty(_this.props, 'source', {
      set: _this._setSource.bind(_this)
    });
    return _this;
  }

  babelHelpers.createClass(RCTModel, [{
    key: '_setSource',
    value: function _setSource(value) {
      if (this.instance) {
        if (this.instance.update(value)) {
          return;
        } else {
          this.instance && this.instance.dispose();
        }
      }
      this.instance = (0, _ModelLoaderRegistry.createModelInstance)(value, this.view, this._litMaterial, this._unlitMaterial);
      this.instance && this.instance.setLit(this._lit);
    }
  }, {
    key: '_setLit',
    value: function _setLit(flag) {
      this._lit = flag;

      if (!this.instance) {
        return;
      }
      this.instance.setLit(flag);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.instance) {
        this.instance.dispose();
      }
      this.instance = null;
      babelHelpers.get(RCTModel.prototype.__proto__ || Object.getPrototypeOf(RCTModel.prototype), 'dispose', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTModel.__proto__ || Object.getPrototypeOf(RCTModel), 'describe', this).call(this), {
        NativeProps: {
          source: 'object'
        }
      });
    }
  }]);
  return RCTModel;
}(_BaseMesh2.default);

exports.default = RCTModel;