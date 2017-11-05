

'use strict';

var debugTool = null;

if (__DEV__) {
  var ReactDebugTool = require('ReactDebugTool');
  debugTool = ReactDebugTool;
}

module.exports = { debugTool: debugTool };