
'use strict';

var CallbackQueue = require('CallbackQueue');
var PooledClass = require('PooledClass');
var Transaction = require('Transaction');
var ReactInstrumentation = require('ReactInstrumentation');
var ReactUpdateQueue = require('ReactUpdateQueue');

var ON_DOM_READY_QUEUEING = {
  initialize: function initialize() {
    this.reactMountReady.reset();
  },

  close: function close() {
    this.reactMountReady.notifyAll();
  }
};

var TRANSACTION_WRAPPERS = [ON_DOM_READY_QUEUEING];

if (__DEV__) {
  TRANSACTION_WRAPPERS.push({
    initialize: ReactInstrumentation.debugTool.onBeginFlush,
    close: ReactInstrumentation.debugTool.onEndFlush
  });
}

function ReactNativeReconcileTransaction() {
  this.reinitializeTransaction();
  this.reactMountReady = CallbackQueue.getPooled(null);
}

var Mixin = {
  getTransactionWrappers: function getTransactionWrappers() {
    return TRANSACTION_WRAPPERS;
  },

  getReactMountReady: function getReactMountReady() {
    return this.reactMountReady;
  },

  getUpdateQueue: function getUpdateQueue() {
    return ReactUpdateQueue;
  },

  checkpoint: function checkpoint() {
    return this.reactMountReady.checkpoint();
  },

  rollback: function rollback(checkpoint) {
    this.reactMountReady.rollback(checkpoint);
  },

  destructor: function destructor() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;
  }
};

babelHelpers.extends(ReactNativeReconcileTransaction.prototype, Transaction, ReactNativeReconcileTransaction, Mixin);

PooledClass.addPoolingTo(ReactNativeReconcileTransaction);

module.exports = ReactNativeReconcileTransaction;