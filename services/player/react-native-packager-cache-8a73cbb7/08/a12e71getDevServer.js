
'use strict';

var _require = require('NativeModules'),
    SourceCode = _require.SourceCode;

var _cachedDevServerURL = void 0;
var FALLBACK = 'http://localhost:8081/';

function getDevServer() {
  if (_cachedDevServerURL === undefined) {
    var match = SourceCode.scriptURL && SourceCode.scriptURL.match(/^https?:\/\/.*?\//);
    _cachedDevServerURL = match ? match[0] : null;
  }

  return {
    url: _cachedDevServerURL || FALLBACK,
    bundleLoadedFromServer: _cachedDevServerURL !== null
  };
}

module.exports = getDevServer;