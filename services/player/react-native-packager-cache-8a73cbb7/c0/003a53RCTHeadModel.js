Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var RCTHeadModel = function () {
  function RCTHeadModel(rnctx) {
    babelHelpers.classCallCheck(this, RCTHeadModel);

    this._rnctx = rnctx;
  }

  babelHelpers.createClass(RCTHeadModel, [{
    key: 'sendHeadModel',
    value: function sendHeadModel(camera) {
      camera.updateMatrixWorld(true);

      var headMatrix = camera.matrixWorld;

      var viewMatrix = new THREE.Matrix4();
      viewMatrix.getInverse(headMatrix);

      var headMatrixArray = headMatrix.toArray();
      var viewMatrixArray = viewMatrix.toArray();

      var target = this._rnctx.lastHit ? this._rnctx.getHitTag(this._rnctx.lastHit) : null;
      var source = this._rnctx.lastSource;
      if (target) {
        this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [target, 'topHeadPose', {
          headMatrix: headMatrixArray,
          viewMatrix: viewMatrixArray,
          target: target,
          source: source
        }]);
      }

      this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['onReceivedHeadMatrix', headMatrixArray, viewMatrixArray, camera.fov, camera.aspect]);
    }
  }, {
    key: 'frame',
    value: function frame(camera) {
      this.sendHeadModel(camera);
    }
  }]);
  return RCTHeadModel;
}();

exports.default = RCTHeadModel;