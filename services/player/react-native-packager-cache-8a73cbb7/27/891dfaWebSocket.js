
'use strict';

var NativeEventEmitter = require('NativeEventEmitter');
var Platform = require('Platform');
var RCTWebSocketModule = require('NativeModules').WebSocketModule;
var WebSocketEvent = require('WebSocketEvent');
var binaryToBase64 = require('binaryToBase64');

var EventTarget = require('event-target-shim');
var base64 = require('base64-js');

var CONNECTING = 0;
var OPEN = 1;
var CLOSING = 2;
var CLOSED = 3;

var CLOSE_NORMAL = 1000;

var WEBSOCKET_EVENTS = ['close', 'error', 'message', 'open'];

var nextWebSocketId = 0;

var WebSocket = function (_EventTarget) {
  babelHelpers.inherits(WebSocket, _EventTarget);

  function WebSocket(url, protocols, options) {
    babelHelpers.classCallCheck(this, WebSocket);

    var _this = babelHelpers.possibleConstructorReturn(this, (WebSocket.__proto__ || Object.getPrototypeOf(WebSocket)).call(this));

    _this.CONNECTING = CONNECTING;
    _this.OPEN = OPEN;
    _this.CLOSING = CLOSING;
    _this.CLOSED = CLOSED;
    _this.readyState = CONNECTING;

    if (typeof protocols === 'string') {
      protocols = [protocols];
    }

    if (!Array.isArray(protocols)) {
      protocols = null;
    }

    _this._eventEmitter = new NativeEventEmitter(RCTWebSocketModule);
    _this._socketId = nextWebSocketId++;
    RCTWebSocketModule.connect(url, protocols, options, _this._socketId);
    _this._registerEvents();
    return _this;
  }

  babelHelpers.createClass(WebSocket, [{
    key: 'close',
    value: function close(code, reason) {
      if (this.readyState === this.CLOSING || this.readyState === this.CLOSED) {
        return;
      }

      this.readyState = this.CLOSING;
      this._close(code, reason);
    }
  }, {
    key: 'send',
    value: function send(data) {
      if (this.readyState === this.CONNECTING) {
        throw new Error('INVALID_STATE_ERR');
      }

      if (typeof data === 'string') {
        RCTWebSocketModule.send(data, this._socketId);
        return;
      }

      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        RCTWebSocketModule.sendBinary(binaryToBase64(data), this._socketId);
        return;
      }

      throw new Error('Unsupported data type');
    }
  }, {
    key: 'ping',
    value: function ping() {
      if (this.readyState === this.CONNECTING) {
        throw new Error('INVALID_STATE_ERR');
      }

      RCTWebSocketModule.ping(this._socketId);
    }
  }, {
    key: '_close',
    value: function _close(code, reason) {
      if (Platform.OS === 'android') {
        var statusCode = typeof code === 'number' ? code : CLOSE_NORMAL;
        var closeReason = typeof reason === 'string' ? reason : '';
        RCTWebSocketModule.close(statusCode, closeReason, this._socketId);
      } else {
        RCTWebSocketModule.close(this._socketId);
      }
    }
  }, {
    key: '_unregisterEvents',
    value: function _unregisterEvents() {
      this._subscriptions.forEach(function (e) {
        return e.remove();
      });
      this._subscriptions = [];
    }
  }, {
    key: '_registerEvents',
    value: function _registerEvents() {
      var _this2 = this;

      this._subscriptions = [this._eventEmitter.addListener('websocketMessage', function (ev) {
        if (ev.id !== _this2._socketId) {
          return;
        }
        _this2.dispatchEvent(new WebSocketEvent('message', {
          data: ev.type === 'binary' ? base64.toByteArray(ev.data).buffer : ev.data
        }));
      }), this._eventEmitter.addListener('websocketOpen', function (ev) {
        if (ev.id !== _this2._socketId) {
          return;
        }
        _this2.readyState = _this2.OPEN;
        _this2.dispatchEvent(new WebSocketEvent('open'));
      }), this._eventEmitter.addListener('websocketClosed', function (ev) {
        if (ev.id !== _this2._socketId) {
          return;
        }
        _this2.readyState = _this2.CLOSED;
        _this2.dispatchEvent(new WebSocketEvent('close', {
          code: ev.code,
          reason: ev.reason
        }));
        _this2._unregisterEvents();
        _this2.close();
      }), this._eventEmitter.addListener('websocketFailed', function (ev) {
        if (ev.id !== _this2._socketId) {
          return;
        }
        _this2.readyState = _this2.CLOSED;
        _this2.dispatchEvent(new WebSocketEvent('error', {
          message: ev.message
        }));
        _this2.dispatchEvent(new WebSocketEvent('close', {
          message: ev.message
        }));
        _this2._unregisterEvents();
        _this2.close();
      })];
    }
  }]);
  return WebSocket;
}(EventTarget.apply(undefined, WEBSOCKET_EVENTS));

WebSocket.CONNECTING = CONNECTING;
WebSocket.OPEN = OPEN;
WebSocket.CLOSING = CLOSING;
WebSocket.CLOSED = CLOSED;


module.exports = WebSocket;