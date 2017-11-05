Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CubePanoBufferGeometry = CubePanoBufferGeometry;

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);
function CubePanoBufferGeometry(size, columns, rows, expansionCoef) {
  THREE.BufferGeometry.call(this);

  columns = columns || 3;
  rows = rows || 6 / this.columns;
  expansionCoef = expansionCoef || 1.01;
  var eps = (expansionCoef - 1) / 2;

  var halfSide = size / 2;
  var vertexCount = 24;
  var vs = [5, 1, 3, 7, 0, 4, 6, 2, 6, 7, 3, 2, 0, 1, 5, 4, 4, 5, 7, 6, 1, 0, 2, 3];
  var positions = new Float32Array(vertexCount * 3);
  var uv0 = new Float32Array(vertexCount * 2);
  var indices = new Uint32Array(36);

  for (var i = 0; i < vertexCount; i++) {
    var v = vs[i];
    positions[i * 3 + 0] = ((v >> 2 & 1) * 2 - 1) * halfSide;
    positions[i * 3 + 1] = ((v >> 1 & 1) * 2 - 1) * halfSide;
    positions[i * 3 + 2] = ((v & 1) * 2 - 1) * halfSide;
  }

  var w = 1.0 / columns;
  var h = 1.0 / rows;
  var index = 0;
  for (var y = 0; y < rows; ++y) {
    for (var x = 0; x < columns; ++x) {
      var ty = rows - 1 - y;
      uv0[index + 0] = (x + eps) * w;
      uv0[index + 1] = (ty + eps) * h;

      uv0[index + 2] = (x + 1 - eps) * w;
      uv0[index + 3] = (ty + eps) * h;

      uv0[index + 4] = (x + 1 - eps) * w;
      uv0[index + 5] = (ty + 1 - eps) * h;

      uv0[index + 6] = (x + eps) * w;
      uv0[index + 7] = (ty + 1 - eps) * h;

      index += 8;
    }
  }

  index = 0;
  for (var face = 0; face < vertexCount; face += 4) {
    indices[index + 0] = face;
    indices[index + 1] = face + 1;
    indices[index + 2] = face + 2;

    indices[index + 3] = face;
    indices[index + 4] = face + 2;
    indices[index + 5] = face + 3;

    index += 6;
  }

  this.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  this.addAttribute('uv', new THREE.BufferAttribute(uv0, 2));
  this.setIndex(new THREE.BufferAttribute(indices, 1));
}

CubePanoBufferGeometry.prototype = babelHelpers.extends(Object.create(THREE.BufferGeometry.prototype), {
  constructor: CubePanoBufferGeometry,
  isCubePanoBufferGeometry: true
});