

'use strict';

var SyntheticEvent = require('SyntheticEvent');

var ResponderEventInterface = {
  touchHistory: function touchHistory(nativeEvent) {
    return null;
  }
};

function ResponderSyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent.augmentClass(ResponderSyntheticEvent, ResponderEventInterface);

module.exports = ResponderSyntheticEvent;