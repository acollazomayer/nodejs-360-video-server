
'use strict';

var EventPluginHub = require('EventPluginHub');
var EventPluginRegistry = require('EventPluginRegistry');
var ReactEventEmitterMixin = require('ReactEventEmitterMixin');
var ReactNativeComponentTree = require('ReactNativeComponentTree');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactUpdates = require('ReactUpdates');

var warning = require('fbjs/lib/warning');

var EMPTY_NATIVE_EVENT = {};

var touchSubsequence = function touchSubsequence(touches, indices) {
  var ret = [];
  for (var i = 0; i < indices.length; i++) {
    ret.push(touches[indices[i]]);
  }
  return ret;
};

var removeTouchesAtIndices = function removeTouchesAtIndices(touches, indices) {
  var rippedOut = [];

  var temp = touches;
  for (var i = 0; i < indices.length; i++) {
    var index = indices[i];
    rippedOut.push(touches[index]);
    temp[index] = null;
  }
  var fillAt = 0;
  for (var j = 0; j < temp.length; j++) {
    var cur = temp[j];
    if (cur !== null) {
      temp[fillAt++] = cur;
    }
  }
  temp.length = fillAt;
  return rippedOut;
};

var ReactNativeEventEmitter = babelHelpers.extends({}, ReactEventEmitterMixin, {

  registrationNames: EventPluginRegistry.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners,

  _receiveRootNodeIDEvent: function _receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam) {
    var nativeEvent = nativeEventParam || EMPTY_NATIVE_EVENT;
    var inst = ReactNativeComponentTree.getInstanceFromNode(rootNodeID);
    if (!inst) {
      return;
    }
    ReactUpdates.batchedUpdates(function () {
      ReactNativeEventEmitter.handleTopLevel(topLevelType, inst, nativeEvent, nativeEvent.target);
    });
  },

  receiveEvent: function receiveEvent(tag, topLevelType, nativeEventParam) {
    var rootNodeID = tag;
    ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, topLevelType, nativeEventParam);
  },

  receiveTouches: function receiveTouches(eventTopLevelType, touches, changedIndices) {
    var changedTouches = eventTopLevelType === 'topTouchEnd' || eventTopLevelType === 'topTouchCancel' ? removeTouchesAtIndices(touches, changedIndices) : touchSubsequence(touches, changedIndices);

    for (var jj = 0; jj < changedTouches.length; jj++) {
      var touch = changedTouches[jj];

      touch.changedTouches = changedTouches;
      touch.touches = touches;
      var nativeEvent = touch;
      var rootNodeID = null;
      var target = nativeEvent.target;
      if (target !== null && target !== undefined) {
        if (target < ReactNativeTagHandles.tagsStartAt) {
          if (__DEV__) {
            warning(false, 'A view is reporting that a touch occured on tag zero.');
          }
        } else {
          rootNodeID = target;
        }
      }
      ReactNativeEventEmitter._receiveRootNodeIDEvent(rootNodeID, eventTopLevelType, nativeEvent);
    }
  }
});

module.exports = ReactNativeEventEmitter;