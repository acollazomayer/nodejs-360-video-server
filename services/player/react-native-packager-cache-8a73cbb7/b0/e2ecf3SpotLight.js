
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Lights/SpotLight.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');

var requireNativeComponent = require('requireNativeComponent');

var SpotLight = React.createClass({
  displayName: 'SpotLight',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    intensity: PropTypes.number,

    distance: PropTypes.number,

    decay: PropTypes.number,

    angle: PropTypes.number,

    penumbra: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'SpotLight',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      intensity: true,
      distance: true,
      decay: true,
      angle: true,
      penumbra: true
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
      RKSpotLight,
      babelHelpers.extends({}, props, {
        testID: this.props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 86
        }
      }),
      this.props.children
    );
  }
});

var RKSpotLight = requireNativeComponent('SpotLight', SpotLight, {
  nativeOnly: {}
});

module.exports = SpotLight;