Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSupportedFormats;


var FORMATS = {
  ogg: 'video/ogg; codecs="theora, vorbis"',
  mp4: 'video/mp4; codecs="avc1.4D401E, mp4a.40.2"',
  mkv: 'video/x-matroska; codecs="theora, vorbis"',
  webm: 'video/webm; codecs="vp8, vorbis"'
};

var supportCache = null;

function getSupportedFormats() {
  if (supportCache) {
    return supportCache;
  }

  var video = document.createElement('video');
  supportCache = [];
  for (var type in FORMATS) {
    var canPlay = video.canPlayType(FORMATS[type]);
    if (canPlay.length && canPlay !== 'no') {
      supportCache.push(type);
    }
  }

  return supportCache;
}