
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/VrButton/VrButton.js';
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var ViewStylePropTypes = require('ViewStylePropTypes');
var VrSoundEffects = require('VrSoundEffects');
var keyMirror = require('fbjs/lib/keyMirror');

var States = keyMirror({
  FOCUS_OUT: null,
  FOCUS_IN: null,
  FOCUS_IN_PRESS: null,
  FOCUS_IN_LONG_PRESS: null,
  ERROR: null
});

var IsPressingIn = {
  FOCUS_IN_PRESS: true,
  FOCUS_IN_LONG_PRESS: true
};

var IsLongPressingIn = {
  FOCUS_IN_LONG_PRESS: true
};

var Signals = keyMirror({
  ENTER: null,
  EXIT: null,
  KEY_PRESSED: null,
  KEY_RELEASED: null,
  LONG_PRESS_DETECTED: null
});

var Transitions = {
  FOCUS_OUT: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_OUT,
    KEY_RELEASED: States.FOCUS_OUT,
    LONG_PRESS_DETECTED: States.ERROR
  },
  FOCUS_IN: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.ERROR
  },
  FOCUS_IN_PRESS: {
    ENTER: States.FOCUS_IN_PRESS,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.FOCUS_IN_LONG_PRESS
  },
  FOCUS_IN_LONG_PRESS: {
    ENTER: States.FOCUS_IN_LONG_PRESS,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_IN_LONG_PRESS,
    KEY_RELEASED: States.FOCUS_IN,
    LONG_PRESS_DETECTED: States.FOCUS_IN_LONG_PRESS
  },
  ERROR: {
    ENTER: States.FOCUS_IN,
    EXIT: States.FOCUS_OUT,
    KEY_PRESSED: States.FOCUS_OUT,
    KEY_RELEASED: States.FOCUS_OUT,
    LONG_PRESS_DETECTED: States.FOCUS_OUT
  }
};

var SOUND_PROP_NAMES = ['onClickSound', 'onLongClickSound', 'onEnterSound', 'onExitSound'];

var LONG_PRESS_THRESHOLD = 500;

var VrButton = React.createClass({
  displayName: 'VrButton',

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(ViewStylePropTypes),

    disabled: PropTypes.bool,

    ignoreLongClick: PropTypes.bool,

    onClick: PropTypes.func,

    onLongClick: PropTypes.func,

    longClickDelayMS: PropTypes.number,

    onEnter: PropTypes.func,

    onExit: PropTypes.func,

    onButtonPress: PropTypes.func,

    onButtonRelease: PropTypes.func,

    onClickSound: PropTypes.object,

    onLongClickSound: PropTypes.object,

    onEnterSound: PropTypes.object,

    onExitSound: PropTypes.object
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      ignoreLongClick: false
    };
  },

  getInitialState: function getInitialState() {
    return {
      buttonState: States.FOCUS_OUT
    };
  },

  componentWillMount: function componentWillMount() {
    for (var _iterator = SOUND_PROP_NAMES, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var name = _ref;

      var resource = this.props[name];
      if (resource) {
        VrSoundEffects.load(resource);
      }
    }
    if (this.props.ignoreLongClick && this.props.onLongClick) {
      console.warn('VrButton ignoring onLongClick property since ignoreLongClick is true');
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    for (var _iterator2 = SOUND_PROP_NAMES, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var name = _ref2;

      var resource = VrSoundEffects.getSupportedResource(this.props[name]);
      var nextResource = VrSoundEffects.getSupportedResource(nextProps[name]);
      var uri = resource ? resource.uri : null;
      var nextUri = nextResource ? nextResource.uri : null;
      if (uri !== nextUri) {
        nextResource && VrSoundEffects.load(nextResource);
        resource && VrSoundEffects.unload(resource);
      }
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);

    for (var _iterator3 = SOUND_PROP_NAMES, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var name = _ref3;

      var resource = this.props[name];
      resource && VrSoundEffects.unload(resource);
    }
  },

  _isKeyReleased: function _isKeyReleased(event) {
    return event.type === 'GamepadInputEvent' && event.button === 0 && event.eventType === 'keyup' || event.type === 'KeyboardInputEvent' && event.code === 'Space' && event.eventType === 'keyup' || event.type === 'MouseInputEvent' && event.button === 0 && event.eventType === 'mouseup' || event.type === 'TouchInputEvent' && event.eventType === 'touchend';
  },

  _isKeyPressed: function _isKeyPressed(event) {
    return event.type === 'GamepadInputEvent' && event.button === 0 && event.eventType === 'keydown' && !event.repeat || event.type === 'KeyboardInputEvent' && event.code === 'Space' && event.eventType === 'keydown' && !event.repeat || event.type === 'MouseInputEvent' && event.button === 0 && event.eventType === 'mousedown' || event.type === 'TouchInputEvent' && (event.eventType === 'touchstart' || event.eventType === 'touchmove');
  },

  _onInput: function _onInput(event) {
    if (this.props.disabled) {
      return;
    }

    if (this._isKeyReleased(event.nativeEvent.inputEvent)) {
      this._receiveSignal(Signals.KEY_RELEASED, event);
    } else if (this._isKeyPressed(event.nativeEvent.inputEvent)) {
      this._receiveSignal(Signals.KEY_PRESSED, event);
    }
  },

  _onEnter: function _onEnter(event) {
    if (this.props.disabled) {
      return;
    }

    this._receiveSignal(Signals.ENTER, event);
    this.props.onEnter && this.props.onEnter(event);
    var resource = this.props.onEnterSound;
    resource && VrSoundEffects.play(resource);
  },

  _onExit: function _onExit(event) {
    if (this.props.disabled) {
      return;
    }

    this._receiveSignal(Signals.EXIT, event);
    this.props.onExit && this.props.onExit(event);
    var resource = this.props.onExitSound;
    resource && VrSoundEffects.play(resource);
  },

  _cancelLongPressDelayTimeout: function _cancelLongPressDelayTimeout() {
    this.longPressDelayTimeout && clearTimeout(this.longPressDelayTimeout);
    this.longPressDelayTimeout = null;
  },

  _handleLongDelay: function _handleLongDelay(event) {
    this.longPressDelayTimeout = null;
    var curState = this.state.buttonState;
    if (!IsPressingIn[curState]) {
      console.error('Attempted to transition from state `' + curState + '` to `' + States.FOCUS_IN_LONG_PRESS + '`, which is not supported. This is ' + 'most likely due to `VrButton.longPressDelayTimeout` not being canceled.');
    } else {
      this._receiveSignal(Signals.LONG_PRESS_DETECTED, event);
    }
  },

  _receiveSignal: function _receiveSignal(signal, event) {
    var curState = this.state.buttonState;
    var nextState = Transitions[curState] && Transitions[curState][signal];
    if (!nextState) {
      console.error('Unrecognized signal `' + signal + '` or state `' + curState);
    }
    if (nextState === States.ERROR) {
      console.error('VrButton cannot transition from `' + curState + '` to `' + signal);
    }
    if (curState !== nextState) {
      this._performSideEffectsForTransition(curState, nextState, signal, event);
      this.state.buttonState = nextState;
    }
  },

  _performSideEffectsForTransition: function _performSideEffectsForTransition(curState, nextState, signal, event) {
    var isFinalSignal = signal === Signals.EXIT || signal === Signals.KEY_RELEASED;
    if (isFinalSignal) {
      this._cancelLongPressDelayTimeout();
    }

    if (!IsPressingIn[curState] && IsPressingIn[nextState] && signal === Signals.KEY_PRESSED) {
      this._cancelLongPressDelayTimeout();
      var longDelayMS = this.props.longClickDelayMS ? Math.max(this.props.longClickDelayMS, 10) : LONG_PRESS_THRESHOLD;
      this.longPressDelayTimeout = setTimeout(this._handleLongDelay.bind(this, event), longDelayMS);
    }

    if (IsPressingIn[curState] && signal === Signals.KEY_RELEASED) {
      if (IsLongPressingIn[curState] && (this.props.onLongClick || this.props.ignoreLongClick)) {
        if (!this.props.ignoreLongClick) {
          this.props.onLongClick(event);
          var resource = this.props.onLongClickSound;
          resource && VrSoundEffects.play(resource);
        }
      } else {
        this.props.onClick && this.props.onClick(event);
        var _resource = this.props.onClickSound;
        _resource && VrSoundEffects.play(_resource);
      }

      this.props.onButtonRelease && this.props.onButtonRelease(event);
    }

    if (!IsPressingIn[curState] && IsPressingIn[nextState] && signal === Signals.KEY_PRESSED) {
      this.props.onButtonPress && this.props.onButtonPress(event);
    }
  },

  _resetButtonState: function _resetButtonState() {
    this._cancelLongPressDelayTimeout();
    this.state.buttonState = States.FOCUS_OUT;
  },

  render: function render() {
    if (this.props.disabled) {
      this._resetButtonState();
    }
    return React.createElement(
      View,
      babelHelpers.extends({}, this.props, {
        onInput: this._onInput,
        onEnter: this._onEnter,
        onExit: this._onExit,
        testID: this.props.testID, __source: {
          fileName: _jsxFileName,
          lineNumber: 455
        }
      }),
      this.props.children
    );
  }
});

module.exports = VrButton;