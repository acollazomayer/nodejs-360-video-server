
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Scene/Scene.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('React');
var requireNativeComponent = require('requireNativeComponent');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');

var Scene = React.createClass({
  displayName: 'Scene',

  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'Scene',
    validAttributes: ReactNativeViewAttributes.RCTView
  },

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformPropTypes)
  }),

  getDefaultProps: function getDefaultProps() {
    return {};
  },

  render: function render() {
    return React.createElement(
      RKScene,
      babelHelpers.extends({}, this.props, {
        testID: this.props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 51
        }
      }),
      React.createElement(
        View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          }
        },
        this.props.children
      )
    );
  }
});

var RKScene = requireNativeComponent('Scene', Scene, {
  nativeOnly: {}
});

module.exports = Scene;