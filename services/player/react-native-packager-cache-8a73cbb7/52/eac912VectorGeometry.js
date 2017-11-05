
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vgRoundedBorderRectVarying = vgRoundedBorderRectVarying;
exports.vgGenerateIndicesBorder = vgGenerateIndicesBorder;
exports.VectorGeometry = VectorGeometry;

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

var VG_MOVETO = 0;
var VG_LINETO = 1;
var VG_BEZIERTO = 2;

var VG_KAPPA90 = 0.5522847493;

function vgAddPoint(geom, pt) {
  var _geom$positions;

  (_geom$positions = geom.positions).push.apply(_geom$positions, _toConsumableArray(pt));
  geom.positions.push(0);
}

function vgAddPointBorder(geom, ptA, ptB) {
  var _geom$positions2, _geom$positions3;

  (_geom$positions2 = geom.positions).push.apply(_geom$positions2, _toConsumableArray(ptA));
  geom.positions.push(0);
  (_geom$positions3 = geom.positions).push.apply(_geom$positions3, _toConsumableArray(ptB));
  geom.positions.push(0);
}

function vgTesselateBezier(geom, x1, y1, x2, y2, x3, y3, x4, y4, level) {
  if (level > 10) {
    return;
  }

  var x12 = (x1 + x2) * 0.5;
  var y12 = (y1 + y2) * 0.5;
  var x23 = (x2 + x3) * 0.5;
  var y23 = (y2 + y3) * 0.5;
  var x34 = (x3 + x4) * 0.5;
  var y34 = (y3 + y4) * 0.5;
  var x123 = (x12 + x23) * 0.5;
  var y123 = (y12 + y23) * 0.5;

  var dx = x4 - x1;
  var dy = y4 - y1;
  var d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
  var d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);

  var magSqD = (dx * dx + dy * dy) * 0.0001;

  if (magSqD <= 0 || (d2 + d3) * (d2 + d3) < magSqD) {
    vgAddPoint(geom, [x4, y4]);
    return;
  }

  var x234 = (x23 + x34) * 0.5;
  var y234 = (y23 + y34) * 0.5;
  var x1234 = (x123 + x234) * 0.5;
  var y1234 = (y123 + y234) * 0.5;

  vgTesselateBezier(geom, x1, y1, x12, y12, x123, y123, x1234, y1234, level + 1);
  vgTesselateBezier(geom, x1234, y1234, x234, y234, x34, y34, x4, y4, level + 1);
}

function vgTesselateBezierBorder(geom, x1A, y1A, x2A, y2A, x3A, y3A, x4A, y4A, x1B, y1B, x2B, y2B, x3B, y3B, x4B, y4B, level) {
  if (level > 10) {
    return;
  }

  var x12A = (x1A + x2A) * 0.5;
  var y12A = (y1A + y2A) * 0.5;
  var x23A = (x2A + x3A) * 0.5;
  var y23A = (y2A + y3A) * 0.5;
  var x34A = (x3A + x4A) * 0.5;
  var y34A = (y3A + y4A) * 0.5;
  var x123A = (x12A + x23A) * 0.5;
  var y123A = (y12A + y23A) * 0.5;

  var dxA = x4A - x1A;
  var dyA = y4A - y1A;
  var d2A = Math.abs((x2A - x4A) * dyA - (y2A - y4A) * dxA);
  var d3A = Math.abs((x3A - x4A) * dyA - (y3A - y4A) * dxA);

  var magSqD = (dxA * dxA + dyA * dyA) * 0.0001;

  if (magSqD <= 0 || (d2A + d3A) * (d2A + d3A) < magSqD) {
    vgAddPoint(geom, [x4A, y4A]);
    vgAddPoint(geom, [x4B, y4B]);
    return;
  }

  var x234A = (x23A + x34A) * 0.5;
  var y234A = (y23A + y34A) * 0.5;
  var x1234A = (x123A + x234A) * 0.5;
  var y1234A = (y123A + y234A) * 0.5;

  var x12B = (x1B + x2B) * 0.5;
  var y12B = (y1B + y2B) * 0.5;
  var x23B = (x2B + x3B) * 0.5;
  var y23B = (y2B + y3B) * 0.5;
  var x34B = (x3B + x4B) * 0.5;
  var y34B = (y3B + y4B) * 0.5;
  var x123B = (x12B + x23B) * 0.5;
  var y123B = (y12B + y23B) * 0.5;

  var x234B = (x23B + x34B) * 0.5;
  var y234B = (y23B + y34B) * 0.5;
  var x1234B = (x123B + x234B) * 0.5;
  var y1234B = (y123B + y234B) * 0.5;

  vgTesselateBezierBorder(geom, x1A, y1A, x12A, y12A, x123A, y123A, x1234A, y1234A, x1B, y1B, x12B, y12B, x123B, y123B, x1234B, y1234B, level + 1);
  vgTesselateBezierBorder(geom, x1234A, y1234A, x234A, y234A, x34A, y34A, x4A, y4A, x1234B, y1234B, x234B, y234B, x34B, y34B, x4B, y4B, level + 1);
}

function vgFlattenPaths(commands, w, h) {
  var geom = { positions: [] };
  var i = 0;
  var p = void 0,
      last = void 0;
  var cp1 = void 0,
      cp2 = void 0;
  while (i < commands.length) {
    var cmd = commands[i];
    switch (cmd) {
      case VG_MOVETO:
        p = commands[i + 1];
        vgAddPoint(geom, p);
        i += 2;
        break;
      case VG_LINETO:
        p = commands[i + 1];
        vgAddPoint(geom, p);
        i += 2;
        break;
      case VG_BEZIERTO:
        last = geom.positions.length - 1 * 3;
        cp1 = commands[i + 1];
        cp2 = commands[i + 2];
        p = commands[i + 3];
        vgTesselateBezier(geom, geom.positions[last + 0], geom.positions[last + 1], cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1], 0);
        i += 4;
        break;
    }
  }
  if (geom.length > 1) {
    var last_pt = geom.positions.length - 1 * 3;
    var dx = geom.positions[last_pt + 0] - geom.positions[0];
    var dy = geom.positions[last_pt + 1] - geom.positions[1];
    var dist = dx * dx + dy * dy;
    if (dist < 0.001) {
      geom.length -= 1;
    }
  }

  var uvs = [];
  if (w > 0 && h > 0) {
    for (var _i = 0; _i < geom.positions.length; _i += 3) {
      uvs.push(geom.positions[_i + 0] / w + 0.5);
      uvs.push(geom.positions[_i + 1] / h + 0.5);
    }
  } else {
    for (var _i2 = 0; _i2 < geom.positions.length; _i2 += 3) {
      uvs.push(0);
      uvs.push(0);
    }
  }
  geom.uvs = uvs;
  return geom;
}

function vgFlattenPathsBorder(commands, w, h) {
  var geom = { positions: [] };
  var i = 0;
  var pA = void 0,
      lastA = void 0;
  var pB = void 0,
      lastB = void 0;
  var cp1A = void 0,
      cp2A = void 0;
  var cp1B = void 0,
      cp2B = void 0;
  while (i < commands.length) {
    var cmd = commands[i];
    switch (cmd) {
      case VG_MOVETO:
        pA = commands[i + 1];
        i += 2;
        pB = commands[i + 1];
        vgAddPointBorder(geom, pA, pB);
        i += 2;
        break;
      case VG_LINETO:
        pA = commands[i + 1];
        i += 2;
        pB = commands[i + 1];
        vgAddPointBorder(geom, pA, pB);
        i += 2;
        break;
      case VG_BEZIERTO:
        lastA = geom.positions.length - 2 * 3;
        lastB = geom.positions.length - 1 * 3;
        cp1A = commands[i + 1];
        cp2A = commands[i + 2];
        pA = commands[i + 3];
        i += 4;
        cp1B = commands[i + 1];
        cp2B = commands[i + 2];
        pB = commands[i + 3];
        vgTesselateBezierBorder(geom, geom.positions[lastA + 0], geom.positions[lastA + 1], cp1A[0], cp1A[1], cp2A[0], cp2A[1], pA[0], pA[1], geom.positions[lastB + 0], geom.positions[lastB + 1], cp1B[0], cp1B[1], cp2B[0], cp2B[1], pB[0], pB[1], 0);
        i += 4;
        break;
    }
  }

  var uvs = [];
  if (w > 0 && h > 0) {
    for (var _i3 = 0; _i3 < geom.positions.length; _i3 += 3) {
      uvs.push(geom.positions[_i3 + 0] / w + 0.5);
      uvs.push(geom.positions[_i3 + 1] / h + 0.5);
    }
  } else {
    for (var _i4 = 0; _i4 < geom.positions.length; _i4 += 3) {
      uvs.push(0);
      uvs.push(0);
    }
  }
  geom.uvs = uvs;
  return geom;
}

function vgRect(x, y, w, h) {
  var vals = [VG_MOVETO, [x, y], VG_LINETO, [x, y + h], VG_LINETO, [x + w, y + h], VG_LINETO, [x + w, y]];
  return vgFlattenPaths(vals, w, h);
}

function vgRoundedRectVarying(x, y, w, h, radBottomRight, radBottomLeft, radTopLeft, radTopRight) {
  if (radTopLeft < 0.001 && radTopRight < 0.001 && radBottomRight < 0.001 && radBottomLeft < 0.001) {
    return vgRect(x, y, w, h);
  } else {
    var halfw = Math.abs(w) * 0.5;
    var halfh = Math.abs(h) * 0.5;
    var rxBL = Math.min(radBottomLeft, halfw);
    var ryBL = Math.min(radBottomLeft, halfh);
    var rxBR = Math.min(radBottomRight, halfw);
    var ryBR = Math.min(radBottomRight, halfh);
    var rxTR = Math.min(radTopRight, halfw);
    var ryTR = Math.min(radTopRight, halfh);
    var rxTL = Math.min(radTopLeft, halfw);
    var ryTL = Math.min(radTopLeft, halfh);
    var vals = [VG_MOVETO, [x, y + ryTL], VG_LINETO, [x, y + h - ryBL], VG_BEZIERTO, [x, y + h - ryBL * (1 - VG_KAPPA90)], [x + rxBL * (1 - VG_KAPPA90), y + h], [x + rxBL, y + h], VG_LINETO, [x + w - rxBR, y + h], VG_BEZIERTO, [x + w - rxBR * (1 - VG_KAPPA90), y + h], [x + w, y + h - ryBR * (1 - VG_KAPPA90)], [x + w, y + h - ryBR], VG_LINETO, [x + w, y + ryTR], VG_BEZIERTO, [x + w, y + ryTR * (1 - VG_KAPPA90)], [x + w - rxTR * (1 - VG_KAPPA90), y], [x + w - rxTR, y], VG_LINETO, [x + rxTL, y], VG_BEZIERTO, [x + rxTL * (1 - VG_KAPPA90), y], [x, y + ryTL * (1 - VG_KAPPA90)], [x, y + ryTL]];
    return vgFlattenPaths(vals, w, h);
  }
}

function vgGenerateIndicesConvex(length) {
  var indices = [];
  for (var i = 2; i < length; i++) {
    indices.push(0);
    indices.push(i - 1);
    indices.push(i);
  }
  return indices;
}

function vgRoundedBorderRectVarying(baseX, baseY, width, height, borderLeft, borderBottom, borderRight, borderTop, radBottomRight, radBottomLeft, radTopLeft, radTopRight) {
  var x = Math.min(width, borderLeft);
  var w = Math.max(x, width - borderRight) - x;
  var y = Math.min(height, borderTop);
  var h = Math.max(y, height - borderBottom) - y;
  if (radTopLeft < 0.001 && radTopRight < 0.001 && radBottomRight < 0.001 && radBottomLeft < 0.001) {
    var vals = [VG_MOVETO, [baseX, baseY], VG_MOVETO, [baseX + x, baseY + y], VG_LINETO, [baseX, baseY + height], VG_LINETO, [baseX + x, baseY + y + h], VG_LINETO, [baseX + width, baseY + height], VG_LINETO, [baseX + x + w, baseY + y + h], VG_LINETO, [baseX + width, baseY], VG_LINETO, [baseX + x + w, baseY + y]];
    return vgFlattenPathsBorder(vals);
  } else {
    var halfWidth = width * 0.5;
    var halfHeight = height * 0.5;
    var halfW = w * 0.5;
    var halfH = h * 0.5;
    var rxBLOuter = Math.min(radBottomLeft, halfWidth);
    var ryBLOuter = Math.min(radBottomLeft, halfHeight);
    var rxBROuter = Math.min(radBottomRight, halfWidth);
    var ryBROuter = Math.min(radBottomRight, halfHeight);
    var rxTROuter = Math.min(radTopRight, halfWidth);
    var ryTROuter = Math.min(radTopRight, halfHeight);
    var rxTLOuter = Math.min(radTopLeft, halfWidth);
    var ryTLOuter = Math.min(radTopLeft, halfHeight);
    var rxBLInner = Math.min(radBottomLeft, halfW);
    var ryBLInner = Math.min(radBottomLeft, halfH);
    var rxBRInner = Math.min(radBottomRight, halfW);
    var ryBRInner = Math.min(radBottomRight, halfH);
    var rxTRInner = Math.min(radTopRight, halfW);
    var ryTRInner = Math.min(radTopRight, halfH);
    var rxTLInner = Math.min(radTopLeft, halfW);
    var ryTLInner = Math.min(radTopLeft, halfH);

    var _vals = [VG_MOVETO, [baseX, baseY + ryTLOuter], VG_MOVETO, [baseX + x, baseY + y + ryTLInner], VG_LINETO, [baseX, baseY + height - ryBLOuter], VG_LINETO, [baseX + x, baseY + y + h - ryBLInner], VG_BEZIERTO, [baseX, baseY + height - ryBLOuter * (1 - VG_KAPPA90)], [baseX + rxBLOuter * (1 - VG_KAPPA90), baseY + height], [baseX + rxBLOuter, baseY + height], VG_BEZIERTO, [baseX + x, baseY + y + h - ryBLInner * (1 - VG_KAPPA90)], [baseX + x + rxBLInner * (1 - VG_KAPPA90), baseY + y + h], [baseX + x + rxBLInner, baseY + y + h], VG_LINETO, [baseX + width - rxBROuter, baseY + height], VG_LINETO, [baseX + x + w - rxBRInner, baseY + y + h], VG_BEZIERTO, [baseX + width - rxBROuter * (1 - VG_KAPPA90), baseY + height], [baseX + width, baseY + height - ryBROuter * (1 - VG_KAPPA90)], [baseX + width, baseY + height - ryBROuter], VG_BEZIERTO, [baseX + x + w - rxBRInner * (1 - VG_KAPPA90), baseY + y + h], [baseX + x + w, baseY + y + h - ryBRInner * (1 - VG_KAPPA90)], [baseX + x + w, baseY + y + h - ryBRInner], VG_LINETO, [baseX + width, baseY + ryTROuter], VG_LINETO, [baseX + x + w, baseY + y + ryTRInner], VG_BEZIERTO, [baseX + width, baseY + ryTROuter * (1 - VG_KAPPA90)], [baseX + width - rxTROuter * (1 - VG_KAPPA90), baseY], [baseX + width - rxTROuter, baseY], VG_BEZIERTO, [baseX + x + w, baseY + y + ryTRInner * (1 - VG_KAPPA90)], [baseX + x + w - rxTRInner * (1 - VG_KAPPA90), baseY + y], [baseX + x + w - rxTRInner, baseY + y], VG_LINETO, [baseX + rxTLOuter, baseY], VG_LINETO, [baseX + x + rxTLInner, baseY + y], VG_BEZIERTO, [baseX + rxTLOuter * (1 - VG_KAPPA90), baseY], [baseX, baseY + ryTLOuter * (1 - VG_KAPPA90)], [baseX, baseY + ryTLOuter], VG_BEZIERTO, [baseX + x + rxTLInner * (1 - VG_KAPPA90), baseY + y], [baseX + x, baseY + y + ryTLInner * (1 - VG_KAPPA90)], [baseX + x, baseY + y + ryTLInner]];
    return vgFlattenPathsBorder(_vals);
  }
}

function vgGenerateIndicesBorder(offset, length) {
  var indices = [];
  for (var i = 0; i < length; i += 2) {
    var nexti = (i + 2) % length;
    indices.push(i + offset);
    indices.push(nexti + offset);
    indices.push(i + 1 + offset);
    indices.push(i + 1 + offset);
    indices.push(nexti + offset);
    indices.push(nexti + 1 + offset);
  }
  return indices;
}

function VectorGeometry(dims, borderWidth, borderRadius, backgroundIndex, foregroundIndex, borderIndex) {
  _ThreeShim2.default.BufferGeometry.apply(this);

  dims = dims || [1, 1];

  var geom = vgRoundedRectVarying(-dims[0] * 0.5, -dims[1] * 0.5, dims[0], dims[1], borderRadius[0], borderRadius[1], borderRadius[2], borderRadius[3]);
  var indices = vgGenerateIndicesConvex(geom.positions.length / 3);
  var baseIndices = indices.length;
  if (borderWidth) {
    var borderGeom = vgRoundedBorderRectVarying(-dims[0] * 0.5, -dims[1] * 0.5, dims[0], dims[1], borderWidth[0], borderWidth[1], borderWidth[2], borderWidth[3], borderRadius[0], borderRadius[1], borderRadius[2], borderRadius[3]);
    var borderIndices = vgGenerateIndicesBorder(geom.positions.length / 3, borderGeom.positions.length / 3);
    geom.positions = geom.positions.concat(borderGeom.positions);
    geom.uvs = geom.uvs.concat(borderGeom.uvs);
    indices = indices.concat(borderIndices);
  }

  this.addAttribute('position', new _ThreeShim2.default.BufferAttribute(new Float32Array(geom.positions), 3));
  this.addAttribute('uv', new _ThreeShim2.default.BufferAttribute(new Float32Array(geom.uvs), 2));
  this.addGroup(0, baseIndices, backgroundIndex);
  this.addGroup(0, baseIndices, foregroundIndex);
  if (borderWidth) {
    this.addGroup(baseIndices, indices.length - baseIndices, borderIndex);
  }
  this.setIndex(new _ThreeShim2.default.BufferAttribute(new Uint32Array(indices), 1));
  this.needsUpdate = true;
  this.computeBoundingSphere();
}

VectorGeometry.prototype = Object.create(_ThreeShim2.default.BufferGeometry.prototype);
VectorGeometry.prototype.constructor = VectorGeometry;