
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Touchable/TouchableOpacity.js';


var Animated = require('Animated');
var Easing = require('Easing');
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var TimerMixin = require('react-timer-mixin');
var Touchable = require('Touchable');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

var ensurePositiveDelayProps = require('ensurePositiveDelayProps');
var flattenStyle = require('flattenStyle');

var PRESS_RETENTION_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

var TouchableOpacity = React.createClass({
  displayName: 'TouchableOpacity',

  mixins: [TimerMixin, Touchable.Mixin, NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, TouchableWithoutFeedback.propTypes, {
    activeOpacity: React.PropTypes.number,
    focusedOpacity: React.PropTypes.number,

    tvParallaxProperties: React.PropTypes.object
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      activeOpacity: 0.2,
      focusedOpacity: 0.7
    };
  },

  getInitialState: function getInitialState() {
    return babelHelpers.extends({}, this.touchableGetInitialState(), {
      anim: new Animated.Value(1)
    });
  },

  componentDidMount: function componentDidMount() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    ensurePositiveDelayProps(nextProps);
  },

  setOpacityTo: function setOpacityTo(value, duration) {
    Animated.timing(this.state.anim, {
      toValue: value,
      duration: duration,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true
    }).start();
  },

  touchableHandleActivePressIn: function touchableHandleActivePressIn(e) {
    if (e.dispatchConfig.registrationName === 'onResponderGrant') {
      this._opacityActive(0);
    } else {
      this._opacityActive(150);
    }
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function touchableHandleActivePressOut(e) {
    this._opacityInactive(250);
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandlePress: function touchableHandlePress(e) {
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleLongPress: function touchableHandleLongPress(e) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function touchableGetPressRectOffset() {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function touchableGetHitSlop() {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS: function touchableGetHighlightDelayMS() {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function touchableGetLongPressDelayMS() {
    return this.props.delayLongPress === 0 ? 0 : this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function touchableGetPressOutDelayMS() {
    return this.props.delayPressOut;
  },

  _opacityActive: function _opacityActive(duration) {
    this.setOpacityTo(this.props.activeOpacity, duration);
  },

  _opacityInactive: function _opacityInactive(duration) {
    var childStyle = flattenStyle(this.props.style) || {};
    this.setOpacityTo(childStyle.opacity === undefined ? 1 : childStyle.opacity, duration);
  },

  _opacityFocused: function _opacityFocused() {
    this.setOpacityTo(this.props.focusedOpacity);
  },

  render: function render() {
    return React.createElement(
      Animated.View,
      {
        accessible: this.props.accessible !== false,
        accessibilityLabel: this.props.accessibilityLabel,
        accessibilityComponentType: this.props.accessibilityComponentType,
        accessibilityTraits: this.props.accessibilityTraits,
        style: [this.props.style, { opacity: this.state.anim }],
        testID: this.props.testID,
        onLayout: this.props.onLayout,
        isTVSelectable: true,
        tvParallaxProperties: this.props.tvParallaxProperties,
        hitSlop: this.props.hitSlop,
        onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
        onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
        onResponderGrant: this.touchableHandleResponderGrant,
        onResponderMove: this.touchableHandleResponderMove,
        onResponderRelease: this.touchableHandleResponderRelease,
        onResponderTerminate: this.touchableHandleResponderTerminate, __source: {
          fileName: _jsxFileName,
          lineNumber: 171
        }
      },
      this.props.children,
      Touchable.renderDebugView({ color: 'cyan', hitSlop: this.props.hitSlop })
    );
  }
});

module.exports = TouchableOpacity;