Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VRVideoPlayer = require('./VRVideoPlayer');

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var VRVideoComponent = function () {
  function VRVideoComponent() {
    babelHelpers.classCallCheck(this, VRVideoComponent);

    this.videoPlayer = null;
    this.videoTextures = [];

    this.onMediaEvent = undefined;
    this._onMediaEvent = this._onMediaEvent.bind(this);
  }

  babelHelpers.createClass(VRVideoComponent, [{
    key: 'setVideo',
    value: function setVideo(videoDef) {
      this._freeVideoPlayer();
      this._freeTexture();
      this._setVideoDef(videoDef);

      this.videoPlayer = new ((0, _VRVideoPlayer.getVideoPlayer)(this.videoDef))();
      this.videoPlayer.onMediaEvent = this._onMediaEvent;

      var texture = new THREE.Texture(this.videoPlayer.videoElement);
      texture.generateMipmaps = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      this.videoTextures[0] = texture;


      if (this.videoDef) {
        var _videoDef = this.videoDef;
        if (this.videoPlayer) {
          this.videoPlayer.initializeVideo(_videoDef.src, _videoDef.metaData);
        }
      }
    }
  }, {
    key: '_setVideoDef',
    value: function _setVideoDef(videoDef) {
      this.videoDef = {
        src: videoDef.src,
        format: videoDef.format,
        metaData: videoDef.metaData
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
    key: '_freeVideoPlayer',
    value: function _freeVideoPlayer() {
      if (this.videoPlayer) {
        this.videoPlayer.dispose();
      }
      this.videoPlayer = null;
    }
  }, {
    key: '_freeTexture',
    value: function _freeTexture() {
      for (var i = 0; i < this.videoTextures.length; i++) {
        if (this.videoTextures[i]) {
          this.videoTextures[i].dispose();
        }
      }
      this.videoTextures = [];
    }
  }, {
    key: 'frame',
    value: function frame() {
      if (this.videoPlayer && this.videoPlayer.hasEnoughData()) {
        for (var i = 0; i < this.videoTextures.length; i++) {
          if (this.videoTextures[i]) {
            this.videoTextures[i].needsUpdate = true;
          }
        }
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._freeVideoPlayer();
      this._freeTexture();
      this.onMediaEvent = undefined;
    }
  }]);
  return VRVideoComponent;
}();

exports.default = VRVideoComponent;