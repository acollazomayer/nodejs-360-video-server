
'use strict';

if (global.GLOBAL === undefined) {
  global.GLOBAL = global;
}

if (global.window === undefined) {
  global.window = global;
}

var defineLazyObjectProperty = require('defineLazyObjectProperty');

function defineProperty(object, name, getValue, eager) {
  var descriptor = Object.getOwnPropertyDescriptor(object, name);
  if (descriptor) {
    var backupName = 'original' + name[0].toUpperCase() + name.substr(1);
    Object.defineProperty(object, backupName, babelHelpers.extends({}, descriptor, {
      value: object[name]
    }));
  }

  var _ref = descriptor || {},
      enumerable = _ref.enumerable,
      writable = _ref.writable,
      configurable = _ref.configurable;

  if (descriptor && !configurable) {
    console.error('Failed to set polyfill. ' + name + ' is not configurable.');
    return;
  }

  if (eager === true) {
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: enumerable !== false,
      writable: writable !== false,
      value: getValue()
    });
  } else {
    defineLazyObjectProperty(object, name, {
      get: getValue,
      enumerable: enumerable !== false,
      writable: writable !== false
    });
  }
}

global.process = global.process || {};
global.process.env = global.process.env || {};
if (!global.process.env.NODE_ENV) {
  global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
}

var Systrace = require('Systrace');
Systrace.setEnabled(global.__RCTProfileIsProfiling || false);

var ExceptionsManager = require('ExceptionsManager');
ExceptionsManager.installConsoleErrorReporter();

require('RCTLog');

if (!global.__fbDisableExceptionsManager) {
  var handleError = function handleError(e, isFatal) {
    try {
      ExceptionsManager.handleException(e, isFatal);
    } catch (ee) {
      console.log('Failed to print error: ', ee.message);

      throw e;
    }
  };

  var ErrorUtils = require('ErrorUtils');
  ErrorUtils.setGlobalHandler(handleError);
}

var defineLazyTimer = function defineLazyTimer(name) {
  defineProperty(global, name, function () {
    return require('JSTimers')[name];
  });
};
defineLazyTimer('setTimeout');
defineLazyTimer('setInterval');
defineLazyTimer('setImmediate');
defineLazyTimer('clearTimeout');
defineLazyTimer('clearInterval');
defineLazyTimer('clearImmediate');
defineLazyTimer('requestAnimationFrame');
defineLazyTimer('cancelAnimationFrame');
defineLazyTimer('requestIdleCallback');
defineLazyTimer('cancelIdleCallback');

if (!global.alert) {
  global.alert = function (text) {
    require('Alert').alert('Alert', '' + text);
  };
}

defineProperty(global, 'Promise', function () {
  return require('Promise');
});

defineProperty(global, 'regeneratorRuntime', function () {
  delete global.regeneratorRuntime;
  require('regenerator-runtime/runtime');
  return global.regeneratorRuntime;
});

defineProperty(global, 'XMLHttpRequest', function () {
  return require('XMLHttpRequest');
});
defineProperty(global, 'FormData', function () {
  return require('FormData');
});

defineProperty(global, 'fetch', function () {
  return require('fetch').fetch;
});
defineProperty(global, 'Headers', function () {
  return require('fetch').Headers;
});
defineProperty(global, 'Request', function () {
  return require('fetch').Request;
});
defineProperty(global, 'Response', function () {
  return require('fetch').Response;
});
defineProperty(global, 'WebSocket', function () {
  return require('WebSocket');
});

var navigator = global.navigator;
if (navigator === undefined) {
  global.navigator = navigator = {};
}

defineProperty(navigator, 'product', function () {
  return 'ReactNative';
}, true);
defineProperty(navigator, 'geolocation', function () {
  return require('Geolocation');
});

defineProperty(global, 'Map', function () {
  return require('Map');
}, true);
defineProperty(global, 'Set', function () {
  return require('Set');
}, true);

if (__DEV__) {
  if (!window.document) {
    var setupDevtools = require('setupDevtools');
    setupDevtools();
  }

  require('RCTDebugComponentOwnership');
}

if (__DEV__) {
  var JSInspector = require('JSInspector');
  JSInspector.registerAgent(require('NetworkAgent'));
}

require('RCTDeviceEventEmitter');
require('RCTNativeAppEventEmitter');
require('PerformanceLogger');