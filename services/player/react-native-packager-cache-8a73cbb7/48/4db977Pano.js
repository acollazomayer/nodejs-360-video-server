
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Pano/Pano.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');
var StyleSheetPropType = require('StyleSheetPropType');
var LayoutAndTransformTintPropTypes = require('LayoutAndTransformTintPropTypes');

var Pano = React.createClass({
  displayName: 'Pano',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformTintPropTypes),

    source: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string,
      stereo: PropTypes.string
    }), PropTypes.arrayOf(PropTypes.shape({
      uri: PropTypes.string
    })), PropTypes.shape({
      tile: PropTypes.string,
      maxDepth: PropTypes.number
    }), PropTypes.number]),

    onLoad: PropTypes.func,

    onLoadEnd: PropTypes.func
  }),

  viewConfig: {
    uiViewClassName: 'Pano',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView)
  },

  _onLoad: function _onLoad() {
    this.props.onLoad && this.props.onLoad();
  },

  _onLoadEnd: function _onLoadEnd() {
    this.props.onLoadEnd && this.props.onLoadEnd();
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

    var source = resolveAssetSource(this.props.source);
    if (!source) {
      props.source = { uri: undefined };
    } else {
      props.source = source;
    }

    return React.createElement(
      RKPano,
      babelHelpers.extends({}, props, {
        onLoad: this._onLoad,
        onLoadEnd: this._onLoadEnd,
        testID: this.props.testID,
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
      this.props.children
    );
  }
});

var RKPano = requireNativeComponent('Pano', Pano, {
  nativeOnly: {}
});

module.exports = Pano;