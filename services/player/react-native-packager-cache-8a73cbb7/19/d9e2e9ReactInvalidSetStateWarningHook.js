

'use strict';

var warning = require('fbjs/lib/warning');

if (__DEV__) {
  var processingChildContext = false;

  var warnInvalidSetState = function warnInvalidSetState() {
    warning(!processingChildContext, 'setState(...): Cannot call setState() inside getChildContext()');
  };
}

var ReactInvalidSetStateWarningHook = {
  onBeginProcessingChildContext: function onBeginProcessingChildContext() {
    processingChildContext = true;
  },
  onEndProcessingChildContext: function onEndProcessingChildContext() {
    processingChildContext = false;
  },
  onSetState: function onSetState() {
    warnInvalidSetState();
  }
};

module.exports = ReactInvalidSetStateWarningHook;