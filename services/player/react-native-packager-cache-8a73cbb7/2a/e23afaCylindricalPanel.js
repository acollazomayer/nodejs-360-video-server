
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/VRLayers/CylindricalPanel.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var View = require('View');
var requireNativeComponent = require('requireNativeComponent');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformOpacityPropTypes = require('LayoutAndTransformOpacityPropTypes');
var invariant = require('invariant');

var CylindricalPanel = React.createClass({
  displayName: 'CylindricalPanel',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {

    layer: React.PropTypes.shape({
      width: React.PropTypes.number.isRequired,
      height: React.PropTypes.number.isRequired,
      radius: React.PropTypes.number,
      density: React.PropTypes.number
    }).isRequired,

    style: StyleSheetPropType(LayoutAndTransformOpacityPropTypes)
  }),

  getChildContext: function getChildContext() {
    return { isOnLayer: true };
  },

  childContextTypes: {
    isOnLayer: PropTypes.bool
  },
  contextTypes: {
    isOnLayer: PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {};
  },
  render: function render() {
    var _props = this.props,
        layer = _props.layer,
        rest = babelHelpers.objectWithoutProperties(_props, ['layer']);

    rest.style = rest.style || {};
    if (!rest.style.renderGroup) {
      rest.style.renderGroup = true;
    }
    invariant(layer.width > 0 && layer.width <= 4096, 'width is not within range of 0 and 4096 ' + layer.width.toString());
    invariant(layer.height > 0 && layer.height <= 1000, 'height is not within range of 0 and 1000 ' + layer.height.toString());
    if (!layer.density) {
      layer.density = 4680;
    }
    if (!layer.radius) {
      layer.radius = 4;
    }
    invariant(layer.width <= layer.density, 'width value should be less than density ' + layer.width.toString(), layer.density.toString());
    invariant(layer.height <= layer.density, 'height value should be less than density ' + layer.height.toString(), layer.density.toString());
    return React.createElement(
      RKCylindricalPanel,
      babelHelpers.extends({
        layer: layer
      }, rest, {
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 125
        }
      }),
      React.createElement(
        View,
        { style: { position: 'absolute' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 130
          }
        },
        this.props.children
      )
    );
  }
});

var RKCylindricalPanel = requireNativeComponent('CylindricalPanel', CylindricalPanel, {
  nativeOnly: {}
});

module.exports = CylindricalPanel;