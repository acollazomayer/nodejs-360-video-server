Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var RCTImage = function (_RCTBaseView) {
  babelHelpers.inherits(RCTImage, _RCTBaseView);

  function RCTImage(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTImage);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTImage.__proto__ || Object.getPrototypeOf(RCTImage)).call(this));

    _this.view = new OVRUI.UIView(guiSys);
    _this._rnctx = rnctx;

    Object.defineProperty(_this.props, 'source', {
      set: function set(value) {
        _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoadStart', []]);

        if (value.uri.indexOf('texture://') === 0) {
          _this._rnctx.TextureManager.getTextureForURL(value.uri).then(function (tex) {
            _this.view.setImageTexture(tex);
            var image = tex.image;
            var width = void 0;
            var height = void 0;
            if (image instanceof Image) {
              width = image.naturalWidth;
              height = image.naturalHeight;
            } else {
              width = image.width || 0;
              height = image.height || 0;
            }
            _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoad', {
              url: value.uri,
              source: value,
              width: width,
              height: height
            }]);

            _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoadEnd', []]);
          }).catch(function () {
            _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoadEnd', []]);
          });
        } else {
          _this.view.setImage(value.uri, function (loaded, width, height) {
            if (loaded) {
              _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoad', {
                url: value.uri,
                source: value,
                width: width,
                height: height
              }]);
            }

            _this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this.getTag(), 'topLoadEnd', []]);
          });
        }
      }
    });
    Object.defineProperty(_this.props, 'resizeMode', {
      set: function set(value) {
        if (value === null) {
          value = 'stretch';
        }
        _this.view.setResizeMode(value);
      }
    });
    Object.defineProperty(_this.props, 'inset', {
      set: function set(value) {
        _this.view.setInset(value);
      }
    });
    Object.defineProperty(_this.props, 'insetSize', {
      set: function set(value) {
        _this.view.setInsetSize(value);
      }
    });
    Object.defineProperty(_this.props, 'crop', {
      set: function set(value) {
        _this.view.setTextureCrop(value);
      }
    });
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
    _this.props.inset = [0.0, 0.0, 0.0, 0.0];
    _this.props.insetSize = [0.0, 0.0, 0.0, 0.0];

    Object.defineProperty(_this.style, 'tintColor', {
      set: function set(value) {
        if (value === null) {
          value = 0xffffffff;
        }
        _this.view.setImageColor(value);
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTImage, [{
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTImage.prototype.__proto__ || Object.getPrototypeOf(RCTImage.prototype), 'presentLayout', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTImage.__proto__ || Object.getPrototypeOf(RCTImage), 'describe', this).call(this), {
        NativeProps: {
          source: 'string',
          resizeMode: 'string',
          inset: 'number',
          insetSize: 'number',
          crop: 'number',
          pointerEvents: 'string',
          hitSlop: 'number'
        }
      });
    }
  }]);
  return RCTImage;
}(_BaseView2.default);

exports.default = RCTImage;