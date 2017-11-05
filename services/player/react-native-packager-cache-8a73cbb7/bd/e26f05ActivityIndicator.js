
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/ActivityIndicator/ActivityIndicator.js';
var ColorPropType = require('ColorPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var requireNativeComponent = require('requireNativeComponent');

var PropTypes = React.PropTypes;

var GRAY = '#999999';

var ActivityIndicator = React.createClass({
  displayName: 'ActivityIndicator',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    animating: PropTypes.bool,

    color: ColorPropType,

    size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'large']), PropTypes.number]),

    hidesWhenStopped: PropTypes.bool
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      animating: true,
      color: Platform.OS === 'ios' ? GRAY : undefined,
      hidesWhenStopped: true,
      size: 'small'
    };
  },
  render: function render() {
    var _props = this.props,
        onLayout = _props.onLayout,
        style = _props.style,
        props = babelHelpers.objectWithoutProperties(_props, ['onLayout', 'style']);

    var sizeStyle = void 0;

    switch (props.size) {
      case 'small':
        sizeStyle = styles.sizeSmall;
        break;
      case 'large':
        sizeStyle = styles.sizeLarge;
        break;
      default:
        sizeStyle = { height: props.size, width: props.size };
        break;
    }

    return React.createElement(
      View,
      {
        onLayout: onLayout,
        style: [styles.container, style], __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        }
      },
      React.createElement(RCTActivityIndicator, babelHelpers.extends({}, props, {
        style: sizeStyle,
        styleAttr: 'Normal',
        indeterminate: true,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 97
        }
      }))
    );
  }
});

var styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeSmall: {
    width: 20,
    height: 20
  },
  sizeLarge: {
    width: 36,
    height: 36
  }
});

if (Platform.OS === 'ios') {
  var RCTActivityIndicator = requireNativeComponent('RCTActivityIndicatorView', ActivityIndicator, { nativeOnly: { activityIndicatorViewStyle: true } });
} else if (Platform.OS === 'android') {
  var RCTActivityIndicator = requireNativeComponent('AndroidProgressBar', ActivityIndicator, { nativeOnly: {
      indeterminate: true,
      progress: true,
      styleAttr: true
    } });
}

module.exports = ActivityIndicator;