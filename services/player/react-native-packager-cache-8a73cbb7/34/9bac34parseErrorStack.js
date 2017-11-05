
'use strict';

var stacktraceParser = require('stacktrace-parser');

function parseErrorStack(e) {
  if (!e || !e.stack) {
    return [];
  }

  var stack = Array.isArray(e.stack) ? e.stack : stacktraceParser.parse(e.stack);

  var framesToPop = typeof e.framesToPop === 'number' ? e.framesToPop : 0;
  while (framesToPop--) {
    stack.shift();
  }

  return stack;
}

module.exports = parseErrorStack;