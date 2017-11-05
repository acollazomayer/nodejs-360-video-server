
'use strict';

var MatrixMath = require('MatrixMath');
var Platform = require('Platform');

var invariant = require('invariant');
var stringifySafe = require('stringifySafe');

function processTransform(transform) {
  var result = MatrixMath.createIdentityMatrix();

  transform.forEach(function (transformation) {
    var key = Object.keys(transformation)[0];
    var value = transformation[key];
    if (__DEV__) {
      _validateTransform(key, value, transformation);
    }

    switch (key) {
      case 'matrix':
        MatrixMath.multiplyInto(result, result, value);
        break;
      case 'perspective':
        _multiplyTransform(result, MatrixMath.reusePerspectiveCommand, [value]);
        break;
      case 'rotateX':
        _multiplyTransform(result, MatrixMath.reuseRotateXCommand, [_convertToRadians(value)]);
        break;
      case 'rotateY':
        _multiplyTransform(result, MatrixMath.reuseRotateYCommand, [_convertToRadians(value)]);
        break;
      case 'rotate':
      case 'rotateZ':
        _multiplyTransform(result, MatrixMath.reuseRotateZCommand, [_convertToRadians(value)]);
        break;
      case 'scale':
        if (typeof value === 'number') {
          _multiplyTransform(result, MatrixMath.reuseScale3dCommand, [value, value, value]);
        } else {
          _multiplyTransform(result, MatrixMath.reuseScale3dCommand, [value[0], value[1], value[2]]);
        }
        break;
      case 'scaleX':
        _multiplyTransform(result, MatrixMath.reuseScaleXCommand, [value]);
        break;
      case 'scaleY':
        _multiplyTransform(result, MatrixMath.reuseScaleYCommand, [value]);
        break;
      case 'scale3d':
        _multiplyTransform(result, MatrixMath.reuseScale3dCommand, [value[0], value[1], value[2]]);
        break;
      case 'translate':
        _multiplyTransform(result, MatrixMath.reuseTranslate3dCommand, [value[0], value[1], value[2] || 0]);
        break;
      case 'translateX':
        _multiplyTransform(result, MatrixMath.reuseTranslate2dCommand, [value, 0]);
        break;
      case 'translateY':
        _multiplyTransform(result, MatrixMath.reuseTranslate2dCommand, [0, value]);
        break;
      case 'translateZ':
        _multiplyTransform(result, MatrixMath.reuseTranslate3dCommand, [0, 0, value]);
        break;
      case 'skewX':
        _multiplyTransform(result, MatrixMath.reuseSkewXCommand, [_convertToRadians(value)]);
        break;
      case 'skewY':
        _multiplyTransform(result, MatrixMath.reuseSkewYCommand, [_convertToRadians(value)]);
        break;
      default:
        throw new Error('Invalid transform name: ' + key);
    }
  });

  if (Platform.OS === 'android') {
    return MatrixMath.decomposeMatrix(result);
  }
  return result;
}

function _multiplyTransform(result, matrixMathFunction, args) {
  var matrixToApply = MatrixMath.createIdentityMatrix();
  var argsWithIdentity = [matrixToApply].concat(args);
  matrixMathFunction.apply(this, argsWithIdentity);
  MatrixMath.multiplyInto(result, result, matrixToApply);
}

function _convertToRadians(value) {
  var isRad = typeof value === 'string' ? value.indexOf('rad') > -1 : false;
  var floatValue = typeof value === 'string' ? parseFloat(value, 10) : value;
  return isRad ? floatValue : floatValue * Math.PI / 180;
}

function _validateTransform(key, value, transformation) {
  invariant(!value.getValue, 'You passed an Animated.Value to a normal component. ' + 'You need to wrap that component in an Animated. For example, ' + 'replace <View /> by <Animated.View />.');

  var multivalueTransforms = ['matrix', 'translate'];
  if (multivalueTransforms.indexOf(key) !== -1) {
    invariant(Array.isArray(value), 'Transform with key of %s must have an array as the value: %s', key, stringifySafe(transformation));
  }
  switch (key) {
    case 'matrix':
      invariant(value.length === 9 || value.length === 16, 'Matrix transform must have a length of 9 (2d) or 16 (3d). ' + 'Provided matrix has a length of %s: %s', value.length, stringifySafe(transformation));
      break;
    case 'translate':
      break;
    case 'scale':
      invariant(typeof value === 'number' || value.length === 3, 'scale with key of "%s" must be a number or array of length 3: %s', key, stringifySafe(transformation));
      break;
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
    case 'rotate':
      invariant(typeof value === 'string' || typeof value === 'number', 'Transform with key of "%s" must be a string or number: %s', key, stringifySafe(transformation));
      invariant(typeof value === 'number' || value.indexOf('deg') > -1 || value.indexOf('rad') > -1, 'Rotate transform must be expressed in degrees (deg) or radians (rad): %s', stringifySafe(transformation));
      break;
    case 'skewX':
    case 'skewY':
      invariant(typeof value === 'string', 'Transform with key of "%s" must be a string: %s', key, stringifySafe(transformation));
      invariant(value.indexOf('deg') > -1 || value.indexOf('rad') > -1, 'Rotate transform must be expressed in degrees (deg) or radians (rad): %s', stringifySafe(transformation));
      break;
    case 'perspective':
      invariant(typeof value === 'number', 'Transform with key of "%s" must be a number: %s', key, stringifySafe(transformation));
      invariant(value !== 0, 'Transform with key of "%s" cannot be zero: %s', key, stringifySafe(transformation));
      break;
    default:
      invariant(typeof value === 'number', 'Transform with key of "%s" must be a number: %s', key, stringifySafe(transformation));
  }
}

module.exports = processTransform;