
'use strict';

var BatchedBridge = require('BatchedBridge');

var invariant = require('fbjs/lib/invariant');

var levelsMap = {
  log: 'log',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error'
};

var RCTLog = function () {
  function RCTLog() {
    babelHelpers.classCallCheck(this, RCTLog);
  }

  babelHelpers.createClass(RCTLog, null, [{
    key: 'logIfNoNativeHook',
    value: function logIfNoNativeHook() {
      var args = Array.prototype.slice.call(arguments);
      var level = args.shift();
      var logFn = levelsMap[level];
      invariant(logFn, 'Level "' + level + '" not one of ' + Object.keys(levelsMap));
      if (typeof global.nativeLoggingHook === 'undefined') {
        console[logFn].apply(console, args);
      }

      return true;
    }
  }]);
  return RCTLog;
}();

BatchedBridge.registerCallableModule('RCTLog', RCTLog);

module.exports = RCTLog;