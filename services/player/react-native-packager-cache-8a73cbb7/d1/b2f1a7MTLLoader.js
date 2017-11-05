Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAndCacheMTL = fetchAndCacheMTL;
exports.removeMTLReference = removeMTLReference;

var _MTLParser = require('./MTLParser');

var _RefCountCache = require('../../Utils/RefCountCache');

var _RefCountCache2 = babelHelpers.interopRequireDefault(_RefCountCache);

var _fetchResource = require('../../Utils/fetchResource');

var _fetchResource2 = babelHelpers.interopRequireDefault(_fetchResource);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var mtlStateCache = new _RefCountCache2.default(function (url, entry) {
  for (var _name in entry) {
    entry[_name].lit.dispose();
    entry[_name].unlit.dispose();
  }
});
var mtlLoaders = {};

var MAP_TO_THREE_NAME = {
  bump: 'bumpMap',
  diffuse: 'map',
  displacement: 'displacementMap',
  emissive: 'emissiveMap',
  specular: 'specularMap'
};

function addTextureMap(directory, params, type, tex) {
  var mapParam = MAP_TO_THREE_NAME[type] || type;
  if (params[mapParam]) {
    return;
  }

  var path = directory + tex.file;
  var scale = new THREE.Vector2(tex.options.scale[0], tex.options.scale[1]);
  var offset = new THREE.Vector2(tex.options.origin[0], tex.options.origin[1]);
  if (type === 'bump') {
    if (tex.options.bumpMultiplier) {
      params.bumpScale = tex.options.bumpMultiplier;
    }
  }
  var loader = new THREE.TextureLoader(THREE.DefaultLoadingManager);
  loader.setCrossOrigin('anonymous');
  var map = loader.load(path);
  map.name = tex.file;
  map.repeat.copy(scale);
  map.offset.copy(offset);
  if (tex.options.clamp) {
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
  } else {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
  }
  params[mapParam] = map;
}

function createMaterial(url, raw) {
  var forceBasic = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var params = {
    name: raw.name
  };
  var mtlDirectory = url.substr(0, url.lastIndexOf('/') + 1);
  var isPhong = !forceBasic && raw.illum !== 0 && raw.illum !== 1;
  if (raw.specular) {
    if (isPhong) {
      params.specular = new THREE.Color(raw.specular[0], raw.specular[1], raw.specular[2]);
    }
  }
  if (raw.diffuse) {
    params.color = new THREE.Color(raw.diffuse[0], raw.diffuse[1], raw.diffuse[2]);
  }
  if (raw.emissive) {
    if (!forceBasic) {
      params.emissive = new THREE.Color(raw.emissive[0], raw.emissive[1], raw.emissive[2]);
    }
  }
  if (raw.specularExp) {
    if (!forceBasic) {
      params.shininess = raw.specularExp;
    }
  }
  if (raw.vertexColors) {
    params.vertexColors = raw.vertexColors;
  }
  if (raw.wireframe) {
    params.wireframe = raw.wireframe;
  }
  if (raw.color) {
    params.color = raw.color;
  }
  if (raw.textureMap) {
    for (var type in raw.textureMap) {
      addTextureMap(mtlDirectory, params, type, raw.textureMap[type]);
    }
  }
  if (params.ambient && !isPhong) {
    delete params.ambient;
  }

  var material = forceBasic ? new THREE.MeshBasicMaterial(params) : raw.illum === 0 || raw.illum === 1 ? new THREE.MeshLambertMaterial(params) : new THREE.MeshPhongMaterial(params);
  if (raw.opacity && raw.opacity < 1.0) {
    material.transparent = true;
    material.opacity = raw.opacity;
  }
  material.url = url;
  return material;
}

function fetchAndCacheMTL(mtl) {
  if (mtlStateCache.has(mtl)) {
    mtlStateCache.addReference(mtl);
    return Promise.resolve(mtlStateCache.get(mtl));
  }

  var mtlLoader = mtlLoaders[mtl];

  if (!mtlLoader) {
    mtlLoader = (0, _fetchResource2.default)(mtl).then(function (text) {
      return (0, _MTLParser.readMTLFile)(text);
    }).then(function (state) {
      var map = {};
      for (var _iterator = state, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var raw = _ref;

        map[raw.name] = {
          lit: createMaterial(mtl, raw, false),
          unlit: createMaterial(mtl, raw, true)
        };
      }
      return map;
    });
    mtlLoaders[mtl] = mtlLoader;
  }

  return mtlLoader.then(function (materialMap) {
    if (mtlStateCache.has(mtl)) {
      mtlStateCache.addReference(mtl);
    } else {
      mtlStateCache.addEntry(mtl, materialMap);
    }
    if (mtl in mtlLoaders) {
      delete mtlLoaders[mtl];
    }
    return materialMap;
  });
}

function removeMTLReference(key) {
  mtlStateCache.removeReference(key);
}