Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var WebSocketModule = function (_Module) {
  babelHelpers.inherits(WebSocketModule, _Module);

  function WebSocketModule(rnctx) {
    babelHelpers.classCallCheck(this, WebSocketModule);

    var _this = babelHelpers.possibleConstructorReturn(this, (WebSocketModule.__proto__ || Object.getPrototypeOf(WebSocketModule)).call(this, 'WebSocketModule'));

    _this._sockets = {};
    _this._rnctx = rnctx;
    return _this;
  }

  babelHelpers.createClass(WebSocketModule, [{
    key: 'connect',
    value: function connect(url, protocols, options, socketId) {
      var _this2 = this;

      var socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);
      socket.binaryType = 'arraybuffer';
      this._sockets[String(socketId)] = socket;

      socket.onclose = function (event) {
        var payload = {
          id: socketId,
          code: event.code,
          reason: event.reason
        };
        _this2._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['websocketClosed', payload]);
      };
      socket.onerror = function (event) {
        var payload = {
          id: socketId,
          message: 'Native WebSocket error'
        };
        _this2._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['websocketFailed', payload]);
      };
      socket.onmessage = function (event) {
        var data = event.data;
        if (data instanceof ArrayBuffer) {
          var arr = new Uint8Array(data);
          var str = new Array(arr.byteLength);
          for (var i = 0; i < str.length; i++) {
            str[i] = String.fromCharCode(arr[i]);
          }
          data = btoa(str.join(''));
        }
        var payload = {
          id: socketId,
          type: typeof event.data === 'string' ? 'string' : 'binary',
          data: data
        };
        _this2._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['websocketMessage', payload]);
      };
      socket.onopen = function (event) {
        var payload = {
          id: socketId
        };
        _this2._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['websocketOpen', payload]);
      };
    }
  }, {
    key: '_send',
    value: function _send(data, socketId) {
      var socket = this._sockets[String(socketId)];
      if (!socket) {
        throw new Error('Error while sending data to WebSocket: no such socket');
      }
      socket.send(data);
    }
  }, {
    key: 'send',
    value: function send(data, socketId) {
      this._send(data, socketId);
    }
  }, {
    key: 'sendBinary',
    value: function sendBinary(data, socketId) {
      var chars = atob(data);
      var array = new Uint8Array(chars.length);
      for (var i = 0; i < chars.length; i++) {
        array[i] = chars.charCodeAt(i) & 255;
      }
      this._send(array.buffer, socketId);
    }
  }, {
    key: 'ping',
    value: function ping(socketId) {
      throw new Error('Cannot send a ping. Browser WebSocket APIs are not capable of sending specific opcodes');
    }
  }, {
    key: 'close',
    value: function close(codeOrId, reason, socketId) {
      var id = void 0;
      if (typeof reason !== 'undefined' && typeof socketId !== 'undefined') {
        id = String(socketId);
        var socket = this._sockets[id];
        if (!socket) {
          return;
        }
        socket.close(codeOrId, reason);
      } else {
        id = String(codeOrId);
        var _socket = this._sockets[id];
        if (!_socket) {
          return;
        }
        _socket.close();
      }
      delete this._sockets[id];
    }
  }]);
  return WebSocketModule;
}(_Module3.default);

exports.default = WebSocketModule;