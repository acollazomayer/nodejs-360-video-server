Object.defineProperty(exports, "__esModule", {
  value: true
});


var MEDIA_EVENT_TYPES = ['canplay', 'durationchange', 'ended', 'error', 'timeupdate', 'pause', 'playing'];

var BasicVideoPlayer = function () {
  function BasicVideoPlayer() {
    babelHelpers.classCallCheck(this, BasicVideoPlayer);

    this.videoElement = document.createElement('video');
    this.videoElement.style.display = 'none';

    this.videoElement.setAttribute('playsinline', 'playsinline');
    this.videoElement.setAttribute('webkit-playsinline', 'webkit-playsinline');

    if (document.body) {
      document.body.appendChild(this.videoElement);
    }

    this._volume = 1.0;
    this._muted = false;

    this.onMediaEvent = undefined;
    this._onMediaEvent = this._onMediaEvent.bind(this);
  }

  babelHelpers.createClass(BasicVideoPlayer, [{
    key: 'initializeVideo',
    value: function initializeVideo(src, metaData) {
      this.videoElement.src = src;
      this.videoElement.crossOrigin = 'anonymous';
      this._bindMediaEvents();
      this.videoElement.load();
    }
  }, {
    key: 'hasEnoughData',
    value: function hasEnoughData() {
      return !!this.videoElement && this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA;
    }
  }, {
    key: '_bindMediaEvents',
    value: function _bindMediaEvents() {
      var _this = this;

      MEDIA_EVENT_TYPES.forEach(function (eventType) {
        _this.videoElement.addEventListener(eventType, _this._onMediaEvent);
      });
    }
  }, {
    key: '_unbindMediaEvents',
    value: function _unbindMediaEvents() {
      var _this2 = this;

      MEDIA_EVENT_TYPES.forEach(function (eventType) {
        _this2.videoElement.removeEventListener(eventType, _this2._onMediaEvent);
      });
    }
  }, {
    key: '_onMediaEvent',
    value: function _onMediaEvent(event) {
      if (typeof this.onMediaEvent === 'function') {
        this.onMediaEvent(event);
      }
    }
  }, {
    key: 'setVolume',
    value: function setVolume(volume) {
      this.videoElement.volume = volume;
    }
  }, {
    key: 'setMuted',
    value: function setMuted(muted) {
      this.videoElement.muted = muted;
    }
  }, {
    key: 'play',
    value: function play() {
      this.videoElement.play();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.videoElement.pause();
    }
  }, {
    key: 'seekTo',
    value: function seekTo(position) {
      this.videoElement.currentTime = position;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.pause();
      if (document.body) {
        document.body.removeChild(this.videoElement);
      }
      this.videoElement.src = '';
      this._unbindMediaEvents();
      this.onMediaEvent = undefined;
    }
  }]);
  return BasicVideoPlayer;
}();

BasicVideoPlayer.supportedFormats = null;
exports.default = BasicVideoPlayer;