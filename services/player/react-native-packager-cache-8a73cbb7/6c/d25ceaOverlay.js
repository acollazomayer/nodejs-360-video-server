
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _setStyles = require('./setStyles');

var _setStyles2 = _interopRequireDefault(_setStyles);

var _Glyphs = require('./Glyphs');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var fullscreenMethod = null;
if ('requestFullscreen' in Element.prototype) {
  fullscreenMethod = 'requestFullscreen';
} else if ('webkitRequestFullscreen' in Element.prototype) {
  fullscreenMethod = 'webkitRequestFullscreen';
} else if ('mozRequestFullScreen' in Element.prototype) {
  fullscreenMethod = 'mozRequestFullScreen';
} else if ('msRequestFullscreen' in Element.prototype) {
  fullscreenMethod = 'msRequestFullscreen';
}

var RAD_TO_DEG = 180 / Math.PI;

var OVERLAY_STYLES = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
  pointerEvents: 'none',
  userSelect: 'none'
};
var COMPASS_WRAPPER_STYLES = {
  backgroundColor: 'rgba(0,0,0,0.7)',
  borderRadius: '100%',
  height: '30px',
  marginTop: '-20px',
  padding: '5px',
  position: 'absolute',
  right: '20px',
  top: '50%',
  width: '30px'
};
var COMPASS_STYLES = {
  cursor: 'pointer',
  pointerEvents: 'initial',
  transformOrigin: '50% 50%'
};
var VR_BUTTON_STYLES = {
  background: 'rgba(0, 0, 0, 0.7)',
  border: '2px solid #ffffff',
  borderRadius: '5px',
  bottom: '20px',
  color: '#ffffff',
  cursor: 'pointer',
  display: 'none',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'normal',
  left: '18px',
  padding: '0 10px',
  pointerEvents: 'initial',
  position: 'absolute'
};
var VR_BUTTON_LABEL_STYLES = {
  display: 'inline-block',
  lineHeight: '38px',
  marginLeft: '10px',
  verticalAlign: 'top'
};
var FULLSCREEN_STYLES = {
  background: 'rgba(0, 0, 0, 0.7)',
  border: '2px solid #ffffff',
  borderRadius: '5px',
  bottom: '20px',
  cursor: 'pointer',
  display: 'inline-block',
  height: '30px',
  padding: '4px',
  pointerEvents: 'initial',
  position: 'absolute',
  right: '18px',
  verticalAlign: 'bottom',
  width: '30px'
};
var GYRO_WRAPPER_STYLES = {
  height: '40px',
  left: '50%',
  marginLeft: '-20px',
  marginTop: '-20px',
  position: 'absolute',
  top: '50%',
  width: '40px',
  transition: 'opacity 1s ease-out'
};
var SUPPORT_MESSAGE_STYLES = {
  background: 'rgba(0, 0, 0, 0.7)',
  border: '2px solid #ffffff',
  borderRadius: '5px',
  color: '#ffffff',
  cursor: 'default',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontSize: '16px',
  fontWeight: 'normal',
  left: '50%',
  lineHeight: '20px',
  padding: '10px',
  pointerEvents: 'initial',
  position: 'absolute',
  textAlign: 'center',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: '240px'
};
var SUPPORT_ACTIONS_STYLES = {
  paddingTop: '16px'
};
var SUPPORT_LEARN_MORE_STYLES = {
  color: '#ffffff',
  display: 'inline-block',
  marginRight: '40px',
  textDecoration: 'none'
};
var SUPPORT_CANCEL_STYLES = {
  color: '#ffffff',
  cursor: 'pointer'
};

var Overlay = function () {
  function Overlay() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Overlay);

    this.vrButtonHandler = options.vrButtonHandler;
    this.fullscreenButtonHandler = options.fullscreenButtonHandler;
    this.handleVRButton = this.handleVRButton.bind(this);
    this.handleFullscreenButton = this.handleFullscreenButton.bind(this);

    var overlayNode = document.createElement('div');
    (0, _setStyles2.default)(overlayNode, OVERLAY_STYLES);
    var vrButton = document.createElement('a');
    this.vrButton = vrButton;
    (0, _setStyles2.default)(vrButton, VR_BUTTON_STYLES);
    var vrGlyph = (0, _Glyphs.createViewInVrGlyph)(38, 38, '#ffffff');
    vrButton.appendChild(vrGlyph);
    var vrButtonLabel = document.createElement('span');
    (0, _setStyles2.default)(vrButtonLabel, VR_BUTTON_LABEL_STYLES);
    vrButtonLabel.appendChild(document.createTextNode('View in VR'));
    vrButton.appendChild(vrButtonLabel);
    vrButton.addEventListener('click', this.handleVRButton);
    var fullscreenButton = document.createElement('a');
    this.fullscreenButton = fullscreenButton;
    (0, _setStyles2.default)(fullscreenButton, FULLSCREEN_STYLES);
    var fullscreenGlyph = (0, _Glyphs.createFullscreenGlyph)(30, 30, '#ffffff');
    fullscreenButton.appendChild(fullscreenGlyph);
    fullscreenButton.title = 'Full Screen';
    fullscreenButton.style.display = fullscreenMethod && !options.hideFullscreen ? 'inline-block' : 'none';
    fullscreenButton.addEventListener('click', this.handleFullscreenButton);
    overlayNode.appendChild(vrButton);
    overlayNode.appendChild(fullscreenButton);

    var compassWrapper = document.createElement('div');
    (0, _setStyles2.default)(compassWrapper, COMPASS_WRAPPER_STYLES);
    compassWrapper.style.display = !options.hideCompass ? 'inline-block' : 'none';
    this.compass = (0, _Glyphs.createCompassGlyph)(30, 30, '#ffffff');
    (0, _setStyles2.default)(this.compass, COMPASS_STYLES);
    if (typeof options.resetAngles === 'function') {
      this.compass.addEventListener('click', options.resetAngles);
    }
    compassWrapper.appendChild(this.compass);
    overlayNode.appendChild(compassWrapper);

    this.gyro = null;
    try {
      var gyro = (0, _Glyphs.createGyroGlyph)(40, 40, '#ffffff');
      var gyroWrapper = document.createElement('div');
      (0, _setStyles2.default)(gyroWrapper, GYRO_WRAPPER_STYLES);
      gyroWrapper.appendChild(gyro);
      this.gyro = gyroWrapper;
      overlayNode.appendChild(gyroWrapper);
    } catch (e) {}

    this.domElement = overlayNode;
  }

  _createClass(Overlay, [{
    key: 'enableVRButton',
    value: function enableVRButton() {
      this.vrButton.style.display = 'inline-block';
      this.vrButton.style.color = '#ffffff';
      this.vrButton.style.borderColor = '#ffffff';
      this.vrButton.style.cursor = 'pointer';
    }

  }, {
    key: 'disableVRButton',
    value: function disableVRButton() {
      this.vrButton.style.color = '#a0a0a0';
      this.vrButton.style.borderColor = '#a0a0a0';
      this.vrButton.style.cursor = 'inherit';
    }

  }, {
    key: 'hideVRButton',
    value: function hideVRButton() {
      this.vrButton.style.display = 'none';
    }

  }, {
    key: 'setVRButtonText',
    value: function setVRButtonText(text) {
      this.vrButton.childNodes[1].childNodes[0].nodeValue = text;
    }

  }, {
    key: 'setVRButtonHandler',
    value: function setVRButtonHandler(cb) {
      this.vrButtonHandler = cb;
    }

  }, {
    key: 'handleVRButton',
    value: function handleVRButton() {
      if (this.vrButtonHandler) {
        this.vrButtonHandler();
      }
    }

  }, {
    key: 'handleFullscreenButton',
    value: function handleFullscreenButton() {
      if (this.fullscreenButtonHandler) {
        this.fullscreenButtonHandler(fullscreenMethod);
      }
    }

  }, {
    key: 'showGyro',
    value: function showGyro() {
      if (this.gyro) {
        this.gyro.style.opacity = 1;
      }
    }

  }, {
    key: 'hideGyro',
    value: function hideGyro() {
      if (this.gyro) {
        this.gyro.style.opacity = 0;
      }
    }

  }, {
    key: 'showSupportMessage',
    value: function showSupportMessage() {
      var _this = this;

      if (this.supportMessage) {
        this.domElement.appendChild(this.supportMessage);
        return;
      }
      var message = document.createElement('div');
      (0, _setStyles2.default)(message, SUPPORT_MESSAGE_STYLES);
      this.supportMessage = message;

      var text = document.createElement('div');
      text.appendChild(document.createTextNode('Install a WebVR-enabled browser to experience VR on this device'));
      message.appendChild(text);

      var actions = document.createElement('div');
      (0, _setStyles2.default)(actions, SUPPORT_ACTIONS_STYLES);

      var learnMore = document.createElement('a');
      (0, _setStyles2.default)(learnMore, SUPPORT_LEARN_MORE_STYLES);
      learnMore.href = 'https://webvr.info/';
      learnMore.target = '_blank';
      learnMore.appendChild(document.createTextNode('Learn More'));

      var cancel = document.createElement('a');
      (0, _setStyles2.default)(cancel, SUPPORT_CANCEL_STYLES);
      cancel.appendChild(document.createTextNode('Cancel'));
      cancel.addEventListener('click', function () {
        _this.hideSupportMessage();
      });
      actions.appendChild(learnMore);
      actions.appendChild(cancel);
      message.appendChild(actions);
      this.domElement.appendChild(message);
    }

  }, {
    key: 'hideSupportMessage',
    value: function hideSupportMessage() {
      if (this.supportMessage) {
        this.domElement.removeChild(this.supportMessage);
      }
    }

  }, {
    key: 'setFullscreenButtonVisibility',
    value: function setFullscreenButtonVisibility(show) {
      this.fullscreenButton.style.display = fullscreenMethod && show ? 'inline-block' : 'none';
    }

  }, {
    key: 'setCompassAngle',
    value: function setCompassAngle(rad) {
      var deg = -1 * rad * RAD_TO_DEG;
      this.compass.style.transform = 'rotate(' + deg + 'deg)';
    }
  }]);

  return Overlay;
}();

exports.default = Overlay;