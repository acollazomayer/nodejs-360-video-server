
'use strict';

var logError = function logError() {
  if (arguments.length === 1 && arguments[0] instanceof Error) {
    var err = arguments[0];
    console.error('Error: "' + err.message + '".  Stack:\n' + err.stack);
  } else {
    console.error.apply(console, arguments);
  }
};

module.exports = logError;