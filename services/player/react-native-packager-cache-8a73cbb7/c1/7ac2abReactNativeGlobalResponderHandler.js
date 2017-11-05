
'use strict';

var UIManager = require('UIManager');

var ReactNativeGlobalResponderHandler = {
  onChange: function onChange(from, to, blockNativeResponder) {
    if (to !== null) {
      UIManager.setJSResponder(to._rootNodeID, blockNativeResponder);
    } else {
      UIManager.clearJSResponder();
    }
  }
};

module.exports = ReactNativeGlobalResponderHandler;