Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.videoTimeFormat = videoTimeFormat;
function videoTimeFormat(time) {
  if (!time) {
    return '--:--';
  }

  var timeS = Math.floor(time);
  var seconds = timeS % 60;
  var minutes = Math.floor(timeS / 60) % 60;
  var h = Math.floor(timeS / 3600);

  var mm = h ? ('0' + minutes).slice(-2) : minutes;
  var ss = ('0' + seconds).slice(-2);
  var timertext = h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  return timertext;
}