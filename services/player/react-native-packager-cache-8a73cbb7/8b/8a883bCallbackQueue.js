

'use strict';

var PooledClass = require('PooledClass');

var invariant = require('fbjs/lib/invariant');

var CallbackQueue = function () {
  function CallbackQueue(arg) {
    babelHelpers.classCallCheck(this, CallbackQueue);

    this._callbacks = null;
    this._contexts = null;
    this._arg = arg;
  }

  babelHelpers.createClass(CallbackQueue, [{
    key: 'enqueue',
    value: function enqueue(callback, context) {
      this._callbacks = this._callbacks || [];
      this._callbacks.push(callback);
      this._contexts = this._contexts || [];
      this._contexts.push(context);
    }
  }, {
    key: 'notifyAll',
    value: function notifyAll() {
      var callbacks = this._callbacks;
      var contexts = this._contexts;
      var arg = this._arg;
      if (callbacks && contexts) {
        invariant(callbacks.length === contexts.length, 'Mismatched list of contexts in callback queue');
        this._callbacks = null;
        this._contexts = null;
        for (var i = 0; i < callbacks.length; i++) {
          callbacks[i].call(contexts[i], arg);
        }
        callbacks.length = 0;
        contexts.length = 0;
      }
    }
  }, {
    key: 'checkpoint',
    value: function checkpoint() {
      return this._callbacks ? this._callbacks.length : 0;
    }
  }, {
    key: 'rollback',
    value: function rollback(len) {
      if (this._callbacks && this._contexts) {
        this._callbacks.length = len;
        this._contexts.length = len;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._callbacks = null;
      this._contexts = null;
    }
  }, {
    key: 'destructor',
    value: function destructor() {
      this.reset();
    }
  }]);
  return CallbackQueue;
}();

module.exports = PooledClass.addPoolingTo(CallbackQueue);