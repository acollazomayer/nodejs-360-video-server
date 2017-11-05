

'use strict';

var ErrorUtils = require('ErrorUtils');
var JSTimersExecution = require('JSTimersExecution');
var Systrace = require('Systrace');

var deepFreezeAndThrowOnMutationInDev = require('deepFreezeAndThrowOnMutationInDev');
var invariant = require('fbjs/lib/invariant');
var stringifySafe = require('stringifySafe');

var TO_JS = 0;
var TO_NATIVE = 1;

var MODULE_IDS = 0;
var METHOD_IDS = 1;
var PARAMS = 2;
var MIN_TIME_BETWEEN_FLUSHES_MS = 5;

var TRACE_TAG_REACT_APPS = 1 << 17;

var DEBUG_INFO_LIMIT = 32;

var guard = function guard(fn) {
  try {
    fn();
  } catch (error) {
    ErrorUtils.reportFatalError(error);
  }
};

var MessageQueue = function () {
  function MessageQueue() {
    babelHelpers.classCallCheck(this, MessageQueue);

    this._callableModules = {};
    this._queue = [[], [], [], 0];
    this._callbacks = [];
    this._callbackID = 0;
    this._callID = 0;
    this._lastFlush = 0;
    this._eventLoopStartTime = new Date().getTime();

    if (__DEV__) {
      this._debugInfo = {};
      this._remoteModuleTable = {};
      this._remoteMethodTable = {};
    }

    this.callFunctionReturnFlushedQueue = this.callFunctionReturnFlushedQueue.bind(this);
    this.callFunctionReturnResultAndFlushedQueue = this.callFunctionReturnResultAndFlushedQueue.bind(this);
    this.flushedQueue = this.flushedQueue.bind(this);
    this.invokeCallbackAndReturnFlushedQueue = this.invokeCallbackAndReturnFlushedQueue.bind(this);
  }

  babelHelpers.createClass(MessageQueue, [{
    key: 'callFunctionReturnFlushedQueue',
    value: function callFunctionReturnFlushedQueue(module, method, args) {
      var _this = this;

      guard(function () {
        _this.__callFunction(module, method, args);
        _this.__callImmediates();
      });

      return this.flushedQueue();
    }
  }, {
    key: 'callFunctionReturnResultAndFlushedQueue',
    value: function callFunctionReturnResultAndFlushedQueue(module, method, args) {
      var _this2 = this;

      var result = void 0;
      guard(function () {
        result = _this2.__callFunction(module, method, args);
        _this2.__callImmediates();
      });

      return [result, this.flushedQueue()];
    }
  }, {
    key: 'invokeCallbackAndReturnFlushedQueue',
    value: function invokeCallbackAndReturnFlushedQueue(cbID, args) {
      var _this3 = this;

      guard(function () {
        _this3.__invokeCallback(cbID, args);
        _this3.__callImmediates();
      });

      return this.flushedQueue();
    }
  }, {
    key: 'flushedQueue',
    value: function flushedQueue() {
      this.__callImmediates();

      var queue = this._queue;
      this._queue = [[], [], [], this._callID];
      return queue[0].length ? queue : null;
    }
  }, {
    key: 'getEventLoopRunningTime',
    value: function getEventLoopRunningTime() {
      return new Date().getTime() - this._eventLoopStartTime;
    }
  }, {
    key: 'registerCallableModule',
    value: function registerCallableModule(name, module) {
      this._callableModules[name] = module;
    }
  }, {
    key: 'enqueueNativeCall',
    value: function enqueueNativeCall(moduleID, methodID, params, onFail, onSucc) {
      if (onFail || onSucc) {
        if (__DEV__) {
          var callId = this._callbackID >> 1;
          this._debugInfo[callId] = [moduleID, methodID];
          if (callId > DEBUG_INFO_LIMIT) {
            delete this._debugInfo[callId - DEBUG_INFO_LIMIT];
          }
        }
        onFail && params.push(this._callbackID);

        this._callbacks[this._callbackID++] = onFail;
        onSucc && params.push(this._callbackID);

        this._callbacks[this._callbackID++] = onSucc;
      }

      if (__DEV__) {
        global.nativeTraceBeginAsyncFlow && global.nativeTraceBeginAsyncFlow(TRACE_TAG_REACT_APPS, 'native', this._callID);
      }
      this._callID++;

      this._queue[MODULE_IDS].push(moduleID);
      this._queue[METHOD_IDS].push(methodID);

      if (__DEV__) {
        JSON.stringify(params);

        deepFreezeAndThrowOnMutationInDev(params);
      }
      this._queue[PARAMS].push(params);

      var now = new Date().getTime();
      if (global.nativeFlushQueueImmediate && now - this._lastFlush >= MIN_TIME_BETWEEN_FLUSHES_MS) {
        global.nativeFlushQueueImmediate(this._queue);
        this._queue = [[], [], [], this._callID];
        this._lastFlush = now;
      }
      Systrace.counterEvent('pending_js_to_native_queue', this._queue[0].length);
      if (__DEV__ && this.__spy && isFinite(moduleID)) {
        this.__spy({ type: TO_NATIVE,
          module: this._remoteModuleTable[moduleID],
          method: this._remoteMethodTable[moduleID][methodID],
          args: params });
      }
    }
  }, {
    key: 'createDebugLookup',
    value: function createDebugLookup(moduleID, name, methods) {
      if (__DEV__) {
        this._remoteModuleTable[moduleID] = name;
        this._remoteMethodTable[moduleID] = methods;
      }
    }
  }, {
    key: '__callImmediates',
    value: function __callImmediates() {
      Systrace.beginEvent('JSTimersExecution.callImmediates()');
      guard(function () {
        return JSTimersExecution.callImmediates();
      });
      Systrace.endEvent();
    }
  }, {
    key: '__callFunction',
    value: function __callFunction(module, method, args) {
      this._lastFlush = new Date().getTime();
      this._eventLoopStartTime = this._lastFlush;
      Systrace.beginEvent(module + '.' + method + '()');
      if (__DEV__ && this.__spy) {
        this.__spy({ type: TO_JS, module: module, method: method, args: args });
      }
      var moduleMethods = this._callableModules[module];
      invariant(!!moduleMethods, 'Module %s is not a registered callable module (calling %s)', module, method);
      invariant(!!moduleMethods[method], 'Method %s does not exist on module %s', method, module);
      var result = moduleMethods[method].apply(moduleMethods, args);
      Systrace.endEvent();
      return result;
    }
  }, {
    key: '__invokeCallback',
    value: function __invokeCallback(cbID, args) {
      this._lastFlush = new Date().getTime();
      this._eventLoopStartTime = this._lastFlush;
      var callback = this._callbacks[cbID];

      if (__DEV__) {
        var debug = this._debugInfo[cbID >> 1];
        var _module = debug && this._remoteModuleTable[debug[0]];
        var _method = debug && this._remoteMethodTable[debug[0]][debug[1]];
        if (callback == null) {
          var errorMessage = 'Callback with id ' + cbID + ': ' + _module + '.' + _method + '() not found';
          if (_method) {
            errorMessage = 'The callback ' + _method + '() exists in module ' + _module + ', ' + 'but only one callback may be registered to a function in a native module.';
          }
          invariant(callback, errorMessage);
        }
        var profileName = debug ? '<callback for ' + _module + '.' + _method + '>' : cbID;
        if (callback && this.__spy && __DEV__) {
          this.__spy({ type: TO_JS, module: null, method: profileName, args: args });
        }
        Systrace.beginEvent('MessageQueue.invokeCallback(' + profileName + ', ' + stringifySafe(args) + ')');
      } else {
        if (!callback) {
          return;
        }
      }

      this._callbacks[cbID & ~1] = null;

      this._callbacks[cbID | 1] = null;

      callback.apply(null, args);

      if (__DEV__) {
        Systrace.endEvent();
      }
    }
  }], [{
    key: 'spy',
    value: function spy(spyOrToggle) {
      if (spyOrToggle === true) {
        MessageQueue.prototype.__spy = function (info) {
          console.log((info.type === TO_JS ? 'N->JS' : 'JS->N') + ' : ' + ('' + (info.module ? info.module + '.' : '') + info.method) + ('(' + JSON.stringify(info.args) + ')'));
        };
      } else if (spyOrToggle === false) {
        MessageQueue.prototype.__spy = null;
      } else {
        MessageQueue.prototype.__spy = spyOrToggle;
      }
    }
  }]);
  return MessageQueue;
}();

module.exports = MessageQueue;