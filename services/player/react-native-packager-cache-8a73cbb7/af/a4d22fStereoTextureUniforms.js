
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var StereoTextureUniforms = function StereoTextureUniforms() {
  _classCallCheck(this, StereoTextureUniforms);

  this.stereoOffsetRepeat = {
    dynamic: true,
    type: 'f',
    value: null,
    onUpdateCallback: function onUpdateCallback(object, camera) {
      if (camera.viewID === 1 && object.material.stereoOffsetRepeats[1]) {
        this.value = object.material.stereoOffsetRepeats[1];
      } else {
        this.value = object.material.stereoOffsetRepeats[0];
      }
    }
  };
};

exports.default = StereoTextureUniforms;