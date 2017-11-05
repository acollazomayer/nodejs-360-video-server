Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VRAudioBufferManager = require('./VRAudioBufferManager');

var VRAudioBufferManager = babelHelpers.interopRequireWildcard(_VRAudioBufferManager);

var _MediaError = require('./MediaError');

var _MediaError2 = babelHelpers.interopRequireDefault(_MediaError);

var VRAudioBufferSource = function () {
  function VRAudioBufferSource(vrAudioContext) {
    babelHelpers.classCallCheck(this, VRAudioBufferSource);

    this._vrAudioContext = vrAudioContext;
    this._playbackTime = 0;
    this._startTime = 0;
    this._isPlaying = false;
    this._error = null;
    this._ended = false;
    this.onMediaEvent = undefined;
  }

  babelHelpers.createClass(VRAudioBufferSource, [{
    key: 'initializeAudio',
    value: function initializeAudio(url) {
      var _this = this;

      if (this.url && this._buffer) {
        VRAudioBufferManager.releaseRef(this.url);
      }

      this.stopSourceNode();
      this._playbackTime = 0;
      this._buffer = null;
      this._error = null;
      this._ended = false;

      this.url = url;
      VRAudioBufferManager.fetch(url, this._vrAudioContext, function (buffer, error) {
        if (error) {
          console.warn('Failed to fetch audio:', url);
          _this._error = error;
          _this._onMediaEvent(_this.createMediaEvent('error'));
        } else {
          _this._buffer = buffer;
          _this._onMediaEvent(_this.createMediaEvent('canplay'));
          _this._onMediaEvent(_this.createMediaEvent('durationchange'));
        }
      });
    }
  }, {
    key: 'createMediaEvent',
    value: function createMediaEvent(type) {
      var duration = this._buffer ? this._buffer.duration : 0;
      var currentTime = this._isPlaying ? this._vrAudioContext.getWebAudioContext().currentTime - this._startTime + this._playbackTime : this._playbackTime;
      return {
        type: type,
        timeStamp: Date.now(),
        target: {
          currentTime: currentTime,
          duration: duration,
          ended: this._ended,
          error: this._error
        }
      };
    }
  }, {
    key: 'getSourceNode',
    value: function getSourceNode() {
      return this._sourceNode;
    }
  }, {
    key: '_onMediaEvent',
    value: function _onMediaEvent(event) {
      if (typeof this.onMediaEvent === 'function') {
        this.onMediaEvent(event);
      }
    }
  }, {
    key: 'play',
    value: function play() {
      if (this._isPlaying) return;
      this.playSourceNode();
      this._onMediaEvent(this.createMediaEvent('playing'));
    }
  }, {
    key: 'playSourceNode',
    value: function playSourceNode() {
      var _this2 = this;

      this.stopSourceNode();
      var sourceNode = this._vrAudioContext.getWebAudioContext().createBufferSource();
      this._sourceNode = sourceNode;
      sourceNode.onended = function () {
        _this2.stopSourceNode();
        _this2._playbackTime = 0;
        _this2._ended = true;
        _this2._onMediaEvent(_this2.createMediaEvent('ended'));
      };
      if (!this._buffer) {
        console.warn('play() called before audio loaded for url', this.url);
        return;
      }
      sourceNode.buffer = this._buffer;
      sourceNode.start(0, this._playbackTime);
      this._ended = false;
      this._isPlaying = true;
      this._startTime = this._vrAudioContext.getWebAudioContext().currentTime;
    }
  }, {
    key: 'seekTo',
    value: function seekTo(playbackTime) {
      if (this._buffer) {
        playbackTime = playbackTime || 0;

        if (playbackTime < -this._buffer.duration || playbackTime > this._buffer.duration) {
          console.warn('seekTo() time out of range: ' + playbackTime);
          playbackTime = 0;
        } else if (playbackTime < 0) {
          playbackTime = this._buffer.duration + playbackTime;
        }

        if (this._isPlaying) {
          this.stopSourceNode();
          this._playbackTime = playbackTime;
          this.playSourceNode();
        } else {
          this._playbackTime = playbackTime;
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (!this._isPlaying) return;

      this.stopSourceNode();
      this._playbackTime = this._vrAudioContext.getWebAudioContext().currentTime - this._startTime + this._playbackTime;
      this._onMediaEvent(this.createMediaEvent('pause'));
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (!this._isPlaying) return;

      this.stopSourceNode();
      this._playbackTime = 0;
      this._ended = true;
      this._onMediaEvent(this.createMediaEvent('ended'));
    }
  }, {
    key: 'stopSourceNode',
    value: function stopSourceNode() {
      var sourceNode = this._sourceNode;
      if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
        this._sourceNode = undefined;
      }
      this._isPlaying = false;
    }
  }, {
    key: 'frame',
    value: function frame() {
      if (this._isPlaying) {
        this._onMediaEvent(this.createMediaEvent('timeupdate'));
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.stopSourceNode();
      if (this.url && this._buffer) {
        VRAudioBufferManager.releaseRef(this.url);
      }
      this.onMediaEvent = undefined;
    }
  }, {
    key: 'isPlaying',
    get: function get() {
      return this._isPlaying;
    }
  }]);
  return VRAudioBufferSource;
}();

exports.default = VRAudioBufferSource;