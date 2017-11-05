

var EventEmitter = require('EventEmitter');

var MediaPlayerState = function (_EventEmitter) {
  babelHelpers.inherits(MediaPlayerState, _EventEmitter);

  function MediaPlayerState(options) {
    babelHelpers.classCallCheck(this, MediaPlayerState);

    var _this = babelHelpers.possibleConstructorReturn(this, (MediaPlayerState.__proto__ || Object.getPrototypeOf(MediaPlayerState)).call(this));

    _this.playStatus = 'closed';
    _this.duration = undefined;
    _this.currentTime = undefined;
    _this.volume = options.volume !== undefined ? options.volume : 1.0;
    _this.muted = options.muted || false;
    _this.autoPlay = options.autoPlay || false;

    _this.onDurationChange = _this.onDurationChange.bind(_this);
    _this.onTimeUpdate = _this.onTimeUpdate.bind(_this);
    _this.onPlayStatusChange = _this.onPlayStatusChange.bind(_this);
    return _this;
  }

  babelHelpers.createClass(MediaPlayerState, [{
    key: 'play',
    value: function play() {
      this.emit('play');
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.emit('pause');
    }
  }, {
    key: 'seekTo',
    value: function seekTo(timeSec) {
      this.emit('seekTo', timeSec);
    }
  }, {
    key: 'registerUserGesture',
    value: function registerUserGesture(commandID, commandArgs, reactTag) {
      this.emit('registerUserGesture', commandID, commandArgs, reactTag);
    }
  }, {
    key: 'unregisterUserGesture',
    value: function unregisterUserGesture(reactTag) {
      this.emit('unregisterUserGesture', reactTag);
    }
  }, {
    key: 'setVolume',
    value: function setVolume(value) {
      this.volume = value;
      this.emit('volumeChange', value);
    }
  }, {
    key: 'setMuted',
    value: function setMuted(value) {
      this.muted = value;
      this.emit('mutedChange', value);
    }
  }, {
    key: 'onDurationChange',
    value: function onDurationChange(event) {
      if (event.nativeEvent.duration) {
        this.duration = event.nativeEvent.duration;
        this.emit('durationChange', this.duration);
      }
    }
  }, {
    key: 'onTimeUpdate',
    value: function onTimeUpdate(event) {
      if (event.nativeEvent.currentTime) {
        this.currentTime = event.nativeEvent.currentTime;
        this.emit('timeUpdate', this.currentTime);
      }
    }
  }, {
    key: 'onPlayStatusChange',
    value: function onPlayStatusChange(event) {
      this.playStatus = event.nativeEvent.playStatus;
      this.emit('playStatusChange', this.playStatus);
      if (this.playStatus === 'ready' && this.autoPlay) {
        this.play();
      }
    }
  }]);
  return MediaPlayerState;
}(EventEmitter);

module.exports = MediaPlayerState;