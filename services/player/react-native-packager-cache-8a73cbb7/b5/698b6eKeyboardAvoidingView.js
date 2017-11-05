
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Keyboard/KeyboardAvoidingView.js';
var Keyboard = require('Keyboard');
var LayoutAnimation = require('LayoutAnimation');
var Platform = require('Platform');
var React = require('React');
var TimerMixin = require('react-timer-mixin');
var View = require('View');

var PropTypes = React.PropTypes;

var viewRef = 'VIEW';

var KeyboardAvoidingView = React.createClass({
  displayName: 'KeyboardAvoidingView',

  mixins: [TimerMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    behavior: PropTypes.oneOf(['height', 'position', 'padding']),

    contentContainerStyle: View.propTypes.style,

    keyboardVerticalOffset: PropTypes.number.isRequired
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      keyboardVerticalOffset: 0
    };
  },
  getInitialState: function getInitialState() {
    return {
      bottom: 0
    };
  },


  subscriptions: [],
  frame: null,

  relativeKeyboardHeight: function relativeKeyboardHeight(keyboardFrame) {
    var frame = this.frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    var y1 = Math.max(frame.y, keyboardFrame.screenY - this.props.keyboardVerticalOffset);
    var y2 = Math.min(frame.y + frame.height, keyboardFrame.screenY + keyboardFrame.height - this.props.keyboardVerticalOffset);
    if (frame.y > keyboardFrame.screenY) {
      return frame.y + frame.height - keyboardFrame.screenY - this.props.keyboardVerticalOffset;
    }
    return Math.max(y2 - y1, 0);
  },
  onKeyboardChange: function onKeyboardChange(event) {
    if (!event) {
      this.setState({ bottom: 0 });
      return;
    }

    var duration = event.duration,
        easing = event.easing,
        endCoordinates = event.endCoordinates;

    var height = this.relativeKeyboardHeight(endCoordinates);

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration: duration,
        update: {
          duration: duration,
          type: LayoutAnimation.Types[easing] || 'keyboard'
        }
      });
    }
    this.setState({ bottom: height });
  },
  onLayout: function onLayout(event) {
    this.frame = event.nativeEvent.layout;
  },
  componentWillUpdate: function componentWillUpdate(nextProps, nextState, nextContext) {
    if (nextState.bottom === this.state.bottom && this.props.behavior === 'height' && nextProps.behavior === 'height') {
      nextState.bottom = 0;
    }
  },
  componentWillMount: function componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardChange)];
    } else {
      this.subscriptions = [Keyboard.addListener('keyboardDidHide', this.onKeyboardChange), Keyboard.addListener('keyboardDidShow', this.onKeyboardChange)];
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    this.subscriptions.forEach(function (sub) {
      return sub.remove();
    });
  },
  render: function render() {
    var _props = this.props,
        behavior = _props.behavior,
        children = _props.children,
        style = _props.style,
        props = babelHelpers.objectWithoutProperties(_props, ['behavior', 'children', 'style']);


    switch (behavior) {
      case 'height':
        var heightStyle = void 0;
        if (this.frame) {
          heightStyle = { height: this.frame.height - this.state.bottom, flex: 0 };
        }
        return React.createElement(
          View,
          babelHelpers.extends({ ref: viewRef, style: [style, heightStyle], onLayout: this.onLayout }, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 169
            }
          }),
          children
        );

      case 'position':
        var positionStyle = { bottom: this.state.bottom };
        var contentContainerStyle = this.props.contentContainerStyle;


        return React.createElement(
          View,
          babelHelpers.extends({ ref: viewRef, style: style, onLayout: this.onLayout }, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 179
            }
          }),
          React.createElement(
            View,
            { style: [contentContainerStyle, positionStyle], __source: {
                fileName: _jsxFileName,
                lineNumber: 180
              }
            },
            children
          )
        );

      case 'padding':
        var paddingStyle = { paddingBottom: this.state.bottom };
        return React.createElement(
          View,
          babelHelpers.extends({ ref: viewRef, style: [style, paddingStyle], onLayout: this.onLayout }, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 189
            }
          }),
          children
        );

      default:
        return React.createElement(
          View,
          babelHelpers.extends({ ref: viewRef, onLayout: this.onLayout, style: style }, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 196
            }
          }),
          children
        );
    }
  }
});

module.exports = KeyboardAvoidingView;