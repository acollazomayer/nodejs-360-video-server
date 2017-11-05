Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _extractURL = require('../Utils/extractURL');

var _extractURL2 = babelHelpers.interopRequireDefault(_extractURL);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var RCTBaseMesh = function (_RCTBaseView) {
  babelHelpers.inherits(RCTBaseMesh, _RCTBaseView);

  function RCTBaseMesh(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTBaseMesh);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTBaseMesh.__proto__ || Object.getPrototypeOf(RCTBaseMesh)).call(this));

    _this._lit = false;
    _this._shader = false;
    _this._wireframe = false;
    _this._textureURL = null;
    _this._loadingURL = null;
    _this._texture = null;
    _this._litMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    _this._unlitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    _this._shaderMaterial = new THREE.ShaderMaterial();
    _this._shaderUniformsMap = {
      texture: {
        value: null
      }
    };
    _this._rnctx = rnctx;

    _this.mesh = null;
    _this.view = new OVRUI.UIView(guiSys);

    Object.defineProperty(_this.style, 'opacity', {
      configurable: true,
      set: function set(value) {
        if (value === null) {
          _this._litMaterial.opacity = 1;
          _this._unlitMaterial.opacity = 1;
          _this._litMaterial.transparent = false;
          _this._unlitMaterial.transparent = false;
        } else {
          _this._litMaterial.opacity = value;
          _this._unlitMaterial.opacity = value;
          _this._litMaterial.transparent = value < 1;
          _this._unlitMaterial.transparent = value < 1;
        }
      }
    });

    Object.defineProperty(_this.props, 'lit', {
      set: _this._setLit.bind(_this)
    });

    Object.defineProperty(_this.props, 'wireframe', {
      set: _this._setWireframe.bind(_this)
    });

    Object.defineProperty(_this.props, 'materialParameters', {
      set: _this._setMaterialParameters.bind(_this)
    });
    Object.defineProperty(_this.props, 'texture', {
      set: _this._setTexture.bind(_this)
    });

    Object.defineProperty(_this.style, 'color', {
      set: _this._setColor.bind(_this)
    });
    return _this;
  }

  babelHelpers.createClass(RCTBaseMesh, [{
    key: '_setColor',
    value: function _setColor(color) {
      this._color = color;
      if (color == null) {
        this._litMaterial.color.setHex(0xffffff);
        this._unlitMaterial.color.setHex(0xffffff);
      } else {
        this._litMaterial.color.setHex(color);
        this._unlitMaterial.color.setHex(color);
      }
    }
  }, {
    key: '_setTexture',
    value: function _setTexture(value) {
      var _this2 = this;

      if (!value) {
        if (this._texture) {
          this._texture = null;
          if (this._textureURL) {
            this._rnctx.TextureManager.removeReference(this._textureURL);
            this._textureURL = null;
          }
        }

        this._litMaterial.map = null;
        this._unlitMaterial.map = null;
        this._shaderUniformsMap.texture.value = null;
        this._litMaterial.needsUpdate = true;
        this._unlitMaterial.needsUpdate = true;
        this._shaderMaterial.needsUpdate = true;
        return;
      }
      var url = (0, _extractURL2.default)(value);
      if (!url) {
        throw new Error('Invalid value for "texture" property: ' + JSON.stringify(value));
      }
      this._loadingURL = url;
      var manager = this._rnctx.TextureManager;
      manager.addReference(url);
      manager.getTextureForURL(url).then(function (texture) {
        if (url !== _this2._loadingURL) {
          manager.removeReference(url);
          return;
        }
        _this2._loadingURL = null;
        if (_this2._textureURL) {
          manager.removeReference(_this2._textureURL);
        }
        _this2._texture = texture;
        _this2._texture.needsUpdate = true;
        _this2._textureURL = url;

        _this2._litMaterial.map = _this2._texture;
        _this2._unlitMaterial.map = _this2._texture;
        _this2._shaderUniformsMap.texture.value = texture;
        _this2._litMaterial.needsUpdate = true;
        _this2._unlitMaterial.needsUpdate = true;
        _this2._shaderMaterial.needsUpdate = true;
      }, function (err) {
        manager.removeReference(url);
        _this2._loadingURL = null;
        console.error(err);
      }).catch(function (err) {
        console.error(err);
      });
    }
  }, {
    key: '_setLit',
    value: function _setLit(flag) {
      this._lit = flag;
      var mat = this._shader ? this._shaderMaterial : flag ? this._litMaterial : this._unlitMaterial;
      if (this.mesh) {
        this.mesh.material = mat;
      }
    }
  }, {
    key: '_setWireframe',
    value: function _setWireframe(flag) {
      this._wireframe = flag;
      this._litMaterial.wireframe = flag;
      this._unlitMaterial.wireframe = flag;
    }
  }, {
    key: '_setGeometry',
    value: function _setGeometry(geometry) {
      if (!this.mesh) {
        var mat = this._shader ? this._shaderMaterial : this._lit ? this._litMaterial : this._unlitMaterial;
        this.mesh = new THREE.Mesh(geometry, mat);
        this.view.add(this.mesh);
      } else {
        this.mesh.geometry = geometry;
      }
    }
  }, {
    key: '_setMaterialParameters',
    value: function _setMaterialParameters(parameters) {
      if (!parameters) {
        parameters = {
          fog: true,

          blending: THREE.NormalBlending,
          side: THREE.FrontSide,
          shading: THREE.SmoothShading,
          vertexColors: THREE.NoColors,

          transparent: false,

          blendSrc: THREE.SrcAlphaFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          blendEquation: THREE.AddEquation,
          blendSrcAlpha: null,
          blendDstAlpha: null,
          blendEquationAlpha: null,

          depthFunc: THREE.LessEqualDepth,
          depthTest: true,
          depthWrite: true,

          clippingPlanes: null,
          clipShadows: false,

          colorWrite: true
        };
      }
      if (parameters.vertexShader || parameters.fragmentShader) {
        parameters.uniforms = babelHelpers.extends({}, this._shaderUniformsMap, parameters.uniforms);
        this._shaderMaterial.setValues(parameters);
        this._shader = true;
        if (this.mesh) {
          this.mesh.material = this._shaderMaterial;
        }
      } else {
        this._litMaterial.setValues(parameters);
        this._unlitMaterial.setValues(parameters);
        this._shader = false;
        if (this.mesh) {
          this.mesh.material = this._lit ? this._litMaterial : this._unlitMaterial;
        }
      }
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTBaseMesh.prototype.__proto__ || Object.getPrototypeOf(RCTBaseMesh.prototype), 'presentLayout', this).call(this);
      if (this.mesh && this.mesh.geometry) {
        this.mesh.geometry.visible = this.YGNode.getDisplay() !== Yoga.DISPLAY_NONE;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._texture) {
        this._texture = null;
        if (this._textureURL) {
          this._rnctx.TextureManager.removeReference(this._textureURL);
          this._textureURL = null;
        }
      }
      this._litMaterial.dispose();
      this._shaderMaterial.dispose();
      this._unlitMaterial.dispose();
      babelHelpers.get(RCTBaseMesh.prototype.__proto__ || Object.getPrototypeOf(RCTBaseMesh.prototype), 'dispose', this).call(this);
      this._geometry = null;
      this.mesh = null;
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTBaseMesh.__proto__ || Object.getPrototypeOf(RCTBaseMesh), 'describe', this).call(this), {
        NativeProps: {
          lit: 'boolean',
          texture: 'object',
          wireframe: 'boolean',
          materialParameters: 'object'
        }
      });
    }
  }]);
  return RCTBaseMesh;
}(_BaseView2.default);

exports.default = RCTBaseMesh;