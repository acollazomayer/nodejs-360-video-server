
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Mesh/Cylinder.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Cylinder = React.createClass({
  displayName: 'Cylinder',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    lit: PropTypes.bool,

    texture: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),

    wireframe: PropTypes.bool,

    radiusTop: PropTypes.number,

    radiusBottom: PropTypes.number,

    dimHeight: PropTypes.number,

    segments: PropTypes.number,

    materialParameters: PropTypes.object
  }),

  viewConfig: {
    uiViewClassName: 'Cylinder',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      radiusTop: true,
      radiusBottom: true,
      dimHeight: true,
      segments: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      radiusTop: 0.5,
      radiusBottom: 0.5,
      dimHeight: 1,
      segments: 8
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
    return React.createElement(RKCylinder, babelHelpers.extends({}, rest, { texture: texture, __source: {
        fileName: _jsxFileName,
        lineNumber: 136
      }
    }));
  }
});

var RKCylinder = requireNativeComponent('Cylinder', Cylinder, {});

module.exports = Cylinder;