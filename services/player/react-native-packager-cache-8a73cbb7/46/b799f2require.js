

'use strict';

global.require = _require;
global.__d = define;

var modules = Object.create(null);
if (__DEV__) {
  var verboseNamesToModuleIds = Object.create(null);
}

function define(factory, moduleId, dependencyMap) {
  if (moduleId in modules) {
    return;
  }
  modules[moduleId] = {
    dependencyMap: dependencyMap,
    exports: undefined,
    factory: factory,
    hasError: false,
    isInitialized: false
  };
  if (__DEV__) {
    modules[moduleId].hot = createHotReloadingObject();

    var _verboseName = arguments[3];
    if (_verboseName) {
      modules[moduleId].verboseName = _verboseName;
      verboseNamesToModuleIds[_verboseName] = moduleId;
    }
  }
}

function _require(moduleId) {
  if (__DEV__ && typeof moduleId === 'string') {
    var _verboseName2 = moduleId;
    moduleId = verboseNamesToModuleIds[moduleId];
    if (moduleId == null) {
      throw new Error('Unknown named module: \'' + _verboseName2 + '\'');
    } else {
      console.warn('Requiring module \'' + _verboseName2 + '\' by name is only supported for ' + 'debugging purposes and will BREAK IN PRODUCTION!');
    }
  }

  var moduleIdReallyIsNumber = moduleId;
  var module = modules[moduleIdReallyIsNumber];
  return module && module.isInitialized ? module.exports : guardedLoadModule(moduleIdReallyIsNumber, module);
}

var inGuard = false;
function guardedLoadModule(moduleId, module) {
  if (!inGuard && global.ErrorUtils) {
    inGuard = true;
    var returnValue = void 0;
    try {
      returnValue = loadModuleImplementation(moduleId, module);
    } catch (e) {
      global.ErrorUtils.reportFatalError(e);
    }
    inGuard = false;
    return returnValue;
  } else {
    return loadModuleImplementation(moduleId, module);
  }
}

function loadModuleImplementation(moduleId, module) {
  var nativeRequire = global.nativeRequire;
  if (!module && nativeRequire) {
    nativeRequire(moduleId);
    module = modules[moduleId];
  }

  if (!module) {
    throw unknownModuleError(moduleId);
  }

  if (module.hasError) {
    throw moduleThrewError(moduleId);
  }

  if (__DEV__) {
    var Systrace = _require.Systrace;
  }

  module.isInitialized = true;
  var exports = module.exports = {};
  var _module = module,
      factory = _module.factory,
      dependencyMap = _module.dependencyMap;

  try {
    if (__DEV__) {
      Systrace.beginEvent('JS_require_' + (module.verboseName || moduleId));
    }

    var _moduleObject = { exports: exports };
    if (__DEV__ && module.hot) {
      _moduleObject.hot = module.hot;
    }

    factory(global, _require, _moduleObject, exports, dependencyMap);

    if (!__DEV__) {
      module.factory = undefined;
    }

    if (__DEV__) {
      Systrace.endEvent();
    }
    return module.exports = _moduleObject.exports;
  } catch (e) {
    module.hasError = true;
    module.isInitialized = false;
    module.exports = undefined;
    throw e;
  }
}

function unknownModuleError(id) {
  var message = 'Requiring unknown module "' + id + '".';
  if (__DEV__) {
    message += 'If you are sure the module is there, try restarting the packager or running "npm install".';
  }
  return Error(message);
}

function moduleThrewError(id) {
  return Error('Requiring module "' + id + '", which threw an exception.');
}

if (__DEV__) {
  _require.Systrace = { beginEvent: function beginEvent() {}, endEvent: function endEvent() {} };

  var createHotReloadingObject = function createHotReloadingObject() {
    var hot = {
      acceptCallback: null,
      accept: function accept(callback) {
        hot.acceptCallback = callback;
      }
    };
    return hot;
  };

  var acceptAll = function acceptAll(dependentModules, inverseDependencies) {
    if (!dependentModules || dependentModules.length === 0) {
      return true;
    }

    var notAccepted = dependentModules.filter(function (module) {
      return !_accept(module, undefined, inverseDependencies);
    });

    var parents = [];
    for (var i = 0; i < notAccepted.length; i++) {
      if (inverseDependencies[notAccepted[i]].length === 0) {
        return false;
      }

      parents.push.apply(parents, babelHelpers.toConsumableArray(inverseDependencies[notAccepted[i]]));
    }

    return acceptAll(parents, inverseDependencies);
  };

  var _accept = function _accept(id, factory, inverseDependencies) {
    var mod = modules[id];

    if (!mod && factory) {
      define(factory, id);
      return true;
    }

    var hot = mod.hot;

    if (!hot) {
      console.warn('Cannot accept module because Hot Module Replacement ' + 'API was not installed.');
      return false;
    }

    if (factory) {
      mod.factory = factory;
    }
    mod.hasError = false;
    mod.isInitialized = false;
    _require(id);

    if (hot.acceptCallback) {
      hot.acceptCallback();
      return true;
    } else {
      if (!inverseDependencies) {
        throw new Error('Undefined `inverseDependencies`');
      }

      return acceptAll(inverseDependencies[id], inverseDependencies);
    }
  };

  global.__accept = _accept;
}