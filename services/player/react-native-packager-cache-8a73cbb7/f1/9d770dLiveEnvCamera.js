
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Camera/LiveEnvCamera.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var requireNativeComponent = require('requireNativeComponent');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');

var LiveEnvCamera = React.createClass({
  displayName: 'LiveEnvCamera',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformPropTypes)
  }),

  viewConfig: {
    uiViewClassName: 'LiveEnvCamera',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView)
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

    if (!props.style.renderGroup) {
      props.style.renderGroup = true;
    }

    return React.createElement(
      RKLiveEnvCamera,
      babelHelpers.extends({}, props, {
        testID: this.props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 57
        }
      }),
      this.props.children
    );
  }
});

var RKLiveEnvCamera = requireNativeComponent('LiveEnvCamera', LiveEnvCamera, {
  nativeOnly: {}
});

module.exports = LiveEnvCamera;