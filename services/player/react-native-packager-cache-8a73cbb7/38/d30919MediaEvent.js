Object.defineProperty(exports, "__esModule", {
  value: true
});

var MediaEvent = function MediaEvent(event) {
  babelHelpers.classCallCheck(this, MediaEvent);

  this.type = event.type;
  this.timeStamp = event.timeStamp;
  if (event.target) {
    this.target = {};
    this.target.currentTime = event.target.currentTime;
    this.target.duration = event.target.duration;
    this.target.ended = event.target.ended;
    this.target.error = event.target.error;
  }
};

exports.default = MediaEvent;