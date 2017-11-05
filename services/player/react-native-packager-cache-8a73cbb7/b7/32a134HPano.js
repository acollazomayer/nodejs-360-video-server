Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HPanoBufferGeometry = HPanoBufferGeometry;

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


function sign(value) {
  return value < 0;
}

function clipLinePlane(plane, p0, p1, uv0, uv1) {
  var d0 = p0.x * plane[0] + p0.y * plane[1] + p0.z * plane[2] + p0.w * plane[3];
  var d1 = p1.x * plane[0] + p1.y * plane[1] + p1.z * plane[2] + p1.w * plane[3];
  if (d0 < 0 && d1 < 0) {
    return true;
  }
  if (sign(d0) !== sign(d1)) {
    if (d0 < 0) {
      var dx = p1.x - p0.x;
      var dy = p1.y - p0.y;
      var dz = p1.z - p0.z;
      var dw = p1.w - p0.w;
      var du = uv1[0] - uv0[0];
      var dv = uv1[1] - uv0[1];
      var f = -d0 / (d1 - d0);
      p0.x += dx * f;
      p0.y += dy * f;
      p0.z += dz * f;
      p0.w += dw * f;
      uv0[0] += du * f;
      uv0[1] += dv * f;
    } else {
      var _dx = p0.x - p1.x;
      var _dy = p0.y - p1.y;
      var _dz = p0.z - p1.z;
      var _dw = p0.w - p1.w;
      var _du = uv0[0] - uv1[0];
      var _dv = uv0[1] - uv1[1];
      var _f = -d1 / (d0 - d1);
      p1.x += _dx * _f;
      p1.y += _dy * _f;
      p1.z += _dz * _f;
      p1.w += _dw * _f;
      uv1[0] += _du * _f;
      uv1[1] += _dv * _f;
    }
  }
  return false;
}

var clipLineToFrustum = function () {
  var p0 = new THREE.Vector4();
  var p1 = new THREE.Vector4();

  return function (ctx, pnt0, pnt1, uv0, uv1, projectionMatrix) {
    p0.fromArray([pnt0[0], pnt0[1], pnt0[2], 1]);
    p0.applyMatrix4(projectionMatrix);
    p1.fromArray([pnt1[0], pnt1[1], pnt1[2], 1]);
    p1.applyMatrix4(projectionMatrix);
    var clipped = false;
    clipped = clipped || clipLinePlane([1, 0, 1, 0], p0, p1, uv0, uv1);
    clipped = clipped || clipLinePlane([-1, 0, 1, 0], p0, p1, uv0, uv1);
    clipped = clipped || clipLinePlane([0, 1, 1, 0], p0, p1, uv0, uv1);
    clipped = clipped || clipLinePlane([0, -1, 1, 0], p0, p1, uv0, uv1);
    if (!clipped) {
      var px0 = [p0.x / p0.w * 512, p0.y / p0.w * 512];
      var px1 = [p1.x / p1.w * 512, p1.y / p1.w * 512];
      var dpxX = px1[0] - px0[0];
      var dpxY = px1[1] - px0[1];
      var px = Math.sqrt(dpxX * dpxX + dpxY * dpxY);
      var dU = uv1[0] - uv0[0];
      var dV = uv1[1] - uv0[1];
      var uv = Math.sqrt(dU * dU + dV * dV);
      var texelPerPixel = uv / px;
      ctx.texelPerPixel = Math.min(ctx.texelPerPixel, texelPerPixel);
    }
    return clipped;
  };
}();

function zeroPrepend(str) {
  if (str.length === 1) {
    return '0' + str;
  }
  return str;
}

var HPANO_MAP_UNLOADED = 0;
var HPANO_MAP_LOADING = 1;
var HPANO_MAP_LOADED = 2;

function HPanoBufferGeometry(rad, maxLevels, baseurl) {
  THREE.BufferGeometry.call(this);

  this.dirty = true;
  this.type = 'HPanoBufferGeometry';
  this.material = new THREE.MultiMaterial();
  this.materialsCached = {};
  this.rad = rad;
  this.baseurl = baseurl;

  this.update(maxLevels);
}

HPanoBufferGeometry.prototype = babelHelpers.extends(Object.create(THREE.BufferGeometry.prototype), {
  constructor: HPanoBufferGeometry,

  isHPanoBufferGeometry: true,

  dispose: function dispose() {
    THREE.BufferGeometry.prototype.dispose();
    for (var i in this.material.materials) {
      this.material.materials[i].map && this.material.materials[i].map.dispose();
      this.material.materials[i].map = null;
      this.material.materials[i].dispose();
    }
    this.material.materials = [];
    this.materialsCached = {};
  },

  update: function update(maxLevels, projectionMatrix) {
    this.dirty = false;

    if (this.boundingSphere === null) {
      this.boundingSphere = new THREE.Sphere();
    }
    this.boundingSphere.radius = Math.sqrt(3 * this.rad * this.rad);

    var quadCount = Math.pow(4, maxLevels) * 6;
    var vertCount = quadCount * 4;
    if (this.quadCount !== quadCount) {
      this.quadCount = quadCount;
      this.positions = new Float32Array(vertCount * 3);
      this.uvs = new Float32Array(vertCount * 2);
      this.indices = new Uint16Array(quadCount * 6);
      this.setIndex(new THREE.BufferAttribute(this.indices, 1).setDynamic(true));
      this.addAttribute('position', new THREE.BufferAttribute(this.positions, 3).setDynamic(true));
      this.addAttribute('uv', new THREE.BufferAttribute(this.uvs, 2).setDynamic(true));
    }
    var positions = this.positions;
    var uvs = this.uvs;
    var indices = this.indices;

    var context = {
      offsetPosition: 0,
      offsetUV: 0,
      offsetIndices: 0
    };

    for (var i in this.material.materials) {
      this.material.materials[i].referenced = false;
    }

    this.clearGroups();
    var geom = this;

    function fillQuad(ctx, tl, tr, bl, br, tile, side, level) {
      var file = geom.baseurl.replace('%l', (level + 1).toString()).replace('%s', side).replace('%h', (tile[0] + 1).toString()).replace('%v', (tile[1] + 1).toString()).replace('%0h', zeroPrepend((tile[0] + 1).toString())).replace('%0v', zeroPrepend((tile[1] + 1).toString())).replace('%t0', (tile[0] + 1).toString()).replace('%t1', (tile[1] + 1).toString()).replace('%0t0', zeroPrepend((tile[0] + 1).toString())).replace('%0t1', zeroPrepend((tile[1] + 1).toString()));
      var mtr = geom.materialsCached[file];
      var divide = false;
      if (projectionMatrix) {
        var _ctx = { texelPerPixel: 1 };
        var anyVisible = false;
        anyVisible |= !clipLineToFrustum(_ctx, tl, br, [0, 0], [tileSize, tileSize], projectionMatrix);
        anyVisible |= !clipLineToFrustum(_ctx, tl, tr, [0, 0], [0, tileSize], projectionMatrix);
        anyVisible |= !clipLineToFrustum(_ctx, tr, br, [tileSize, 0], [tileSize, tileSize], projectionMatrix);
        anyVisible |= !clipLineToFrustum(_ctx, br, bl, [tileSize, tileSize], [0, 0], projectionMatrix);
        anyVisible |= !clipLineToFrustum(_ctx, bl, tl, [0, 0], [0, tileSize], projectionMatrix);
        if (anyVisible) {
          divide = _ctx.texelPerPixel < 1;
        }
      }
      if (!mtr) {
        mtr = new THREE.MeshBasicMaterial({
          wireframe: false,
          depthWrite: false,
          color: ['white', 'green', 'blue'][level],
          side: THREE.DoubleSide
        });
        mtr.loadState = HPANO_MAP_UNLOADED;
        geom.materialsCached[file] = mtr;
        mtr.index = geom.material.materials.length;
        mtr.level = level;
        geom.material.materials.push(mtr);
      }

      var addQuad = false;
      if (mtr.loadState !== HPANO_MAP_LOADED || level === maxLevels || !divide) {
        if (mtr.loadState === HPANO_MAP_UNLOADED) {
          mtr.loadState = HPANO_MAP_LOADING;
          var loader = new THREE.TextureLoader();
          loader.load(file, function (texture) {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;

            if (mtr.loadState === HPANO_MAP_LOADING) {
              mtr.map = texture;
              mtr.needsUpdate = true;
              mtr.loadState = HPANO_MAP_LOADED;
            }
            geom.dirty = true;
          }, undefined, function () {
            console.log('failed to load ' + file);
          });
        }
        mtr.referenced = true;
        addQuad = true;
      } else {
        var mid_tlbr = [(tl[0] + br[0]) / 2, (tl[1] + br[1]) / 2, (tl[2] + br[2]) / 2];
        var mid_tltr = [(tl[0] + tr[0]) / 2, (tl[1] + tr[1]) / 2, (tl[2] + tr[2]) / 2];
        var mid_blbr = [(bl[0] + br[0]) / 2, (bl[1] + br[1]) / 2, (bl[2] + br[2]) / 2];
        var mid_tlbl = [(tl[0] + bl[0]) / 2, (tl[1] + bl[1]) / 2, (tl[2] + bl[2]) / 2];
        var mid_trbr = [(tr[0] + br[0]) / 2, (tr[1] + br[1]) / 2, (tr[2] + br[2]) / 2];
        var valid = true;
        valid &= fillQuad(ctx, tl, mid_tltr, mid_tlbl, mid_tlbr, [tile[0] * 2, tile[1] * 2], side, level + 1);
        valid &= fillQuad(ctx, mid_tltr, tr, mid_tlbr, mid_trbr, [tile[0] * 2 + 1, tile[1] * 2], side, level + 1);
        valid &= fillQuad(ctx, mid_tlbl, mid_tlbr, bl, mid_blbr, [tile[0] * 2, tile[1] * 2 + 1], side, level + 1);
        valid &= fillQuad(ctx, mid_tlbr, mid_trbr, mid_blbr, br, [tile[0] * 2 + 1, tile[1] * 2 + 1], side, level + 1);

        mtr.referenced = true;

        if (!valid) {
          addQuad = true;
        }
      }

      if (addQuad && mtr.loadState === HPANO_MAP_LOADED) {
        geom.addGroup(ctx.offsetIndices, 6, mtr.index);
        positions[ctx.offsetPosition + 0] = tl[0];
        positions[ctx.offsetPosition + 1] = tl[1];
        positions[ctx.offsetPosition + 2] = tl[2];

        positions[ctx.offsetPosition + 3] = tr[0];
        positions[ctx.offsetPosition + 4] = tr[1];
        positions[ctx.offsetPosition + 5] = tr[2];

        positions[ctx.offsetPosition + 6] = bl[0];
        positions[ctx.offsetPosition + 7] = bl[1];
        positions[ctx.offsetPosition + 8] = bl[2];

        positions[ctx.offsetPosition + 9] = br[0];
        positions[ctx.offsetPosition + 10] = br[1];
        positions[ctx.offsetPosition + 11] = br[2];

        uvs[ctx.offsetUV + 0] = 0;
        uvs[ctx.offsetUV + 1] = 1;

        uvs[ctx.offsetUV + 2] = 1;
        uvs[ctx.offsetUV + 3] = 1;

        uvs[ctx.offsetUV + 4] = 0;
        uvs[ctx.offsetUV + 5] = 0;

        uvs[ctx.offsetUV + 6] = 1;
        uvs[ctx.offsetUV + 7] = 0;

        var index = ctx.offsetPosition / 3;
        indices[ctx.offsetIndices + 0] = index + 0;
        indices[ctx.offsetIndices + 1] = index + 1;
        indices[ctx.offsetIndices + 2] = index + 3;

        indices[ctx.offsetIndices + 3] = index + 0;
        indices[ctx.offsetIndices + 4] = index + 3;
        indices[ctx.offsetIndices + 5] = index + 2;

        ctx.offsetPosition += 12;
        ctx.offsetUV += 8;
        ctx.offsetIndices += 6;
      }
      return mtr.loadState === HPANO_MAP_LOADED;
    }
    var tileSize = 1024;
    var rad = this.rad;
    fillQuad(context, [-rad, rad, -rad], [rad, rad, -rad], [-rad, -rad, -rad], [rad, -rad, -rad], [0, 0], 'f', 0);
    fillQuad(context, [rad, rad, rad], [-rad, rad, rad], [rad, -rad, rad], [-rad, -rad, rad], [0, 0], 'b', 0);
    fillQuad(context, [rad, rad, -rad], [rad, rad, rad], [rad, -rad, -rad], [rad, -rad, rad], [0, 0], 'r', 0);
    fillQuad(context, [-rad, rad, rad], [-rad, rad, -rad], [-rad, -rad, rad], [-rad, -rad, -rad], [0, 0], 'l', 0);
    fillQuad(context, [-rad, -rad, -rad], [rad, -rad, -rad], [-rad, -rad, rad], [rad, -rad, rad], [0, 0], 'd', 0);
    fillQuad(context, [-rad, rad, rad], [rad, rad, rad], [-rad, rad, -rad], [rad, rad, -rad], [0, 0], 'u', 0);

    this.getAttribute('position').needsUpdate = true;
    this.getAttribute('uv').needsUpdate = true;
    this.getIndex().needsUpdate = true;

    for (var _i in this.materialsCached) {
      var mtr = this.materialsCached[_i];
      if (mtr.level > 0 && !mtr.referenced && mtr.map) {
        mtr.map && mtr.map.dispose();
        mtr.map = null;
        mtr.loadState = HPANO_MAP_UNLOADED;
      }
    }
  }
});