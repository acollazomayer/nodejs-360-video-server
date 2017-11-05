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

var basic_vert = '\n      varying highp vec4 vUv;\n      void main()\n      {\n          vUv = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n          vUv.xy = (vUv.xy + vec2(vUv.w)) * 0.5;\n          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n      }\n  ';

var basic_frag = '\n      uniform sampler2D map;\n      varying highp vec4 vUv;\n      void main()\n      {\n        gl_FragColor = texture2DProj( map, vUv );\n      }\n  ';

var SPHERE_RADIUS = 1000;

var sphereRayCast = function () {
  var inverseMatrix = new THREE.Matrix4();
  var ray = new THREE.Ray();
  var sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), SPHERE_RADIUS);
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

var RCTLiveEnvCamera = function (_RCTBaseView) {
  babelHelpers.inherits(RCTLiveEnvCamera, _RCTBaseView);

  function RCTLiveEnvCamera(guiSys, rnctx) {
    babelHelpers.classCallCheck(this, RCTLiveEnvCamera);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTLiveEnvCamera.__proto__ || Object.getPrototypeOf(RCTLiveEnvCamera)).call(this));

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
      video: { facingMode: { exact: 'environment' } }
    };
    var video = document.createElement('video');
    var videoTexture = new THREE.Texture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    _this._video = video;
    _this._videoTexture = videoTexture;
    navigator.getUserMedia(constraints, function (stream) {
      video.src = window.URL.createObjectURL(stream);
    }, function (error) {
      console.log('navigator.getUserMedia error: ', error);
    });

    _this._sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 5, 5);
    _this._material = new THREE.ShaderMaterial({
      uniforms: {
        map: {
          value: videoTexture,
          type: 't'
        }
      },
      vertexShader: basic_vert,
      fragmentShader: basic_frag,
      side: THREE.DoubleSide
    });

    _this._onUpdate = _this._onUpdate.bind(_this);

    _this._globe = new THREE.Mesh(_this._sphereGeometry, _this._material);
    _this._globe.raycast = sphereRayCast.bind(_this._globe);
    _this._globe.rotation.y = -Math.PI / 2;
    _this._globe.onUpdate = _this._onUpdate;

    _this.view = new OVRUI.UIView(guiSys);
    _this.view.add(_this._globe);
    return _this;
  }

  babelHelpers.createClass(RCTLiveEnvCamera, [{
    key: '_onUpdate',
    value: function _onUpdate(scene, camera) {
      if (this._video.readyState === this._video.HAVE_ENOUGH_DATA) {
        this._videoTexture.needsUpdate = true;
      }
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTLiveEnvCamera.prototype.__proto__ || Object.getPrototypeOf(RCTLiveEnvCamera.prototype), 'presentLayout', this).call(this);
      this._globe.visible = this.YGNode.getDisplay() !== Yoga.DISPLAY_NONE;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._localResource) {
        this._localResource.dispose();
      }
      babelHelpers.get(RCTLiveEnvCamera.prototype.__proto__ || Object.getPrototypeOf(RCTLiveEnvCamera.prototype), 'dispose', this).call(this);
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTLiveEnvCamera.__proto__ || Object.getPrototypeOf(RCTLiveEnvCamera), 'describe', this).call(this), {
        NativeProps: {}
      });
    }
  }]);
  return RCTLiveEnvCamera;
}(_BaseView2.default);

exports.default = RCTLiveEnvCamera;