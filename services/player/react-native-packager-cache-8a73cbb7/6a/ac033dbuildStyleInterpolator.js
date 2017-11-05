

var keyOf = require('fbjs/lib/keyOf');

var X_DIM = keyOf({ x: null });
var Y_DIM = keyOf({ y: null });
var Z_DIM = keyOf({ z: null });
var W_DIM = keyOf({ w: null });

var TRANSFORM_ROTATE_NAME = keyOf({ transformRotateRadians: null });

var ShouldAllocateReusableOperationVars = {
  transformRotateRadians: true,
  transformScale: true,
  transformTranslate: true
};

var InitialOperationField = {
  transformRotateRadians: [0, 0, 0, 1],
  transformTranslate: [0, 0, 0],
  transformScale: [1, 1, 1]
};

var ARGUMENT_NAMES_RE = /([^\s,]+)/g;

var inline = function inline(fnStr, replaceWithArgs) {
  var parameterNames = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES_RE) || [];
  var replaceRegexStr = parameterNames.map(function (paramName) {
    return '\\b' + paramName + '\\b';
  }).join('|');
  var replaceRegex = new RegExp(replaceRegexStr, 'g');
  var fnBody = fnStr.substring(fnStr.indexOf('{') + 1, fnStr.lastIndexOf('}'));
  var newFnBody = fnBody.replace(replaceRegex, function (parameterName) {
    var indexInParameterNames = parameterNames.indexOf(parameterName);
    var replacementName = replaceWithArgs[indexInParameterNames];
    return replacementName;
  });
  return newFnBody.split('\n');
};

var MatrixOps = {
  unroll: 'function(matVar, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15) {\n    m0 = matVar[0];\n    m1 = matVar[1];\n    m2 = matVar[2];\n    m3 = matVar[3];\n    m4 = matVar[4];\n    m5 = matVar[5];\n    m6 = matVar[6];\n    m7 = matVar[7];\n    m8 = matVar[8];\n    m9 = matVar[9];\n    m10 = matVar[10];\n    m11 = matVar[11];\n    m12 = matVar[12];\n    m13 = matVar[13];\n    m14 = matVar[14];\n    m15 = matVar[15];\n  }',

  matrixDiffers: 'function(retVar, matVar, m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15) {\n    retVar = retVar ||\n    m0 !== matVar[0] ||\n    m1 !== matVar[1] ||\n    m2 !== matVar[2] ||\n    m3 !== matVar[3] ||\n    m4 !== matVar[4] ||\n    m5 !== matVar[5] ||\n    m6 !== matVar[6] ||\n    m7 !== matVar[7] ||\n    m8 !== matVar[8] ||\n    m9 !== matVar[9] ||\n    m10 !== matVar[10] ||\n    m11 !== matVar[11] ||\n    m12 !== matVar[12] ||\n    m13 !== matVar[13] ||\n    m14 !== matVar[14] ||\n    m15 !== matVar[15];\n  }',

  transformScale: 'function(matVar, opVar) {\n    // Scaling matVar by opVar\n    var x = opVar[0];\n    var y = opVar[1];\n    var z = opVar[2];\n    matVar[0] = matVar[0] * x;\n    matVar[1] = matVar[1] * x;\n    matVar[2] = matVar[2] * x;\n    matVar[3] = matVar[3] * x;\n    matVar[4] = matVar[4] * y;\n    matVar[5] = matVar[5] * y;\n    matVar[6] = matVar[6] * y;\n    matVar[7] = matVar[7] * y;\n    matVar[8] = matVar[8] * z;\n    matVar[9] = matVar[9] * z;\n    matVar[10] = matVar[10] * z;\n    matVar[11] = matVar[11] * z;\n    matVar[12] = matVar[12];\n    matVar[13] = matVar[13];\n    matVar[14] = matVar[14];\n    matVar[15] = matVar[15];\n  }',

  transformTranslate: 'function(matVar, opVar) {\n    // Translating matVar by opVar\n    var x = opVar[0];\n    var y = opVar[1];\n    var z = opVar[2];\n    matVar[12] = matVar[0] * x + matVar[4] * y + matVar[8] * z + matVar[12];\n    matVar[13] = matVar[1] * x + matVar[5] * y + matVar[9] * z + matVar[13];\n    matVar[14] = matVar[2] * x + matVar[6] * y + matVar[10] * z + matVar[14];\n    matVar[15] = matVar[3] * x + matVar[7] * y + matVar[11] * z + matVar[15];\n  }',

  transformRotateRadians: 'function(matVar, q) {\n    // Rotating matVar by q\n    var xQuat = q[0], yQuat = q[1], zQuat = q[2], wQuat = q[3];\n    var x2Quat = xQuat + xQuat;\n    var y2Quat = yQuat + yQuat;\n    var z2Quat = zQuat + zQuat;\n    var xxQuat = xQuat * x2Quat;\n    var xyQuat = xQuat * y2Quat;\n    var xzQuat = xQuat * z2Quat;\n    var yyQuat = yQuat * y2Quat;\n    var yzQuat = yQuat * z2Quat;\n    var zzQuat = zQuat * z2Quat;\n    var wxQuat = wQuat * x2Quat;\n    var wyQuat = wQuat * y2Quat;\n    var wzQuat = wQuat * z2Quat;\n    // Step 1: Inlines the construction of a quaternion matrix (\'quatMat\')\n    var quatMat0 = 1 - (yyQuat + zzQuat);\n    var quatMat1 = xyQuat + wzQuat;\n    var quatMat2 = xzQuat - wyQuat;\n    var quatMat4 = xyQuat - wzQuat;\n    var quatMat5 = 1 - (xxQuat + zzQuat);\n    var quatMat6 = yzQuat + wxQuat;\n    var quatMat8 = xzQuat + wyQuat;\n    var quatMat9 = yzQuat - wxQuat;\n    var quatMat10 = 1 - (xxQuat + yyQuat);\n    // quatMat3/7/11/12/13/14 = 0, quatMat15 = 1\n\n    // Step 2: Inlines multiplication, takes advantage of constant quatMat cells\n    var a00 = matVar[0];\n    var a01 = matVar[1];\n    var a02 = matVar[2];\n    var a03 = matVar[3];\n    var a10 = matVar[4];\n    var a11 = matVar[5];\n    var a12 = matVar[6];\n    var a13 = matVar[7];\n    var a20 = matVar[8];\n    var a21 = matVar[9];\n    var a22 = matVar[10];\n    var a23 = matVar[11];\n\n    var b0  = quatMat0, b1 = quatMat1, b2 = quatMat2;\n    matVar[0] = b0 * a00 + b1 * a10 + b2 * a20;\n    matVar[1] = b0 * a01 + b1 * a11 + b2 * a21;\n    matVar[2] = b0 * a02 + b1 * a12 + b2 * a22;\n    matVar[3] = b0 * a03 + b1 * a13 + b2 * a23;\n    b0 = quatMat4; b1 = quatMat5; b2 = quatMat6;\n    matVar[4] = b0 * a00 + b1 * a10 + b2 * a20;\n    matVar[5] = b0 * a01 + b1 * a11 + b2 * a21;\n    matVar[6] = b0 * a02 + b1 * a12 + b2 * a22;\n    matVar[7] = b0 * a03 + b1 * a13 + b2 * a23;\n    b0 = quatMat8; b1 = quatMat9; b2 = quatMat10;\n    matVar[8] = b0 * a00 + b1 * a10 + b2 * a20;\n    matVar[9] = b0 * a01 + b1 * a11 + b2 * a21;\n    matVar[10] = b0 * a02 + b1 * a12 + b2 * a22;\n    matVar[11] = b0 * a03 + b1 * a13 + b2 * a23;\n  }'
};

var MatrixOpsInitial = {
  transformScale: 'function(matVar, opVar) {\n    // Scaling matVar known to be identity by opVar\n    matVar[0] = opVar[0];\n    matVar[1] = 0;\n    matVar[2] = 0;\n    matVar[3] = 0;\n    matVar[4] = 0;\n    matVar[5] = opVar[1];\n    matVar[6] = 0;\n    matVar[7] = 0;\n    matVar[8] = 0;\n    matVar[9] = 0;\n    matVar[10] = opVar[2];\n    matVar[11] = 0;\n    matVar[12] = 0;\n    matVar[13] = 0;\n    matVar[14] = 0;\n    matVar[15] = 1;\n  }',

  transformTranslate: 'function(matVar, opVar) {\n    // Translating matVar known to be identity by opVar;\n    matVar[0] = 1;\n    matVar[1] = 0;\n    matVar[2] = 0;\n    matVar[3] = 0;\n    matVar[4] = 0;\n    matVar[5] = 1;\n    matVar[6] = 0;\n    matVar[7] = 0;\n    matVar[8] = 0;\n    matVar[9] = 0;\n    matVar[10] = 1;\n    matVar[11] = 0;\n    matVar[12] = opVar[0];\n    matVar[13] = opVar[1];\n    matVar[14] = opVar[2];\n    matVar[15] = 1;\n  }',

  transformRotateRadians: 'function(matVar, q) {\n\n    // Rotating matVar which is known to be identity by q\n    var xQuat = q[0], yQuat = q[1], zQuat = q[2], wQuat = q[3];\n    var x2Quat = xQuat + xQuat;\n    var y2Quat = yQuat + yQuat;\n    var z2Quat = zQuat + zQuat;\n    var xxQuat = xQuat * x2Quat;\n    var xyQuat = xQuat * y2Quat;\n    var xzQuat = xQuat * z2Quat;\n    var yyQuat = yQuat * y2Quat;\n    var yzQuat = yQuat * z2Quat;\n    var zzQuat = zQuat * z2Quat;\n    var wxQuat = wQuat * x2Quat;\n    var wyQuat = wQuat * y2Quat;\n    var wzQuat = wQuat * z2Quat;\n    // Step 1: Inlines the construction of a quaternion matrix (\'quatMat\')\n    var quatMat0 = 1 - (yyQuat + zzQuat);\n    var quatMat1 = xyQuat + wzQuat;\n    var quatMat2 = xzQuat - wyQuat;\n    var quatMat4 = xyQuat - wzQuat;\n    var quatMat5 = 1 - (xxQuat + zzQuat);\n    var quatMat6 = yzQuat + wxQuat;\n    var quatMat8 = xzQuat + wyQuat;\n    var quatMat9 = yzQuat - wxQuat;\n    var quatMat10 = 1 - (xxQuat + yyQuat);\n    // quatMat3/7/11/12/13/14 = 0, quatMat15 = 1\n\n    // Step 2: Inlines the multiplication with identity matrix.\n    var b0  = quatMat0, b1 = quatMat1, b2 = quatMat2;\n    matVar[0] = b0;\n    matVar[1] = b1;\n    matVar[2] = b2;\n    matVar[3] = 0;\n    b0 = quatMat4; b1 = quatMat5; b2 = quatMat6;\n    matVar[4] = b0;\n    matVar[5] = b1;\n    matVar[6] = b2;\n    matVar[7] = 0;\n    b0 = quatMat8; b1 = quatMat9; b2 = quatMat10;\n    matVar[8] = b0;\n    matVar[9] = b1;\n    matVar[10] = b2;\n    matVar[11] = 0;\n    matVar[12] = 0;\n    matVar[13] = 0;\n    matVar[14] = 0;\n    matVar[15] = 1;\n  }'
};

var setNextValAndDetectChange = function setNextValAndDetectChange(name, tmpVarName) {
  return '  if (!didChange) {\n' + '    var prevVal = result.' + name + ';\n' + '    result.' + name + ' = ' + tmpVarName + ';\n' + '    didChange = didChange  || (' + tmpVarName + ' !== prevVal);\n' + '  } else {\n' + '    result.' + name + ' = ' + tmpVarName + ';\n' + '  }\n';
};

var computeNextValLinear = function computeNextValLinear(anim, from, to, tmpVarName) {
  var hasRoundRatio = 'round' in anim;
  var roundRatio = anim.round;
  var fn = '  ratio = (value - ' + anim.min + ') / ' + (anim.max - anim.min) + ';\n';
  if (!anim.extrapolate) {
    fn += '  ratio = ratio > 1 ? 1 : (ratio < 0 ? 0 : ratio);\n';
  }

  var roundOpen = hasRoundRatio ? 'Math.round(' + roundRatio + ' * ' : '';
  var roundClose = hasRoundRatio ? ') / ' + roundRatio : '';
  fn += '  ' + tmpVarName + ' = ' + roundOpen + '(' + from + ' * (1 - ratio) + ' + to + ' * ratio)' + roundClose + ';\n';
  return fn;
};

var computeNextValLinearScalar = function computeNextValLinearScalar(anim) {
  return computeNextValLinear(anim, anim.from, anim.to, 'nextScalarVal');
};

var computeNextValConstant = function computeNextValConstant(anim) {
  var constantExpression = JSON.stringify(anim.value);
  return '  nextScalarVal = ' + constantExpression + ';\n';
};

var computeNextValStep = function computeNextValStep(anim) {
  return '  nextScalarVal = value >= ' + (anim.threshold + ' ? ' + anim.to + ' : ' + anim.from) + ';\n';
};

var computeNextValIdentity = function computeNextValIdentity(anim) {
  return '  nextScalarVal = value;\n';
};

var operationVar = function operationVar(name) {
  return name + 'ReuseOp';
};

var createReusableOperationVars = function createReusableOperationVars(anims) {
  var ret = '';
  for (var name in anims) {
    if (ShouldAllocateReusableOperationVars[name]) {
      ret += 'var ' + operationVar(name) + ' = [];\n';
    }
  }
  return ret;
};

var newlines = function newlines(statements) {
  return '\n' + statements.join('\n') + '\n';
};

var computeNextMatrixOperationField = function computeNextMatrixOperationField(anim, name, dimension, index) {
  var fieldAccess = operationVar(name) + '[' + index + ']';
  if (anim.from[dimension] !== undefined && anim.to[dimension] !== undefined) {
    return '  ' + anim.from[dimension] !== anim.to[dimension] ? computeNextValLinear(anim, anim.from[dimension], anim.to[dimension], fieldAccess) : fieldAccess + ' = ' + anim.from[dimension] + ';';
  } else {
    return '  ' + fieldAccess + ' = ' + InitialOperationField[name][index] + ';';
  }
};

var unrolledVars = [];
for (var varIndex = 0; varIndex < 16; varIndex++) {
  unrolledVars.push('m' + varIndex);
}
var setNextMatrixAndDetectChange = function setNextMatrixAndDetectChange(orderedMatrixOperations) {
  var fn = ['  var transform = result.transform !== undefined ? ' + 'result.transform : (result.transform = [{ matrix: [] }]);' + '  var transformMatrix = transform[0].matrix;'];
  fn.push.apply(fn, inline(MatrixOps.unroll, ['transformMatrix'].concat(unrolledVars)));
  for (var i = 0; i < orderedMatrixOperations.length; i++) {
    var opName = orderedMatrixOperations[i];
    if (i === 0) {
      fn.push.apply(fn, inline(MatrixOpsInitial[opName], ['transformMatrix', operationVar(opName)]));
    } else {
      fn.push.apply(fn, inline(MatrixOps[opName], ['transformMatrix', operationVar(opName)]));
    }
  }
  fn.push.apply(fn, inline(MatrixOps.matrixDiffers, ['didChange', 'transformMatrix'].concat(unrolledVars)));
  return fn;
};

var InterpolateMatrix = {
  transformTranslate: true,
  transformRotateRadians: true,
  transformScale: true
};

var createFunctionString = function createFunctionString(anims) {
  var orderedMatrixOperations = [];

  var fn = 'return (function() {\n';
  fn += createReusableOperationVars(anims);
  fn += 'return function(result, value) {\n';
  fn += '  var didChange = false;\n';
  fn += '  var nextScalarVal;\n';
  fn += '  var ratio;\n';

  for (var name in anims) {
    var anim = anims[name];
    if (anim.type === 'linear') {
      if (InterpolateMatrix[name]) {
        orderedMatrixOperations.push(name);
        var setOperations = [computeNextMatrixOperationField(anim, name, X_DIM, 0), computeNextMatrixOperationField(anim, name, Y_DIM, 1), computeNextMatrixOperationField(anim, name, Z_DIM, 2)];
        if (name === TRANSFORM_ROTATE_NAME) {
          setOperations.push(computeNextMatrixOperationField(anim, name, W_DIM, 3));
        }
        fn += newlines(setOperations);
      } else {
        fn += computeNextValLinearScalar(anim, 'nextScalarVal');
        fn += setNextValAndDetectChange(name, 'nextScalarVal');
      }
    } else if (anim.type === 'constant') {
      fn += computeNextValConstant(anim);
      fn += setNextValAndDetectChange(name, 'nextScalarVal');
    } else if (anim.type === 'step') {
      fn += computeNextValStep(anim);
      fn += setNextValAndDetectChange(name, 'nextScalarVal');
    } else if (anim.type === 'identity') {
      fn += computeNextValIdentity(anim);
      fn += setNextValAndDetectChange(name, 'nextScalarVal');
    }
  }
  if (orderedMatrixOperations.length) {
    fn += newlines(setNextMatrixAndDetectChange(orderedMatrixOperations));
  }
  fn += '  return didChange;\n';
  fn += '};\n';
  fn += '})()';
  return fn;
};

var buildStyleInterpolator = function buildStyleInterpolator(anims) {
  var interpolator = null;
  function lazyStyleInterpolator(result, value) {
    if (interpolator === null) {
      interpolator = Function(createFunctionString(anims))();
    }
    return interpolator(result, value);
  }
  return lazyStyleInterpolator;
};

module.exports = buildStyleInterpolator;