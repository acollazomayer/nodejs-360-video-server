
'use strict';

var MessageQueue = require('MessageQueue');
var BatchedBridge = new MessageQueue();

BatchedBridge.registerCallableModule('Systrace', require('Systrace'));
BatchedBridge.registerCallableModule('JSTimersExecution', require('JSTimersExecution'));
BatchedBridge.registerCallableModule('HeapCapture', require('HeapCapture'));
BatchedBridge.registerCallableModule('SamplingProfiler', require('SamplingProfiler'));

if (__DEV__) {
  BatchedBridge.registerCallableModule('HMRClient', require('HMRClient'));
}

Object.defineProperty(global, '__fbBatchedBridge', {
  configurable: true,
  value: BatchedBridge
});

module.exports = BatchedBridge;