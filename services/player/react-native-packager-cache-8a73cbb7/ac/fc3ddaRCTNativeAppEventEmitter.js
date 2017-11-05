
'use strict';

var BatchedBridge = require('BatchedBridge');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var RCTNativeAppEventEmitter = RCTDeviceEventEmitter;

BatchedBridge.registerCallableModule('RCTNativeAppEventEmitter', RCTNativeAppEventEmitter);

module.exports = RCTNativeAppEventEmitter;