Object.defineProperty(exports, "__esModule", {
  value: true
});

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


var StereoOffsetRepeats = {
  '2D': [new THREE.Vector4(0, 0, 1, 1)],

  TOP_BOTTOM_3D: [new THREE.Vector4(0, 0.5, 1, 0.5), new THREE.Vector4(0, 0, 1, 0.5)],

  BOTTOM_TOP_3D: [new THREE.Vector4(0, 0, 1, 0.5), new THREE.Vector4(0, 0.5, 1, 0.5)],

  LEFT_RIGHT_3D: [new THREE.Vector4(0, 0, 0.5, 1), new THREE.Vector4(0.5, 0, 0.5, 1)],

  RIGHT_LEFT_3D: [new THREE.Vector4(0.5, 0, 0.5, 1), new THREE.Vector4(0, 0, 0.5, 1)]
};

exports.default = StereoOffsetRepeats;