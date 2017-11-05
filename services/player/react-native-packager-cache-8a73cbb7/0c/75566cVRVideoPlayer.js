Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVideoPlayer = getVideoPlayer;
exports.addCustomizedVideoPlayer = addCustomizedVideoPlayer;
exports.getCustomizedSupportedFormats = getCustomizedSupportedFormats;

var _BasicVideoPlayer = require('./BasicVideoPlayer');

var _BasicVideoPlayer2 = babelHelpers.interopRequireDefault(_BasicVideoPlayer);

var _getSupportedFormats = require('./getSupportedFormats');

var _getSupportedFormats2 = babelHelpers.interopRequireDefault(_getSupportedFormats);

var _customizedVideoPlayers = [];
var _customizedSupportCache = null;

function getVideoPlayer(videDef) {
  for (var i = 0; i < _customizedVideoPlayers.length; i++) {
    var player = _customizedVideoPlayers[i];
    var format = videDef ? videDef.format : null;

    if (player.supportedFormats == null || format == null || player.supportedFormats.indexOf(format) > -1) {
      return player;
    }
  }
  return _BasicVideoPlayer2.default;
}

function addCustomizedVideoPlayer(player) {
  _customizedVideoPlayers.push(player);
}

function getCustomizedSupportedFormats() {
  if (_customizedSupportCache) {
    return _customizedSupportCache;
  }
  _customizedSupportCache = (0, _getSupportedFormats2.default)();
  for (var i = 0; i < _customizedVideoPlayers.length; i++) {
    var player = _customizedVideoPlayers[i];
    if (player.supportedFormats) {
      var supportedFormats = player.supportedFormats;
      for (var j = 0; j < supportedFormats.length; j++) {
        if (_customizedSupportCache.indexOf(supportedFormats[j]) < 0) {
          _customizedSupportCache.push(supportedFormats[j]);
        }
      }
    }
  }
  return _customizedSupportCache;
}