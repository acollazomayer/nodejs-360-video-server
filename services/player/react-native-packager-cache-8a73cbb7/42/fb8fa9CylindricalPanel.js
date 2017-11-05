Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var RCTCylindricalPanel = function (_RCTBaseView) {
  babelHelpers.inherits(RCTCylindricalPanel, _RCTBaseView);

  function RCTCylindricalPanel(guiSys) {
    babelHelpers.classCallCheck(this, RCTCylindricalPanel);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTCylindricalPanel.__proto__ || Object.getPrototypeOf(RCTCylindricalPanel)).call(this));

    _this.material = new THREE.MeshBasicMaterial({
      wireframe: false,
      transparent: true,
      premultipliedAlpha: true,
      color: 'white',
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendEquation: THREE.AddEquation,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
      blendEquationAlpha: THREE.AddEquation
    });

    _this.guiSys = guiSys;
    _this.camera = new THREE.OrthographicCamera();
    _this.subScene = new THREE.Scene();
    var geometry = new THREE.CylinderGeometry(3, 3, 2, 1, 5, true, 0, 2.0 * Math.PI);
    _this.cylinder = new THREE.Mesh(geometry, _this.material);
    _this.cylinder.subScene = _this.subScene;
    _this.cylinder.subSceneCamera = _this.camera;
    _this.cylinder.scale.z = -1;
    _this.view = new OVRUI.UIView(guiSys);
    _this.view.add(_this.cylinder);

    _this.subScene.scale.y = -1;
    _this.isLayer = true;

    Object.defineProperty(_this.style, 'opacity', {
      configurable: true,
      set: function set(value) {
        _this.material.opacity = value;
      }
    });

    Object.defineProperty(_this.props, 'layer', {
      set: function set(value) {
        _this.props._layerWidth = value.width;
        _this.props._layerHeight = value.height;
        _this.props._layerDensity = value.density;

        _this.props._layerRadius = value.radius || 3;
        _this.view.zOffset = _this.props._layerRadius;
        _this.subScene._rttWidth = value.width;
        _this.subScene._rttHeight = value.height;
        _this.cylinder.geometry.dispose();

        var delta = 2 * Math.PI * _this.props._layerWidth / _this.props._layerDensity;

        var halfHeight = _this.props._layerRadius * (Math.PI * value.height / _this.props._layerDensity);
        _this.cylinder.geometry = new THREE.CylinderGeometry(_this.props._layerRadius, _this.props._layerRadius, halfHeight * 2, 20, 6, true, -delta * 0.5, delta);
        _this.cylinder.needsUpdate = true;
        _this._createRTT();
      }
    });
    return _this;
  }

  babelHelpers.createClass(RCTCylindricalPanel, [{
    key: '_createRTT',
    value: function _createRTT() {
      if (this.props._layerWidth > 0 && this.props._layerHeight > 0) {
        if (!this.rtt) {
          this.rtt = new THREE.WebGLRenderTarget(this.props._layerWidth, this.props._layerHeight, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
          });
        } else {
          this.rtt.setSize(this.props._layerWidth, this.props._layerHeight);
        }
        this.material.map = this.rtt.texture;
        this.material.needsUpdate = true;
        this.camera = new THREE.OrthographicCamera(0, this.props._layerWidth, 0, this.props._layerHeight, -1000, 1000);
        this.camera.setViewOffset(this.props._layerWidth, this.props._layerHeight, 0, 0, this.props._layerWidth, this.props._layerHeight);
        this.cylinder.subSceneCamera = this.camera;
        this.guiSys.unregisterOffscreenRender(this.offscreenUID);
        this.offscreenUID = this.guiSys.registerOffscreenRender(this.subScene, this.camera, this.rtt);
      }
    }
  }, {
    key: 'addChild',
    value: function addChild(index, child) {
      this.children.splice(index, 0, child);
      this.YGNode.insertChild(child.YGNode, index);
      this.subScene.add(child.view);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(index) {
      this.subScene.remove(this.children[index].view);
      this.YGNode.removeChild(this.YGNode.getChild(index));
      this.children.splice(index, 1);
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTCylindricalPanel.prototype.__proto__ || Object.getPrototypeOf(RCTCylindricalPanel.prototype), 'presentLayout', this).call(this);
      this.cylinder.visible = this.YGNode.getDisplay() !== Yoga.DISPLAY_NONE;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.guiSys.unregisterOffscreenRender(this.offscreenUID);
      babelHelpers.get(RCTCylindricalPanel.prototype.__proto__ || Object.getPrototypeOf(RCTCylindricalPanel.prototype), 'dispose', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTCylindricalPanel.__proto__ || Object.getPrototypeOf(RCTCylindricalPanel), 'describe', this).call(this), {
        NativeProps: {
          layer: 'object'
        }
      });
    }
  }]);
  return RCTCylindricalPanel;
}(_BaseView2.default);

exports.default = RCTCylindricalPanel;