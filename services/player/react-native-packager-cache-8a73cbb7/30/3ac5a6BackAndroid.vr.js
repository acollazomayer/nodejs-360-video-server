

'use strict';

var DeviceEventManager = require('NativeModules').DeviceEventManager;
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var DEVICE_BACK_EVENT = 'hardwareBackPress';

var _backPressSubscriptions = new Set();

RCTDeviceEventEmitter.addListener(DEVICE_BACK_EVENT, function () {
  var backPressSubscriptions = new Set(_backPressSubscriptions);
  var invokeDefault = true;
  backPressSubscriptions.forEach(function (subscription) {
    if (subscription()) {
      invokeDefault = false;
    }
  });
  if (invokeDefault) {
    BackAndroid.exitApp();
  }
});

var BackAndroid = {
  exitApp: function exitApp() {
    DeviceEventManager.invokeDefaultBackPressHandler();
  },

  addEventListener: function addEventListener(eventName, handler) {
    _backPressSubscriptions.add(handler);
    return {
      remove: function remove() {
        return BackAndroid.removeEventListener(eventName, handler);
      }
    };
  },

  removeEventListener: function removeEventListener(eventName, handler) {
    _backPressSubscriptions.delete(handler);
  }
};

module.exports = BackAndroid;