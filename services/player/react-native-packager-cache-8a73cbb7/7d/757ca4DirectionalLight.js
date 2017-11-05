
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Lights/DirectionalLight.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');

var requireNativeComponent = require('requireNativeComponent');

var DirectionalLight = React.createClass({
  displayName: 'DirectionalLight',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    intensity: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'DirectionalLight',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      intensity: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {};
  },

  render: function render() {
    var props = babelHelpers.extends({}, this.props) || {};
    props.style = props.style || {};
    if (!props.style.position) {
      props.style.position = 'absolute';
    }
    return React.createElement(
      RKDirectionalLight,
      babelHelpers.extends({}, props, {
        testID: this.props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 67
        }
      }),
      this.props.children
    );
  }
});

var RKDirectionalLight = requireNativeComponent('DirectionalLight', DirectionalLight, {
  nativeOnly: {}
});

module.exports = DirectionalLight;