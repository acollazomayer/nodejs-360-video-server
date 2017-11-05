Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VRAudioBufferSource = require('./VRAudioBufferSource');

var _VRAudioBufferSource2 = babelHelpers.interopRequireDefault(_VRAudioBufferSource);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);


var DEFAULT_VOLUME = 1.0;
var DEFAULT_PANNING_MODEL = 'HRTF';
var DEFAULT_DISTANCE_MODEL = 'inverse';
var DEFAULT_CONE_INNER_ANGLE = 60;
var DEFAULT_CONE_OUTER_ANGLE = 120;
var DEFAULT_CONE_OUTER_GAIN = 0.25;

var VRAudioComponent = function () {
  function VRAudioComponent(vrAudioContext, audioConfig) {
    babelHelpers.classCallCheck(this, VRAudioComponent);

    this._vrAudioContext = vrAudioContext;
    this.audioConfig = audioConfig;

    this._position = new THREE.Vector3(0, 0, 0);
    this._rotation = new THREE.Euler(0, 0, 0, 'XYZ');

    this._volume = DEFAULT_VOLUME;
    this._muted = false;

    this._gain = this._vrAudioContext.getWebAudioContext().createGain();
    this.updateGainValue();

    this._panner = undefined;

    this.onMediaEvent = undefined;
    this._onMediaEvent = this._onMediaEvent.bind(this);
  }

  babelHelpers.createClass(VRAudioComponent, [{
    key: '_setAudioDef',
    value: function _setAudioDef(audioDef) {
      this.audioDef = {
        streamingType: audioDef.streamingType,
        src: audioDef.src
      };
    }
  }, {
    key: '_onMediaEvent',
    value: function _onMediaEvent(event) {
      if (typeof this.onMediaEvent === 'function') {
        this.onMediaEvent(event);
      }
    }
  }, {
    key: '_createPanner',
    value: function _createPanner() {
      var audioConfig = this.audioConfig;
      this._panner = this._vrAudioContext.getWebAudioContext().createPanner();
      this._panner.panningModel = audioConfig.panningModel ? audioConfig.panningModel : DEFAULT_PANNING_MODEL;
      this._panner.distanceModel = audioConfig.distanceModel ? audioConfig.distanceModel : DEFAULT_DISTANCE_MODEL;
      this._panner.coneInnerAngle = audioConfig.coneInnerAngle ? audioConfig.coneInnerAngle : DEFAULT_CONE_INNER_ANGLE;
      this._panner.coneOuterAngle = audioConfig.coneOuterAngle ? audioConfig.coneOuterAngle : DEFAULT_CONE_OUTER_ANGLE;
      this._panner.coneOuterGain = audioConfig.coneOuterGain ? audioConfig.coneOuterGain : DEFAULT_CONE_OUTER_GAIN;
    }
  }, {
    key: '_connectNodes',
    value: function _connectNodes() {
      var nodes = [];
      if (this._source) {
        var srcNode = this._source.getSourceNode();
        if (srcNode) {
          nodes.push(srcNode);
        }
      }
      if (this._gain) {
        nodes.push(this._gain);
      }
      if (this._panner) {
        nodes.push(this._panner);
      }
      for (var i = 0; i < nodes.length - 1; i++) {
        nodes[i].connect(nodes[i + 1]);
      }
      if (nodes.length > 0) {
        var destNode = this._vrAudioContext.getWebAudioContext().destination;
        nodes[nodes.length - 1].connect(destNode);
      }
    }
  }, {
    key: '_disconnectNodes',
    value: function _disconnectNodes() {
      if (this._gain) {
        this._gain.disconnect();
      }
      if (this._panner) {
        this._panner.disconnect();
      }
    }
  }, {
    key: '_freeSource',
    value: function _freeSource() {
      if (this._source) {
        this._source.dispose();
        this._source = undefined;
      }
    }
  }, {
    key: 'setAudio',
    value: function setAudio(audioDef) {
      this._disconnectNodes();
      this._freeSource();
      this._setAudioDef(audioDef);

      this._source = new _VRAudioBufferSource2.default(this._vrAudioContext);
      this._source.onMediaEvent = this._onMediaEvent;

      this._source.initializeAudio(this.audioDef.src);
    }
  }, {
    key: 'play',
    value: function play() {
      if (this._source) {
        var source = this._source;
        this._disconnectNodes();
        source.play();
        this._connectNodes();
      }
    }
  }, {
    key: 'seekTo',
    value: function seekTo(playbackTime) {
      if (this._source) {
        var source = this._source;
        this._disconnectNodes();
        source.seekTo(playbackTime);
        if (source.isPlaying) {
          this._connectNodes();
        }
      }
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this._source) {
        this._source.pause();
        this._disconnectNodes();
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._source) {
        this._source.stop();
        this._disconnectNodes();
      }
    }
  }, {
    key: 'updateGainValue',
    value: function updateGainValue() {
      var gain = this._muted ? 0 : this._volume;
      this._gain.gain.value = gain;
    }
  }, {
    key: 'frame',
    value: function frame() {
      if (this._source) {
        this._source.frame();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disconnectNodes();
      this._freeSource();
      this.onMediaEvent = undefined;
    }
  }, {
    key: 'position',
    get: function get() {
      return this._position;
    },
    set: function set(value) {
      if (!this._panner) {
        this._createPanner();
      }
      this._position.copy(value);
      if (this._panner) {
        this._panner.setPosition(this._position.x, this._position.y, this._position.z);
      }
    }
  }, {
    key: 'rotation',
    get: function get() {
      return this._rotation;
    },
    set: function set(value) {
      if (!this._panner) {
        this._createPanner();
      }
      this._rotation.copy(value);
      var front = new THREE.Vector3(0, 0, -1);
      front.applyEuler(this._rotation);
      if (this._panner) {
        this._panner.setOrientation(front.x, front.y, front.z);
      }
    }
  }, {
    key: 'volume',
    get: function get() {
      return this._volume;
    },
    set: function set(value) {
      this._volume = value;
      this.updateGainValue();
    }
  }, {
    key: 'muted',
    get: function get() {
      return this._muted;
    },
    set: function set(value) {
      this._muted = value;
      this.updateGainValue();
    }
  }]);
  return VRAudioComponent;
}();

exports.default = VRAudioComponent;