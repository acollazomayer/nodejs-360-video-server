
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Mesh/Box.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Box = React.createClass({
  displayName: 'Box',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    lit: PropTypes.bool,

    texture: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),

    materialParameters: PropTypes.object,

    wireframe: PropTypes.bool,

    dimWidth: PropTypes.number,

    dimHeight: PropTypes.number,

    dimDepth: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'Box',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      dimWidth: true,
      dimHeight: true,
      dimDepth: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      dimWidth: 1,
      dimHeight: 1,
      dimDepth: 1
    };
  },
  render: function render() {
    var _props = this.props,
        texture = _props.texture,
        rest = babelHelpers.objectWithoutProperties(_props, ['texture']);

    if (typeof texture === 'number') {
      texture = resolveAssetSource(texture);
    }
    rest.style = rest.style || {};
    return React.createElement(RKBox, babelHelpers.extends({}, rest, { texture: texture, __source: {
        fileName: _jsxFileName,
        lineNumber: 117
      }
    }));
  }
});

var RKBox = requireNativeComponent('Box', Box, {});

module.exports = Box;