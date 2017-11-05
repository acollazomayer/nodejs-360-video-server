Object.defineProperty(exports, "__esModule", {
  value: true
});

var _RefCountCache = require('./RefCountCache');

var _RefCountCache2 = babelHelpers.interopRequireDefault(_RefCountCache);

var _three = require('three');

var TextureManager = function () {
  function TextureManager() {
    var _this = this;

    var queueSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    babelHelpers.classCallCheck(this, TextureManager);

    this._queueSize = queueSize;

    this._textureMap = {};

    this._pendingTextures = {};

    this._ejectionQueue = [];

    this._customTextureLoads = {};

    this._customTexturesWithUpdates = [];

    this._refCountCache = new _RefCountCache2.default(function (path) {
      _this._ejectionQueue.push(path);
      if (_this._ejectionQueue.length > _this._queueSize) {
        var ejected = _this._ejectionQueue.shift();
        var tex = _this._textureMap[ejected];
        delete _this._textureMap[ejected];
        if (tex) {
          tex.dispose();
        }
      }
    });
  }

  babelHelpers.createClass(TextureManager, [{
    key: 'isTextureCached',
    value: function isTextureCached(url) {
      return url in this._textureMap;
    }
  }, {
    key: 'isTextureLoading',
    value: function isTextureLoading(url) {
      return url in this._pendingTextures;
    }
  }, {
    key: 'isTextureReferenced',
    value: function isTextureReferenced(url) {
      return this._refCountCache.has(url);
    }
  }, {
    key: 'isTextureInEjectionQueue',
    value: function isTextureInEjectionQueue(url) {
      return this._ejectionQueue.indexOf(url) > -1;
    }
  }, {
    key: 'getTextureForURL',
    value: function getTextureForURL(url) {
      var _this2 = this;

      if (this._textureMap[url]) {
        return Promise.resolve(this._textureMap[url]);
      }
      if (this._pendingTextures[url]) {
        return this._pendingTextures[url];
      }

      if (url.startsWith('texture://')) {
        var _promise = new Promise(function (resolve, reject) {
          _this2._customTextureLoads[url] = resolve;
        });
        this._pendingTextures[url] = _promise;
        return _promise;
      }

      var promise = new Promise(function (resolve, reject) {
        var loader = new _three.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(url, function (texture) {
          _this2._textureMap[url] = texture;
          delete _this2._pendingTextures[url];
          resolve(texture);
        }, undefined, function (error) {
          reject(error);
        });
      });
      this._pendingTextures[url] = promise;
      return promise;
    }
  }, {
    key: 'addReference',
    value: function addReference(url) {
      if (url.startsWith('texture://')) {
        return;
      }
      if (this._refCountCache.has(url)) {
        this._refCountCache.addReference(url);
      } else {
        var index = this._ejectionQueue.indexOf(url);
        if (index > -1) {
          this._ejectionQueue.splice(index, 1);
        }
        this._refCountCache.addEntry(url, true);
      }
    }
  }, {
    key: 'removeReference',
    value: function removeReference(url) {
      if (url.startsWith('texture://')) {
        return;
      }
      if (this._refCountCache.has(url)) {
        this._refCountCache.removeReference(url);
      }
    }
  }, {
    key: 'registerLocalTextureSource',
    value: function registerLocalTextureSource(name, source) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (source instanceof HTMLCanvasElement) {
        var tex = new _three.Texture(source);
        tex.needsUpdate = true;
        var _url = 'texture://' + name;
        this._textureMap[_url] = tex;
        if (options.updateOnFrame) {
          this._customTexturesWithUpdates.push(tex);
        }
        delete this._pendingTextures[_url];
        if (this._customTextureLoads[_url]) {
          this._customTextureLoads[_url](tex);
          delete this._customTextureLoads[_url];
        }
      } else {
        throw new Error('Unsupported texture source');
      }
    }
  }, {
    key: 'frame',
    value: function frame() {
      var textures = this._customTexturesWithUpdates;
      for (var i = 0, length = textures.length; i < length; i++) {
        textures[i].needsUpdate = true;
      }
    }
  }]);
  return TextureManager;
}();

exports.default = TextureManager;