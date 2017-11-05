Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var Networking = function (_Module) {
  babelHelpers.inherits(Networking, _Module);

  function Networking(rnctx) {
    babelHelpers.classCallCheck(this, Networking);

    var _this = babelHelpers.possibleConstructorReturn(this, (Networking.__proto__ || Object.getPrototypeOf(Networking)).call(this, 'Networking'));

    _this._rnctx = rnctx;
    return _this;
  }

  babelHelpers.createClass(Networking, [{
    key: 'sendRequest',
    value: function sendRequest(method, url, requestId, headers, data, responseType, useIncrementalUpdates, timeout) {
      var _this2 = this;

      method = method.toUpperCase();
      if (method !== 'GET' && method !== 'POST' && method !== 'PATCH' && method !== 'PUT' && method !== 'DELETE') {
        throw new Error('Invalid method type');
      }
      var options = {
        method: method,
        headers: headers
      };

      if ((method === 'POST' || method === 'PATCH') && data) {
        if (data.string) {
          options.body = data.string;
        } else if (data.formData) {
          var form = new FormData();
          for (var i = 0; i < data.formData.length; i++) {
            form.append(data.formData[i].fieldName, data.formData[i].string);
          }
          options.body = form;
        } else if (data.string) {
          options.body = data.string;
        }
      }

      var request = new Request(url, options);
      fetch(request, options).then(function (response) {
        _this2._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['didReceiveNetworkResponse', [requestId, response.status, []]]);
        return responseType === 'text' ? response.text().then(function (text) {
          return _this2._handleText(requestId, text);
        }) : response.blob().then(function (blob) {
          return _this2._handleBase64(requestId, blob);
        });
      }).catch(function (res) {
        console.error(res);
      });
    }
  }, {
    key: '_handleText',
    value: function _handleText(requestId, responseData) {
      this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['didReceiveNetworkData', [requestId, responseData]]);

      this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['didCompleteNetworkResponse', [requestId, null]]);
    }
  }, {
    key: '_handleBase64',
    value: function _handleBase64(requestId, responseData) {
      var _this3 = this;

      var reader = new FileReader();
      reader.onload = function (event) {
        var index = event.target.result.indexOf(';base64,');
        index = index >= 0 ? index + 8 : index;

        _this3._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['didReceiveNetworkData', [requestId, event.target.result.slice(index)]]);

        _this3._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['didCompleteNetworkResponse', [requestId, null]]);
      };
      reader.readAsDataURL(responseData);
    }
  }]);
  return Networking;
}(_Module3.default);

exports.default = Networking;