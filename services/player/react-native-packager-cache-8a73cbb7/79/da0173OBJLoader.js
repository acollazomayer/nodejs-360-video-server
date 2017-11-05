Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAndCacheOBJ = fetchAndCacheOBJ;
exports.removeOBJReference = removeOBJReference;

var _OBJParser = require('./OBJParser');

var _RefCountCache = require('../../Utils/RefCountCache');

var _RefCountCache2 = babelHelpers.interopRequireDefault(_RefCountCache);

var _fetchResource = require('../../Utils/fetchResource');

var _fetchResource2 = babelHelpers.interopRequireDefault(_fetchResource);

var objStateCache = new _RefCountCache2.default();
var objLoaders = {};

function fetchAndCacheOBJ(obj) {
  if (objStateCache.has(obj)) {
    objStateCache.addReference(obj);
    return Promise.resolve(objStateCache.get(obj));
  }

  var objLoader = objLoaders[obj];

  if (!objLoader) {
    objLoader = (0, _fetchResource2.default)(obj).then(function (text) {
      return (0, _OBJParser.readOBJFile)(text);
    });
    objLoaders[obj] = objLoader;
  }

  return objLoader.then(function (state) {
    if (objStateCache.has(obj)) {
      objStateCache.addReference(obj);
    } else {
      objStateCache.addEntry(obj, state);
    }

    if (obj in objLoaders) {
      delete objLoaders[obj];
    }
    return state;
  });
}

function removeOBJReference(key) {
  objStateCache.removeReference(key);
}