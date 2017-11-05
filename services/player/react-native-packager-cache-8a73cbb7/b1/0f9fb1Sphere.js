
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Mesh/Sphere.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Sphere = React.createClass({
  displayName: 'Sphere',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    lit: PropTypes.bool,

    materialParameters: PropTypes.object,

    texture: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),

    wireframe: PropTypes.bool,

    radius: PropTypes.number,

    widthSegments: PropTypes.number,

    heightSegments: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'Sphere',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      radius: true,
      widthSegments: true,
      heightSegments: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      radius: 0.5,
      widthSegments: 8,
      heightSegments: 6
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
    return React.createElement(RKSphere, babelHelpers.extends({}, rest, { texture: texture, __source: {
        fileName: _jsxFileName,
        lineNumber: 121
      }
    }));
  }
});

var RKSphere = requireNativeComponent('Sphere', Sphere, {});

module.exports = Sphere;