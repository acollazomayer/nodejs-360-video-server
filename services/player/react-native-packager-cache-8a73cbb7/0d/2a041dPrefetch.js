Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var RCTPrefetch = function (_RCTBaseView) {
  babelHelpers.inherits(RCTPrefetch, _RCTBaseView);

  function RCTPrefetch(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTPrefetch);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTPrefetch.__proto__ || Object.getPrototypeOf(RCTPrefetch)).call(this));

    _this.view = new OVRUI.UIView(guiSys);

    Object.defineProperty(_this.props, 'source', {
      set: function set(value) {
        if (Array.isArray(value)) {} else {
          _this.prefetch(value.uri);
        }
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTPrefetch, [{
    key: 'prefetch',
    value: function prefetch(uri) {
      if (uri == null) {
        return;
      }

      var onTextureLoad = function onTextureLoad(texture) {
        RCTPrefetch.addToCache(uri, texture);
      };

      var onError = function onError() {};

      var loader = new THREE.TextureLoader();
      loader.load(uri, onTextureLoad, undefined, function () {
        return onError();
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      babelHelpers.get(RCTPrefetch.prototype.__proto__ || Object.getPrototypeOf(RCTPrefetch.prototype), 'dispose', this).call(this);
      RCTPrefetch.removeFromCache(this.props.source);
    }
  }], [{
    key: 'addToCache',
    value: function addToCache(uri, texture) {
      if (!RCTPrefetch.cache) {
        RCTPrefetch.cache = [];
      }

      RCTPrefetch.cache[uri] = texture;
    }
  }, {
    key: 'getFromCache',
    value: function getFromCache(uri) {
      return RCTPrefetch.cache && RCTPrefetch.cache[uri];
    }
  }, {
    key: 'removeFromCache',
    value: function removeFromCache(uri) {
      if (RCTPrefetch.cache) {
        RCTPrefetch.cache[uri] = null;
      }
    }
  }, {
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTPrefetch.__proto__ || Object.getPrototypeOf(RCTPrefetch), 'describe', this).call(this), {
        NativeProps: {
          source: 'string'
        }
      });
    }
  }]);
  return RCTPrefetch;
}(_BaseView2.default);

exports.default = RCTPrefetch;