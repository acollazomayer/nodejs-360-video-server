Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RCTVideoPlayer;

var _getSupportedFormats = require('../Video/getSupportedFormats');

var _getSupportedFormats2 = babelHelpers.interopRequireDefault(_getSupportedFormats);

function RCTVideoPlayer(rnctx, tag) {
  this._rnctx = rnctx;
  this._videoModule = rnctx.VideoModule;
  this._tag = tag;

  this._counter = 0;
  this._handle = null;
  this._PlayStatus = 'closed';

  this._source = null;
  this._poster = null;
  this._playControl = null;
  this._autoPlay = false;
  this._loop = false;
  this._muted = null;
  this._volume = 1.0;

  this.onUpdateTexture = undefined;
  this.onEmitEvent = undefined;
  this._onCanPlay = this._onCanPlay.bind(this);
  this._onPlaying = this._onPlaying.bind(this);
  this._onPause = this._onPause.bind(this);
  this._onEnded = this._onEnded.bind(this);
  this._onError = this._onError.bind(this);
  this._onDurationChange = this._onDurationChange.bind(this);
  this._onTimeUpdate = this._onTimeUpdate.bind(this);
}

RCTVideoPlayer.prototype = babelHelpers.extends(Object.create(Object.prototype), {
  constructor: RCTVideoPlayer,

  _updateTexture: function _updateTexture() {
    var source = this._handle ? babelHelpers.extends({}, this._source, {
      uri: 'MonoTexture://' + this._handle
    }) : null;
    this.onUpdateTexture && this.onUpdateTexture(source);
  },
  _updateTextureWithPoster: function _updateTextureWithPoster(usePoster) {
    this.onUpdateTexture && this.onUpdateTexture(this._poster);
  },
  _onCanPlay: function _onCanPlay(handle, event) {
    if (handle !== this._handle) {
      return;
    }
    if (!this._poster) {
      this._updateTexture();
    }
    this._updatePlayStatus('ready');

    if (this._autoPlay && this._playControl !== 'pause' || this._playControl === 'play') {
      this._videoModule.play(handle);
    }
  },
  _onPlaying: function _onPlaying() {
    this._updatePlayStatus('playing');
    this._updateTexture();
  },
  _onPause: function _onPause() {
    this._updatePlayStatus('paused');
  },
  _onEnded: function _onEnded(handle, event) {
    if (handle !== this._handle) {
      return;
    }
    this._updatePlayStatus('ended');

    if (this._loop && this._playControl !== 'pause') {
      this._videoModule.play(handle);
    }
    this._emitEvent('topEnded', []);
  },
  _onError: function _onError(handle, event) {
    if (handle !== this._handle) {
      return;
    }
    this._updatePlayStatus('error');
  },
  _onDurationChange: function _onDurationChange(handle, event) {
    if (handle !== this._handle) {
      return;
    }
    var duration = event.target && event.target.duration;
    if (duration) {
      this._emitEvent('topDurationChange', { duration: duration });
    }
  },
  _onTimeUpdate: function _onTimeUpdate(handle, event) {
    if (handle !== this._handle) {
      return;
    }
    var currentTime = event.target && event.target.currentTime;
    if (currentTime) {
      this._emitEvent('topTimeUpdate', { currentTime: currentTime });
    }
  },
  _chooseSupportSource: function _chooseSupportSource(source) {
    if (Array.isArray(source)) {
      for (var i = 0; i < source.length; i++) {
        var sourceInst = source[i];
        if (sourceInst && typeof sourceInst === 'object' && 'uri' in sourceInst) {
          if ('format' in sourceInst) {
            if ((0, _getSupportedFormats2.default)().indexOf(sourceInst.format) > -1) {
              return sourceInst;
            }
          } else {
            return sourceInst;
          }
        }
      }

      if (__DEV__) {
        console.warn('No supported video format found in video source');
      }
      return null;
    } else if (source) {
      return source;
    } else {
      return null;
    }
  },
  setSource: function setSource(source) {
    var choseSource = this._chooseSupportSource(source);
    var prevUrl = this._source ? this._source.uri : null;
    var curUrl = choseSource ? choseSource.uri : null;
    var curFormat = choseSource ? choseSource.format : null;
    if (source && !curUrl) {
      if (__DEV__) {
        console.warn("Video source must be in format {uri: 'http'} " + "or [{uri: 'http', format: 'mp4'}, {uri: 'http', format: 'webm'}, ..]");
      }
    }
    this._source = choseSource;

    if (prevUrl !== curUrl) {
      if (!curUrl) {
        var prevHandle = this._handle;
        this._handle = null;
        if (prevHandle) {
          this._updateTexture();
          this._videoModule.unload(prevHandle);
        }
        this._updatePlayStatus('closed');
      } else {
        var _prevHandle = this._handle;
        this._counter += 1;
        this._handle = [curUrl, this._tag, this._counter].join('-');
        this._videoModule.addHandle(this._handle);
        this._videoModule.setUrl(this._handle, curUrl);
        this._videoModule.setFormat(this._handle, curFormat);
        if (this._source.metaData) {
          this._videoModule.setMetaData(this._handle, this._source.metaData);
        }

        this._videoModule._addMediaEventListener(this._handle, 'canplay', this._onCanPlay);
        this._videoModule._addMediaEventListener(this._handle, 'playing', this._onPlaying);
        this._videoModule._addMediaEventListener(this._handle, 'pause', this._onPause);
        this._videoModule._addMediaEventListener(this._handle, 'ended', this._onEnded);
        this._videoModule._addMediaEventListener(this._handle, 'error', this._onError);
        this._videoModule._addMediaEventListener(this._handle, 'durationchange', this._onDurationChange);
        this._videoModule._addMediaEventListener(this._handle, 'timeupdate', this._onTimeUpdate);
        this._videoModule.load(this._handle);
        if (_prevHandle) {
          this._videoModule.unload(_prevHandle);
        }
        this._updatePlayStatus('loading');
        if (this._poster) {
          this._updateTextureWithPoster();
        }
      }
      this._updateVideoStates();
    }
  },
  setPoster: function setPoster(url) {
    this._poster = url;
    if (this._PlayStatus === 'loading') {
      this._updateTextureWithPoster();
    }
  },


  _emitEvent: function _emitEvent(eventType, args) {
    this.onEmitEvent && this.onEmitEvent(eventType, args);
  },

  _updatePlayStatus: function _updatePlayStatus(status) {
    if (this._PlayStatus !== status) {
      this._PlayStatus = status;
      this._emitEvent('topPlayStatusChange', { playStatus: this._PlayStatus });
    }
  },

  _updateVideoStates: function _updateVideoStates() {
    if (this._handle) {
      this._videoModule.setMuted(this._handle, this._muted);
      this._videoModule.setVolume(this._handle, this._volume);
    }
  },

  play: function play() {
    if (this._handle) {
      this._videoModule.play(this._handle);
    }
  },
  pause: function pause() {
    if (this._handle) {
      this._videoModule.pause(this._handle);
    }
  },
  seekTo: function seekTo(position) {
    this._videoModule.seekTo(this._handle, position);
  },
  setPlayControl: function setPlayControl(playControl) {
    this._playControl = playControl;
    if (!this._handle) {
      return;
    }

    if (this._playControl === 'pause') {
      this._videoModule.pause(this._handle);
    } else if (this._playControl === 'play') {
      this._videoModule.play(this._handle);
    }
  },
  setAutoPlay: function setAutoPlay(autoPlay) {
    this._autoPlay = autoPlay;
  },
  setLoop: function setLoop(loop) {
    this._loop = loop;
  },
  setMuted: function setMuted(muted) {
    this._muted = muted;
    if (this._handle) {
      this._videoModule.setMuted(this._handle, this._muted);
    }
  },
  setVolume: function setVolume(volume) {
    volume = typeof volume === 'number' ? volume : 1.0;
    this._volume = volume;
    if (this._handle) {
      this._videoModule.setVolume(this._handle, this._volume);
    }
  },
  dispose: function dispose() {
    if (this._handle) {
      this._videoModule.unload(this._handle);
    }
  }
});