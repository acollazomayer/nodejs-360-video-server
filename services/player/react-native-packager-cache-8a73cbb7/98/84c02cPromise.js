
'use strict';

var Promise = require('fbjs/lib/Promise.native');

if (__DEV__) {
  require('promise/setimmediate/rejection-tracking').enable({
    allRejections: true,
    onUnhandled: function onUnhandled(id) {
      var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _error$message = error.message,
          message = _error$message === undefined ? null : _error$message,
          _error$stack = error.stack,
          stack = _error$stack === undefined ? null : _error$stack;

      var warning = 'Possible Unhandled Promise Rejection (id: ' + id + '):\n' + (message == null ? '' : message + '\n') + (stack == null ? '' : stack);
      console.warn(warning);
    },
    onHandled: function onHandled(id) {
      var warning = 'Promise Rejection Handled (id: ' + id + ')\n' + 'This means you can ignore any previous messages of the form ' + ('"Possible Unhandled Promise Rejection (id: ' + id + '):"');
      console.warn(warning);
    }
  });
}

module.exports = Promise;