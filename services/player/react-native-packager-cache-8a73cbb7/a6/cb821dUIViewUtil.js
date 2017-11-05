
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setParams = setParams;
exports.defaultScaleType = defaultScaleType;
exports.resizeModetoScaleType = resizeModetoScaleType;

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function setParams(object, params) {
  if (params === undefined) {
    return;
  }

  for (var key in params) {
    var func = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    if (typeof object[func] !== 'function') {
      console.warn('"' + func + '" is not a function of UIView.');
      continue;
    }

    var newValue = params[key];
    object[func](newValue);
  }
}

var ScaleFitCenter = {
  getScaleParams: function getScaleParams(dims, textureDim, inset, insetSize, borderWidth) {
    dims = dims || [1, 1];
    textureDim = textureDim || [0, 0];
    var scaledDims = [].concat(_toConsumableArray(dims));
    if (dims[0] > 0 && dims[1] > 0 && textureDim[0] > 0 && textureDim[1] > 0) {
      var scale = [dims[0] / textureDim[0], dims[1] / textureDim[1]];
      var minScale = Math.min(scale[0], scale[1]);
      scaledDims = [textureDim[0] * minScale, textureDim[1] * minScale];
    }
    return {
      dims: scaledDims,
      border: {
        cssBorderWidth: borderWidth,
        originalDim: dims
      },
      cropUV: [0, 0, 1, 1]
    };
  }
};

var ScaleFixXY = {
  getScaleParams: function getScaleParams(dims, textureDim, inset, insetSize, borderWidth) {
    dims = dims || [1, 1];
    textureDim = textureDim || [0, 0];
    return {
      dims: dims,
      border: {
        texture: inset,
        factor: [insetSize[0] / dims[0], insetSize[1] / dims[1], insetSize[2] / dims[0], insetSize[3] / dims[1]],
        cssBorderWidth: borderWidth
      },
      cropUV: [0, 0, 1, 1]
    };
  }
};

var ScaleCenterCrop = {
  getScaleParams: function getScaleParams(dims, textureDim, inset, insetSize, borderWidth) {
    dims = dims || [1, 1];
    textureDim = textureDim || [0, 0];
    var cropOffset = [0, 0];
    if (dims[0] > 0 && dims[1] > 0 && textureDim[0] > 0 && textureDim[1] > 0) {
      var scale = [textureDim[0] / dims[0], textureDim[1] / dims[1]];
      var minScale = Math.min(scale[0], scale[1]);
      cropOffset = [(1 - dims[0] * minScale / textureDim[0]) / 2, (1 - dims[1] * minScale / textureDim[1]) / 2];
    }
    return {
      dims: dims,
      border: {
        cssBorderWidth: borderWidth
      },
      cropUV: [cropOffset[0], cropOffset[1], 1 - cropOffset[0], 1 - cropOffset[1]]
    };
  }
};

var ScaleType = exports.ScaleType = {
  FIT_CENTER: ScaleFitCenter,
  FIT_XY: ScaleFixXY,
  CENTER_CROP: ScaleCenterCrop
};

function defaultScaleType() {
  return ScaleType.FIT_XY;
}

function resizeModetoScaleType(resizeModeValue) {
  if (resizeModeValue === 'contain') {
    return ScaleType.FIT_CENTER;
  } else if (resizeModeValue === 'cover') {
    return ScaleType.CENTER_CROP;
  } else if (resizeModeValue === 'stretch') {
    return ScaleType.FIT_XY;
  } else if (resizeModeValue === 'center') {
    return ScaleType.FIT_CENTER;
  } else if (resizeModeValue == null) {
    return defaultScaleType();
  } else {
    console.error("Invalid resize mode: '" + resizeModeValue + "'");
    return defaultScaleType();
  }
}

var PointerEvents = exports.PointerEvents = {
  AUTO: 'auto',
  NONE: 'none',
  BOX_NONE: 'box-none',
  BOX_ONLY: 'box-only'
};