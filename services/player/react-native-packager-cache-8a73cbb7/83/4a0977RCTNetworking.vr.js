
'use strict';

var FormData = require('FormData');
var NativeEventEmitter = require('NativeEventEmitter');
var RCTNetworkingNative = require('NativeModules').Networking;

function convertHeadersMapToArray(headers) {
  var headerArray = [];
  for (var name in headers) {
    headerArray.push([name, headers[name]]);
  }
  return headerArray;
}

var _requestId = 1;
function generateRequestId() {
  return _requestId++;
}

var RCTNetworking = function (_NativeEventEmitter) {
  babelHelpers.inherits(RCTNetworking, _NativeEventEmitter);

  function RCTNetworking() {
    babelHelpers.classCallCheck(this, RCTNetworking);
    return babelHelpers.possibleConstructorReturn(this, (RCTNetworking.__proto__ || Object.getPrototypeOf(RCTNetworking)).call(this, RCTNetworkingNative));
  }

  babelHelpers.createClass(RCTNetworking, [{
    key: 'sendRequest',
    value: function sendRequest(method, trackingName, url, headers, data, responseType, incrementalUpdates, timeout, callback) {
      var body = typeof data === 'string' ? { string: data } : data instanceof FormData ? { formData: getParts(data) } : data;
      var requestId = generateRequestId();
      RCTNetworkingNative.sendRequest(method, url, requestId, convertHeadersMapToArray(headers), babelHelpers.extends({}, body, { trackingName: trackingName }), responseType, incrementalUpdates, timeout);
      callback(requestId);
    }
  }, {
    key: 'abortRequest',
    value: function abortRequest(requestId) {
      RCTNetworkingNative.abortRequest(requestId);
    }
  }, {
    key: 'clearCookies',
    value: function clearCookies(callback) {
      RCTNetworkingNative.clearCookies(callback);
    }
  }]);
  return RCTNetworking;
}(NativeEventEmitter);

function getParts(data) {
  return data.getParts().map(function (part) {
    part.headers = convertHeadersMapToArray(part.headers);
    return part;
  });
}

module.exports = new RCTNetworking();