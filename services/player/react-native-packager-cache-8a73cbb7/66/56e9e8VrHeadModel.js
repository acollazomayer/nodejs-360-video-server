
'use strict';

var MatrixMath = require('MatrixMath');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var VrMath = require('VrMath');

var VrHeadModelImpl = function () {
  function VrHeadModelImpl() {
    var _this = this;

    babelHelpers.classCallCheck(this, VrHeadModelImpl);

    this.headMatrix = MatrixMath.createIdentityMatrix();
    this.viewMatrix = MatrixMath.createIdentityMatrix();
    this._inVR = false;
    this.fov = 0;
    this.aspect = 1;
    this._headMatrixListener = RCTDeviceEventEmitter.addListener('onReceivedHeadMatrix', this._onReceivedHeadMatrix.bind(this));
    RCTDeviceEventEmitter.addListener('onEnterVR', function () {
      _this._inVR = true;
    });
    RCTDeviceEventEmitter.addListener('onExitVR', function () {
      _this._inVR = false;
    });
  }

  babelHelpers.createClass(VrHeadModelImpl, [{
    key: '_onReceivedHeadMatrix',
    value: function _onReceivedHeadMatrix(headMatrix, viewMatrix, fov, aspect) {
      this.headMatrix = headMatrix;
      this.viewMatrix = viewMatrix;
      this.fov = fov;
      this.aspect = aspect;
    }
  }, {
    key: 'positionOfHeadMatrix',
    value: function positionOfHeadMatrix(headMatrix) {
      console.warn('positionOfHeadMatrix is deprecated.  Please use position instead');
      var matrix = headMatrix || this.headMatrix;
      return VrMath.getTranslation(matrix);
    }
  }, {
    key: 'rotationOfHeadMatrix',
    value: function rotationOfHeadMatrix(headMatrix, eulerOrder) {
      console.warn('rotationOfHeadMatrix is deprecated.  Please use rotation, rotationInRadians, ' + 'yawPitchRoll or yawPitchRollInRadians instead');
      var matrix = headMatrix || this.headMatrix;
      return VrMath.getRotation(matrix, eulerOrder);
    }
  }, {
    key: 'position',
    value: function position() {
      return VrMath.getTranslation(this.headMatrix);
    }
  }, {
    key: 'rotation',
    value: function rotation() {
      return this.rotationInRadians().map(VrMath.radToDeg);
    }
  }, {
    key: 'rotationInRadians',
    value: function rotationInRadians() {
      return VrMath.getRotation(this.headMatrix, 'XYZ');
    }
  }, {
    key: 'yawPitchRoll',
    value: function yawPitchRoll() {
      return this.yawPitchRollInRadians().map(VrMath.radToDeg);
    }
  }, {
    key: 'yawPitchRollInRadians',
    value: function yawPitchRollInRadians() {
      return VrMath.getRotation(this.headMatrix);
    }
  }, {
    key: 'horizontalFov',
    value: function horizontalFov() {
      return this.fov;
    }
  }, {
    key: 'verticalFov',
    value: function verticalFov() {
      return this.fov / this.aspect;
    }
  }, {
    key: 'horizontalFovInRadians',
    value: function horizontalFovInRadians() {
      return VrMath.degToRad(this.horizontalFov());
    }
  }, {
    key: 'verticalFovInRadians',
    value: function verticalFovInRadians() {
      return VrMath.degToRad(this.verticalFov());
    }
  }, {
    key: 'getHeadMatrix',
    value: function getHeadMatrix() {
      return [].concat(babelHelpers.toConsumableArray(this.headMatrix));
    }
  }, {
    key: 'getVRStatus',
    value: function getVRStatus() {
      console.warn('getVRStatus is deprecated.  Please use inVR instead');
      return this._inVR;
    }
  }, {
    key: 'inVR',
    value: function inVR() {
      return this._inVR;
    }
  }]);
  return VrHeadModelImpl;
}();

module.exports = new VrHeadModelImpl();