Object.defineProperty(exports, "__esModule", {
  value: true
});
var MEDIA_ERR_ABORTED = exports.MEDIA_ERR_ABORTED = 1;var MEDIA_ERR_NETWORK = exports.MEDIA_ERR_NETWORK = 2;var MEDIA_ERR_DECODE = exports.MEDIA_ERR_DECODE = 3;var MEDIA_ERR_SRC_NOT_SUPPORTED = exports.MEDIA_ERR_SRC_NOT_SUPPORTED = 4;
var MediaError = function MediaError(code, message) {
  babelHelpers.classCallCheck(this, MediaError);

  this.code = code;
  this.message = message;
};

exports.default = MediaError;