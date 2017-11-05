
'use strict';

var Map = require('Map');
var NativeEventEmitter = require('NativeEventEmitter');
var NativeModules = require('NativeModules');
var Platform = require('Platform');
var RCTNetInfo = NativeModules.NetInfo;

var NetInfoEventEmitter = new NativeEventEmitter(RCTNetInfo);

var DEVICE_CONNECTIVITY_EVENT = 'networkStatusDidChange';

var _subscriptions = new Map();

var _isConnected = void 0;
if (Platform.OS === 'ios') {
  _isConnected = function _isConnected(reachability) {
    return reachability !== 'none' && reachability !== 'unknown';
  };
} else if (Platform.OS === 'android') {
  _isConnected = function _isConnected(connectionType) {
    return connectionType !== 'NONE' && connectionType !== 'UNKNOWN';
  };
}

var _isConnectedSubscriptions = new Map();

var NetInfo = {
  addEventListener: function addEventListener(eventName, handler) {
    var listener = NetInfoEventEmitter.addListener(DEVICE_CONNECTIVITY_EVENT, function (appStateData) {
      handler(appStateData.network_info);
    });
    _subscriptions.set(handler, listener);
    return {
      remove: function remove() {
        return NetInfo.removeEventListener(eventName, handler);
      }
    };
  },
  removeEventListener: function removeEventListener(eventName, handler) {
    var listener = _subscriptions.get(handler);
    if (!listener) {
      return;
    }
    listener.remove();
    _subscriptions.delete(handler);
  },
  fetch: function fetch() {
    return RCTNetInfo.getCurrentConnectivity().then(function (resp) {
      return resp.network_info;
    });
  },

  isConnected: {
    addEventListener: function addEventListener(eventName, handler) {
      var listener = function listener(connection) {
        handler(_isConnected(connection));
      };
      _isConnectedSubscriptions.set(handler, listener);
      NetInfo.addEventListener(eventName, listener);
      return {
        remove: function remove() {
          return NetInfo.isConnected.removeEventListener(eventName, handler);
        }
      };
    },
    removeEventListener: function removeEventListener(eventName, handler) {
      var listener = _isConnectedSubscriptions.get(handler);
      NetInfo.removeEventListener(eventName, listener);
      _isConnectedSubscriptions.delete(handler);
    },
    fetch: function fetch() {
      return NetInfo.fetch().then(function (connection) {
        return _isConnected(connection);
      });
    }
  },

  isConnectionExpensive: function isConnectionExpensive() {
    return Platform.OS === 'android' ? RCTNetInfo.isConnectionMetered() : Promise.reject(new Error('Currently not supported on iOS'));
  }
};

module.exports = NetInfo;