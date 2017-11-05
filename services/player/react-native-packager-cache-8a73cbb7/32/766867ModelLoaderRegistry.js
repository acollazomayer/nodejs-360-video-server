Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerModelLoader = registerModelLoader;
exports.createModelInstance = createModelInstance;

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _ObjModelLoader = require('../Loaders/ObjModelLoader');

var _ObjModelLoader2 = babelHelpers.interopRequireDefault(_ObjModelLoader);

var modelLoaders = [];

function registerModelLoader(modelLoader) {
  modelLoaders.push(modelLoader);
}

function createModelInstance(modelDefinition, parent, litMaterial, unlitMaterial) {
  if (!modelLoaders) {
    return null;
  }
  for (var index = 0; index < modelLoaders.length; index++) {
    if (modelLoaders[index].canLoad(modelDefinition)) {
      return modelLoaders[index].createInstance(modelDefinition, parent, litMaterial, unlitMaterial);
    }
  }
  return null;
}

registerModelLoader(new _ObjModelLoader2.default());