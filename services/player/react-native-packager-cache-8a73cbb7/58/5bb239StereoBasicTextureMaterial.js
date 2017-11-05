
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;var desc = Object.getOwnPropertyDescriptor(object, property);if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;if (getter === undefined) {
      return undefined;
    }return getter.call(receiver);
  }
};

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

var _StereoTextureUniforms = require('./StereoTextureUniforms');

var _StereoTextureUniforms2 = _interopRequireDefault(_StereoTextureUniforms);

var _StereoShaderLib = require('./StereoShaderLib');

var _StereoShaderLib2 = _interopRequireDefault(_StereoShaderLib);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var DEFAULT_UNIFORM_COLOR = new _ThreeShim2.default.Color();
var DEFAULT_OFFSET_REPEATS = [new _ThreeShim2.default.Vector4(0, 0, 1, 1)];

var StereoBasicTextureMaterial = function (_THREE$ShaderMaterial) {
  _inherits(StereoBasicTextureMaterial, _THREE$ShaderMaterial);

  function StereoBasicTextureMaterial(parameters) {
    _classCallCheck(this, StereoBasicTextureMaterial);

    var uniforms = _ThreeShim2.default.UniformsUtils.merge([new _StereoTextureUniforms2.default(), {
      color: { value: DEFAULT_UNIFORM_COLOR, type: 'f' },
      opacity: { value: 1.0, type: 'f' },
      map: { value: null, type: 't' },
      envMap: { value: null, type: 't' },
      flipEnvMap: { value: 1.0, type: 'f' },
      reflectivity: { value: 1.0, type: 'f' },
      refractionRatio: { value: 0.0, type: 'f' } }]);

    var _this = _possibleConstructorReturn(this, (StereoBasicTextureMaterial.__proto__ || Object.getPrototypeOf(StereoBasicTextureMaterial)).call(this, {
      uniforms: uniforms,
      vertexShader: _StereoShaderLib2.default.stereo_basic_vert,
      fragmentShader: _StereoShaderLib2.default.stereo_basic_frag
    }));

    _this.isStereoBasicTextureMaterial = true;

    _this.stereoOffsetRepeats = DEFAULT_OFFSET_REPEATS;
    _this.setValues(parameters);
    return _this;
  }

  _createClass(StereoBasicTextureMaterial, [{
    key: 'copy',
    value: function copy(source) {
      _get(StereoBasicTextureMaterial.prototype.__proto__ || Object.getPrototypeOf(StereoBasicTextureMaterial.prototype), 'copy', this).call(this, source);
      this.stereoOffsetRepeats = source.stereoOffsetRepeats.slice();
      return this;
    }
  }, {
    key: 'color',
    set: function set(value) {
      this.uniforms.color.value = new _ThreeShim2.default.Color(value);
    },
    get: function get() {
      return this.uniforms.color.value;
    }
  }, {
    key: 'opacity',
    set: function set(value) {
      this.uniforms && (this.uniforms.opacity.value = value);
    },
    get: function get() {
      return this.uniforms.opacity.value;
    }
  }, {
    key: 'map',
    set: function set(value) {
      this.uniforms.map.value = value;
    },
    get: function get() {
      return this.uniforms.map.value;
    }
  }, {
    key: 'envMap',
    set: function set(value) {
      this.uniforms.envMap.value = value;
      this.uniforms.flipEnvMap.value = !(value && value.isCubeTexture) ? 1 : -1;
    },
    get: function get() {
      return this.uniforms.envMap.value;
    }
  }]);

  return StereoBasicTextureMaterial;
}(_ThreeShim2.default.ShaderMaterial);

exports.default = StereoBasicTextureMaterial;