Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = fetch;
exports.releaseRef = releaseRef;

var _MediaError = require('./MediaError');

var _MediaError2 = babelHelpers.interopRequireDefault(_MediaError);

var _cache = {};
var _pendingRequest = {};

function fetch(url, audioContext, onLoad) {
  if (_cache[url]) {
    _cache[url].ref++;
    onLoad(_cache[url].buffer, null);
  }
  if (!_pendingRequest[url]) {
    _pendingRequest[url] = [onLoad];

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function () {
      if (xhr.status === 200) {
        audioContext.getWebAudioContext().decodeAudioData(xhr.response, function (buffer) {
          _onRequestSucceed(url, buffer);
        }, function (message) {
          _onRequestError(url, new _MediaError2.default(_MediaError.MEDIA_ERR_DECODE, '[VRAudioBufferSource] Decoding failure: ' + url + ' (' + message + ')'));
        });
      } else {
        _onRequestError(url, new _MediaError2.default(_MediaError.MEDIA_ERR_NETWORK, '[VRAudioBufferSource] XHR Error: ' + url + ' (' + xhr.statusText + ')'));
      }
    };

    xhr.onerror = function (event) {
      _onRequestError(url, new _MediaError2.default(_MediaError.MEDIA_ERR_NETWORK, '[VRAudioBufferSource] XHR Network failure: ' + url));
    };

    xhr.send();
  } else {
    _pendingRequest[url].push(onLoad);
  }
}

function releaseRef(url) {
  if (_cache[url]) {
    _cache[url].ref--;
    if (_cache[url].ref <= 0) {
      delete _cache[url];
    }
  }
}

function _onRequestSucceed(url, buffer) {
  var pendingRequest = _pendingRequest[url];
  delete _pendingRequest[url];
  _cache[url] = {
    buffer: buffer,
    ref: pendingRequest.length
  };
  pendingRequest.map(function (_onLoad) {
    _onLoad(_cache[url].buffer, null);
  });
}

function _onRequestError(url, error) {
  var pendingRequest = _pendingRequest[url];
  delete _pendingRequest[url];
  pendingRequest.map(function (_onLoad) {
    _onLoad(null, error);
  });
}