
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Mesh/Model.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformColorPropTypes = require('LayoutAndTransformColorPropTypes');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Model = React.createClass({
  displayName: 'Model',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformColorPropTypes),

    lit: PropTypes.bool,

    materialParameters: PropTypes.object,

    source: PropTypes.object,

    texture: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),

    wireframe: PropTypes.bool
  }),

  viewConfig: {
    uiViewClassName: 'Model',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView)
  },

  getDefaultProps: function getDefaultProps() {
    return {};
  },
  render: function render() {
    var _props = this.props,
        texture = _props.texture,
        source = _props.source,
        rest = babelHelpers.objectWithoutProperties(_props, ['texture', 'source']);


    if (source) {
      if (source.hasOwnProperty('lit')) {
        console.warn('"lit" is now a top-level property of Model, and no longer part of "source". ' + 'Please review the documentation for the latest API');
        rest.lit = source.lit;
      }
      if (source.mesh) {
        console.warn('source.mesh has been renamed to source.obj for OBJ files. ' + 'Please review the documentation for the latest API');
        source.obj = source.mesh;
        delete source.mesh;
      }


      if (typeof source.mtl === 'number') {
        source.mtl = resolveAssetSource(source.mtl);
      }
      if (typeof source.obj === 'number') {
        source.obj = resolveAssetSource(source.obj);
      }
    }

    if (typeof texture === 'number') {
      texture = resolveAssetSource(texture);
    }
    rest.style = rest.style || {};

    if (!rest.style.renderGroup) {
      rest.style.renderGroup = true;
    }
    return React.createElement(RKModel, babelHelpers.extends({}, rest, {
      texture: texture,
      source: source,
      onStartShouldSetResponder: function onStartShouldSetResponder() {
        return true;
      },
      onResponderTerminationRequest: function onResponderTerminationRequest() {
        return false;
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 160
      }
    }));
  }
});

var RKModel = requireNativeComponent('Model', Model, {});

module.exports = Model;