Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createRootView;

var _ReactNativeContext = require('./ReactNativeContext');

var DEVTOOLS_FLAG = /\bdevtools\b/;
var HOTRELOAD_FLAG = /\bhotreload\b/;

var BRIDGE_CODE = '\nvar Status = undefined;\n\nonmessage = function(e) {\n  var msg = JSON.parse(e.data);\n  if (!msg || !msg.cmd) {\n    return;\n  }\n  if (msg.cmd === \'moduleConfig\' ) {\n    __fbBatchedBridgeConfig = msg.moduleConfig;\n    Status = \'moduleConfig\';\n  } else\n  if (msg.cmd === \'bundle\' && Status === \'moduleConfig\') {\n    try {\n      importScripts(msg.bundleName);\n      Status = \'bundle\';\n    } catch (e) {\n      console.warn(e);\n      var xmlhttp = new XMLHttpRequest();\n      xmlhttp.open("GET", msg.bundleName, true);\n      xmlhttp.onreadystatechange=function() {\n        if (xmlhttp.readyState == 4) {\n          var result = JSON.parse(xmlhttp.responseText);\n          if (result) {\n            if (result.type === \'UnableToResolveError\' || result.type === \'NotFoundError\') {\n              console.warn(result.message);\n            } else {\n              if (result.snippet) {\n                // remove all color characters and split the lines for improved clarity\n                result.snippet = result.snippet.replace(/\\u001b\\[.*?m/g, \'\').split(\'\\n\');\n              }\n              if (result.filename && result.filename.indexOf(\':\') <= 2) {\n                result.filename = \'file:///\' + result.filename;\n              }\n              if (result.errors) {\n                for (var i=0; i<result.errors.length; i++) {\n                  var error = result.errors[i];\n                  if (error.filename && error.filename.indexOf(\':\') <= 2) {\n                    error.filename = \'file:///\' + error.filename;\n                  }\n                }\n              }\n              console.warn(JSON.stringify(result, undefined, 2));\n            }\n          }\n        }\n      }\n      xmlhttp.send(null);\n    }\n  } else if (Status === \'bundle\') {\n    if (msg.cmd === \'exec\') {\n      var results = __fbBatchedBridge.callFunctionReturnFlushedQueue.apply(null, [msg.module, msg.function, msg.args]);\n      try {\n        postMessage({cmd: \'exec\', results: results});\n      } catch (e) {\n        console.warn(e);\n        console.warn(msg);\n        console.warn(JSON.stringify(results))\n      }\n    } else\n    if (msg.cmd === \'invoke\') {\n      var results = __fbBatchedBridge.invokeCallbackAndReturnFlushedQueue.apply(null, [msg.id, msg.args]);\n      try {\n        postMessage({cmd: \'exec\', results: results});\n      } catch (e) {\n        console.warn(e);\n        console.warn(msg);\n        console.warn(JSON.stringify(results))\n      }\n    } else\n    if (msg.cmd === \'flush\') {\n      var results = __fbBatchedBridge.flushedQueue.apply(null);\n      try {\n        postMessage({cmd: \'exec\', results: results});\n      } catch (e) {\n        console.warn(e);\n        console.warn(msg);\n        console.warn(JSON.stringify(results))\n      }\n    }\n  }\n}\n';

if (__DEV__) {
  if (DEVTOOLS_FLAG.test(location.search)) {
    BRIDGE_CODE += '__DEVTOOLS__ = true;\n';
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('We detected that you have the React Devtools extension installed. ' + 'Please note that at this time, React VR is only compatible with the ' + 'standalone React Native Inspector that ships with Nuclide.');
    }
  }
}

function createRootView(guisys, name) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!guisys) {
    throw new Error('ReactVR Root View must attach to an OVRUI GUI!');
  }
  if (!name || typeof name !== 'string') {
    throw new Error('ReactVR Root View must have a module name to mount');
  }

  var initialProps = options.initialProps || {};
  var contextOptions = {
    isLowLatency: !!options.isLowLatency,
    customViews: options.customViews
  };
  if (options.assetRoot) {
    contextOptions.assetRoot = options.assetRoot;
  }
  if (HOTRELOAD_FLAG.test(location.search)) {
    contextOptions.enableHotReload = true;
  }
  if (options.enableHotReload) {
    contextOptions.enableHotReload = options.enableHotReload;
  }

  var bundleURL = options.bundle || '../index.bundle?platform=vr';

  if (contextOptions.enableHotReload) {
    bundleURL += '&hot=true';
  }

  var bridgeCodeBlob = new Blob([BRIDGE_CODE]);
  var rn = new _ReactNativeContext.ReactNativeContext(guisys, URL.createObjectURL(bridgeCodeBlob), contextOptions);
  if (Array.isArray(options.nativeModules)) {
    for (var _iterator = options.nativeModules, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var module = _ref;

      rn.registerModule(module);
    }
  }
  rn.init(bundleURL);
  var rootTag = rn.createRootView(name, initialProps);

  return {
    context: rn,
    frame: function frame(camera) {
      rn.frame(camera, rootTag);
    }
  };
}