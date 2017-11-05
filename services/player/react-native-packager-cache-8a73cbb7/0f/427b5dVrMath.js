
'use strict';

var clamp = require('clamp');
var MatrixMath = require('MatrixMath');

var RAD_TO_DEG = 180 / Math.PI;
var DEG_TO_RAD = Math.PI / 180;

var VrMath = {
  getScale: function getScale(m) {
    var sx = MatrixMath.v3Length([m[0], m[1], m[2]]);
    var sy = MatrixMath.v3Length([m[4], m[5], m[6]]);
    var sz = MatrixMath.v3Length([m[8], m[9], m[10]]);

    var det = MatrixMath.determinant(m);
    return det < 0 ? [-sx, sy, sz] : [sx, sy, sz];
  },

  getTranslation: function getTranslation(m) {
    return [m[12], m[13], m[14]];
  },

  getRotation: function getRotation(m, eulerOrder) {
    var scale = this.getScale(m);

    var invSX = 1 / scale[0];
    var invSY = 1 / scale[1];
    var invSZ = 1 / scale[2];

    var m11 = m[0] * invSX;
    var m12 = m[4] * invSY;
    var m13 = m[8] * invSZ;
    var m21 = m[1] * invSX;
    var m22 = m[5] * invSY;
    var m23 = m[9] * invSZ;
    var m31 = m[2] * invSX;
    var m32 = m[6] * invSY;
    var m33 = m[10] * invSZ;
    var order = eulerOrder || 'YXZ';
    var rotation = [0, 0, 0];
    if (order === 'XYZ') {
      rotation[1] = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.99999) {
        rotation[0] = Math.atan2(-m23, m33);
        rotation[2] = Math.atan2(-m12, m11);
      } else {
        rotation[0] = Math.atan2(m32, m22);
        rotation[2] = 0;
      }
    } else if (order === 'YXZ') {
      rotation[0] = Math.asin(-clamp(m23, -1, 1));
      if (Math.abs(m23) < 0.99999) {
        rotation[1] = Math.atan2(m13, m33);
        rotation[2] = Math.atan2(m21, m22);
      } else {
        rotation[1] = Math.atan2(-m31, m11);
        rotation[2] = 0;
      }
    } else if (order === 'ZXY') {
      rotation[0] = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.99999) {
        rotation[1] = Math.atan2(-m31, m33);
        rotation[2] = Math.atan2(-m12, m22);
      } else {
        rotation[1] = 0;
        rotation[2] = Math.atan2(m21, m11);
      }
    } else if (order === 'ZYX') {
      rotation[1] = Math.asin(-clamp(m31, -1, 1));
      if (Math.abs(m31) < 0.99999) {
        rotation[0] = Math.atan2(m32, m33);
        rotation[2] = Math.atan2(m21, m11);
      } else {
        rotation[0] = 0;
        rotation[2] = Math.atan2(-m12, m22);
      }
    } else if (order === 'YZX') {
      rotation[2] = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.99999) {
        rotation[0] = Math.atan2(-m23, m22);
        rotation[1] = Math.atan2(-m31, m11);
      } else {
        rotation[0] = 0;
        rotation[1] = Math.atan2(m13, m33);
      }
    } else if (order === 'XZY') {
      rotation[2] = Math.asin(-clamp(m12, -1, 1));
      if (Math.abs(m12) < 0.99999) {
        rotation[0] = Math.atan2(m32, m22);
        rotation[1] = Math.atan2(m13, m11);
      } else {
        rotation[0] = Math.atan2(-m23, m33);
        rotation[1] = 0;
      }
    } else {
      console.warn('VrMath.getRotation: unsupported order: ' + order);
    }
    return rotation;
  },

  getMatrixForward: function getMatrixForward(m) {
    return MatrixMath.v3Normalize([-m[8], -m[9], -m[10]]);
  },

  getMatrixUp: function getMatrixUp(m) {
    return MatrixMath.v3Normalize([m[4], m[5], m[6]]);
  },

  radToDeg: function radToDeg(rad) {
    return rad * RAD_TO_DEG;
  },

  degToRad: function degToRad(deg) {
    return deg * DEG_TO_RAD;
  }
};

module.exports = VrMath;