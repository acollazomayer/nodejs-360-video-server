
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Slider/Slider.js';
var Image = require('Image');
var ColorPropType = require('ColorPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var requireNativeComponent = require('requireNativeComponent');

var PropTypes = React.PropTypes;

var Slider = React.createClass({
  displayName: 'Slider',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: View.propTypes.style,

    value: PropTypes.number,

    step: PropTypes.number,

    minimumValue: PropTypes.number,

    maximumValue: PropTypes.number,

    minimumTrackTintColor: ColorPropType,

    maximumTrackTintColor: ColorPropType,

    disabled: PropTypes.bool,

    trackImage: Image.propTypes.source,

    minimumTrackImage: Image.propTypes.source,

    maximumTrackImage: Image.propTypes.source,

    thumbImage: Image.propTypes.source,

    thumbTintColor: ColorPropType,

    onValueChange: PropTypes.func,

    onSlidingComplete: PropTypes.func,

    testID: PropTypes.string
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      value: 0,
      minimumValue: 0,
      maximumValue: 1,
      step: 0
    };
  },

  viewConfig: {
    uiViewClassName: 'RCTSlider',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      value: true
    })
  },

  render: function render() {
    var _props = this.props,
        style = _props.style,
        onValueChange = _props.onValueChange,
        onSlidingComplete = _props.onSlidingComplete,
        props = babelHelpers.objectWithoutProperties(_props, ['style', 'onValueChange', 'onSlidingComplete']);

    props.style = [styles.slider, style];

    props.onValueChange = onValueChange && function (event) {
      var userEvent = true;
      if (Platform.OS === 'android') {
        userEvent = event.nativeEvent.fromUser;
      }
      onValueChange && userEvent && onValueChange(event.nativeEvent.value);
    };

    props.onChange = props.onValueChange;

    props.onSlidingComplete = onSlidingComplete && function (event) {
      onSlidingComplete && onSlidingComplete(event.nativeEvent.value);
    };

    return React.createElement(RCTSlider, babelHelpers.extends({}, props, {
      enabled: !this.props.disabled,
      onStartShouldSetResponder: function onStartShouldSetResponder() {
        return true;
      },
      onResponderTerminationRequest: function onResponderTerminationRequest() {
        return false;
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 177
      }
    }));
  }
});

var styles = void 0;
if (Platform.OS === 'ios') {
  styles = StyleSheet.create({
    slider: {
      height: 40
    }
  });
} else {
  styles = StyleSheet.create({
    slider: {}
  });
}

var options = {};
if (Platform.OS === 'android') {
  options = {
    nativeOnly: {
      enabled: true
    }
  };
}
var RCTSlider = requireNativeComponent('RCTSlider', Slider, options);

module.exports = Slider;