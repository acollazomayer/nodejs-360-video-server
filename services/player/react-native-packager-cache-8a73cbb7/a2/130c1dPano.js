Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _StereoOffsetRepeats = require('../Utils/StereoOffsetRepeats');

var _StereoOffsetRepeats2 = babelHelpers.interopRequireDefault(_StereoOffsetRepeats);

var _HPano = require('../Utils/HPano');

var _CubePano = require('../Utils/CubePano');

var _RCTBindedResource = require('../Utils/RCTBindedResource');

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var _Prefetch = require('./Prefetch');

var _Prefetch2 = babelHelpers.interopRequireDefault(_Prefetch);

var panoRayCast = function () {
  var inverseMatrix = new THREE.Matrix4();
  var ray = new THREE.Ray();
  var sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1000);
  var intersectionPoint = new THREE.Vector3();
  var intersectionPointWorld = new THREE.Vector3();
  return function (raycaster, intersects) {
    inverseMatrix.getInverse(this.matrixWorld);
    ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
    var intersect = ray.intersectSphere(sphere, intersectionPoint);
    if (intersect === null) {
      return;
    }

    intersectionPointWorld.copy(intersectionPoint);
    intersectionPointWorld.applyMatrix4(this.matrixWorld);

    var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
    if (distance < raycaster.near || distance > raycaster.far) {
      return;
    }

    intersects.push({
      distance: distance,
      point: intersectionPointWorld.clone(),
      object: this
    });
  };
}();

var RCTPano = function (_RCTBaseView) {
  babelHelpers.inherits(RCTPano, _RCTBaseView);

  function RCTPano(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTPano);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTPano.__proto__ || Object.getPrototypeOf(RCTPano)).call(this));

    _this._sphereGeometry = new THREE.SphereGeometry(1000, 50, 50);
    _this._cubeGeometry = new _CubePano.CubePanoBufferGeometry(2000, 3, 2, 1.01);
    _this._material = new OVRUI.StereoBasicTextureMaterial({
      color: 'white',
      side: THREE.DoubleSide
    });

    _this._globe = new THREE.Mesh(_this._sphereGeometry, _this._material);
    _this._globe.raycast = panoRayCast.bind(_this._globe);
    _this._globe.rotation.y = -Math.PI / 2;

    _this.view = new OVRUI.UIView(guiSys);
    _this.view.add(_this._globe);
    _this._localResource = new _RCTBindedResource.RCTBindedResource(rnctx.RCTResourceManager);
    _this.globeOnUpdate = _this.globeOnUpdate.bind(_this);

    Object.defineProperty(_this.props, 'source', {
      set: function set(value) {
        return _this.setSource(value);
      }
    });

    Object.defineProperty(_this.style, 'tintColor', {
      set: function set(value) {
        var opacity = parseInt(value.toString(16).slice(0, 2), 16) / 255;
        _this._material.color.set(value);
        _this._material.opacity = opacity;
        _this._material.transparent = opacity < 1;
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTPano, [{
    key: 'globeOnUpdate',
    value: function globeOnUpdate(scene, camera) {
      var projScreenMatrix = new THREE.Matrix4();
      var modelViewMatrix = new THREE.Matrix4();
      modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, this._globe.matrixWorld);
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, modelViewMatrix);
      this._globe.geometry.update(this.maxDepth, projScreenMatrix);
      this._globe.material = this._globe.geometry.material;
    }
  }, {
    key: 'setSource',
    value: function setSource(value) {
      var _this2 = this;

      if (value && value.tile) {
        this._globe.geometry.dispose();
        this.maxDepth = value.maxDepth || 2;
        this._globe.geometry = new _HPano.HPanoBufferGeometry(1000, this.maxDepth, value.tile);
        this._globe.onUpdate = this.globeOnUpdate;
      } else {
        this._globe.geometry.dispose();
        if (value && value.layout === 'CUBEMAP_32') {
          this._globe.geometry = this._cubeGeometry;
          this._globe.scale.z = -1;
        } else {
          this._globe.geometry = this._sphereGeometry;
          this._globe.scale.z = 1;
        }
        this._globe.onUpdate = null;

        this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [this.getTag(), 'topLoadStart', []]);
        var loadRemoteTexture = function loadRemoteTexture(url, onLoad) {
          var onError = function onError() {
            return onLoad(undefined);
          };

          var onProgress = undefined;
          if (url == null) {
            onError();
          } else if (Array.isArray(url)) {
            var loader = new THREE.CubeTextureLoader();
            loader.setCrossOrigin('Access-Control-Allow-Origin');
            loader.load(url, onLoad, onProgress, onError);
          } else {
            var cachedTexture = _Prefetch2.default.getFromCache(url);
            if (cachedTexture != null) {
              onLoad(cachedTexture);
            } else {
              var _loader = new THREE.TextureLoader();
              _loader.setCrossOrigin('Access-Control-Allow-Origin');
              _loader.load(url, onLoad, onProgress, onError);
            }
          }
        };
        var onLoadOrChange = function onLoadOrChange(texture) {
          if (value !== _this2._currentSource) {
            return;
          }
          _this2._globe.scale.x = -1;
          if (texture === undefined) {
            _this2._material.map = undefined;
            _this2._material.envMap = undefined;
          } else if (texture.type === 'MonoTextureInfo') {
            _this2._material.map = texture.texture;
            _this2._material.envMap = undefined;
          } else {
            var cubeTexture = texture.isCubeTexture ? texture : null;
            var flatTexture = texture.isCubeTexture ? null : texture;
            if (texture.isCubeTexture) {
              _this2._globe.scale.x = 1;
              texture.generateMipmaps = true;
            } else {
              texture.wrapS = THREE.ClampToEdgeWrapping;
              texture.wrapT = THREE.ClampToEdgeWrapping;
              texture.minFilter = THREE.LinearFilter;
            }
            _this2._material.map = flatTexture;
            _this2._material.envMap = cubeTexture;
          }
          var stereoFormat = value && value.stereo ? value.stereo : '2D';
          _this2._material.stereoOffsetRepeats = _StereoOffsetRepeats2.default[stereoFormat];
          if (!_this2._material.stereoOffsetRepeats) {
            console.warn('Pano: stereo format \'' + stereoFormat + '\' not supported.');

            _this2._material.stereoOffsetRepeats = _StereoOffsetRepeats2.default['2D'];
          }
          _this2._material.needsUpdate = true;

          if (_this2._material.map) {
            _this2.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this2.getTag(), 'topLoad', []]);
          }

          _this2.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [_this2.getTag(), 'topLoadEnd', []]);
        };

        this._currentSource = value;
        if (Array.isArray(value)) {
          if (value.length !== 6 || !value[0].uri) {
            console.warn('Pano expected cubemap source in format [{uri: http..}, {uri: http..}, ... ]');
            return;
          }
          var urls = value.map(function (x) {
            return x.uri;
          });
          this._localResource.unregister();
          loadRemoteTexture(urls, onLoadOrChange);
        } else {
          var url = value ? value.uri : null;
          if (this._localResource.isValidUrl(url)) {
            this._localResource.load(url, onLoadOrChange);
          } else {
            this._localResource.unregister();
            loadRemoteTexture(url, onLoadOrChange);
          }
        }
      }
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTPano.prototype.__proto__ || Object.getPrototypeOf(RCTPano.prototype), 'presentLayout', this).call(this);
      this._globe.visible = this.YGNode.getDisplay() !== Yoga.DISPLAY_NONE;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._localResource) {
        this._localResource.dispose();
      }
      babelHelpers.get(RCTPano.prototype.__proto__ || Object.getPrototypeOf(RCTPano.prototype), 'dispose', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTPano.__proto__ || Object.getPrototypeOf(RCTPano), 'describe', this).call(this), {
        NativeProps: {
          source: 'string'
        }
      });
    }
  }]);
  return RCTPano;
}(_BaseView2.default);

exports.default = RCTPano;