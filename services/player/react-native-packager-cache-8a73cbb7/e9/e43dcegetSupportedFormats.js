Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSupportedFormats;


var FORMATS = {
  mp3: 'audio/mpeg; codecs="mp3"',
  m4a: 'audio/aac',
  ogg: 'audio/ogg; codecs="vorbis"',
  wav: 'audio/wav; codecs="1"',
  webm: 'audio/webm; codecs="vorbis"'
};

var supportCache = null;

function getSupportedFormats() {
  if (supportCache) {
    return supportCache;
  }

  var audio = document.createElement('audio');
  supportCache = [];
  for (var type in FORMATS) {
    var canPlay = audio.canPlayType(FORMATS[type]);
    if (canPlay.length && canPlay !== 'no') {
      supportCache.push(type);
    }
  }

  return supportCache;
}