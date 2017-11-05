
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/VRReactOverrides/Image.vr.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var ImageResizeMode = require('ImageResizeMode');
var ImageStylePropTypes = require('ImageStylePropTypes');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var StyleSheet = require('StyleSheet');
var StyleSheetPropType = require('StyleSheetPropType');
var View = require('View');

var flattenStyle = require('flattenStyle');
var merge = require('merge');
var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Image = React.createClass({
  displayName: 'Image',

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(ImageStylePropTypes),

    source: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string
    }), PropTypes.number]),

    loadingIndicatorSource: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string
    }), PropTypes.number]),
    progressiveRenderingEnabled: PropTypes.bool,
    fadeDuration: PropTypes.number,

    onLoadStart: PropTypes.func,

    onLoad: PropTypes.func,

    onLoadEnd: PropTypes.func,

    testID: PropTypes.string,

    inset: React.PropTypes.arrayOf(PropTypes.number),

    insetSize: React.PropTypes.arrayOf(PropTypes.number),

    crop: React.PropTypes.arrayOf(PropTypes.number)
  }),

  statics: {
    resizeMode: ImageResizeMode
  },

  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'RCTImageView',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      inset: true,
      insetSize: true,
      crop: true
    })
  },

  contextTypes: {
    isInAParentText: React.PropTypes.bool
  },

  render: function render() {
    var source = resolveAssetSource(this.props.source);
    var loadingIndicatorSource = resolveAssetSource(this.props.loadingIndicatorSource);

    if (source && source.uri === '') {
      console.warn('source.uri should not be an empty string');
    }

    if (this.props.src) {
      console.warn('The <Image> component requires a `source` property rather than `src`.');
    }

    if (source && source.uri) {
      var style = flattenStyle([styles.base, this.props.style]);
      var _props = this.props,
          onLoadStart = _props.onLoadStart,
          onLoad = _props.onLoad,
          onLoadEnd = _props.onLoadEnd;


      var nativeProps = merge(this.props, {
        style: style,
        shouldNotifyLoadEvents: !!(onLoadStart || onLoad || onLoadEnd),
        source: source,
        loadingIndicatorSrc: loadingIndicatorSource ? loadingIndicatorSource.uri : null
      });

      if (nativeProps.style && nativeProps.style['renderGroup'] === undefined && nativeProps.style.transform) {
        nativeProps.style.renderGroup = true;
      }

      if (this.context.isInAParentText) {
        return React.createElement(RKImage, babelHelpers.extends({}, nativeProps, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 178
          }
        }));
      } else {
        return React.createElement(RKImage, babelHelpers.extends({}, nativeProps, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 180
          }
        }));
      }
    }
    return null;
  }
});

var styles = StyleSheet.create({
  base: {
    overflow: 'hidden'
  },
  absoluteImage: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute'
  }
});

var cfg = {
  nativeOnly: {
    src: true,
    loadingIndicatorSrc: true,
    defaultImageSrc: true,
    imageTag: true,
    progressHandlerRegistered: true,
    shouldNotifyLoadEvents: true
  }
};
var RKImage = requireNativeComponent('RCTImageView', Image, cfg);


module.exports = Image;