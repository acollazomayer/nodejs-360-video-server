
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Mesh/Plane.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Plane = React.createClass({
  displayName: 'Plane',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    lit: PropTypes.bool,

    materialParameters: PropTypes.object,

    texture: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),

    wireframe: PropTypes.bool,

    dimWidth: PropTypes.number,

    dimHeight: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'Plane',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      dimWidth: true,
      dimHeight: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      dimWidth: 1,
      dimHeight: 1
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
    return React.createElement(RKPlane, babelHelpers.extends({}, rest, { texture: texture, __source: {
        fileName: _jsxFileName,
        lineNumber: 109
      }
    }));
  }
});

var RKPlane = requireNativeComponent('Plane', Plane, {});

module.exports = Plane;