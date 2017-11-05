
'use strict';

var ReactNativeStyleAttributes = require('ReactNativeStyleAttributes');
var UIManager = require('UIManager');
var UnimplementedView = require('UnimplementedView');

var createReactNativeComponentClass = require('createReactNativeComponentClass');
var insetsDiffer = require('insetsDiffer');
var matricesDiffer = require('matricesDiffer');
var pointsDiffer = require('pointsDiffer');
var processColor = require('processColor');
var resolveAssetSource = require('resolveAssetSource');
var sizesDiffer = require('sizesDiffer');
var verifyPropTypes = require('verifyPropTypes');
var warning = require('fbjs/lib/warning');

function requireNativeComponent(viewName, componentInterface, extraConfig) {
  var viewConfig = UIManager[viewName];
  if (!viewConfig || !viewConfig.NativeProps) {
    warning(false, 'Native component for "%s" does not exist', viewName);
    return UnimplementedView;
  }

  viewConfig.uiViewClassName = viewName;
  viewConfig.validAttributes = {};
  viewConfig.propTypes = componentInterface && componentInterface.propTypes;

  var nativeProps = babelHelpers.extends({}, UIManager.RCTView.NativeProps, viewConfig.NativeProps);
  for (var key in nativeProps) {
    var useAttribute = false;
    var attribute = {};

    var differ = TypeToDifferMap[nativeProps[key]];
    if (differ) {
      attribute.diff = differ;
      useAttribute = true;
    }

    var processor = TypeToProcessorMap[nativeProps[key]];
    if (processor) {
      attribute.process = processor;
      useAttribute = true;
    }

    viewConfig.validAttributes[key] = useAttribute ? attribute : true;
  }

  viewConfig.validAttributes.style = ReactNativeStyleAttributes;

  if (__DEV__) {
    componentInterface && verifyPropTypes(componentInterface, viewConfig, extraConfig && extraConfig.nativeOnly);
  }

  return createReactNativeComponentClass(viewConfig);
}

var TypeToDifferMap = {
  CATransform3D: matricesDiffer,
  CGPoint: pointsDiffer,
  CGSize: sizesDiffer,
  UIEdgeInsets: insetsDiffer
};

function processColorArray(colors) {
  return colors && colors.map(processColor);
}

var TypeToProcessorMap = {
  CGColor: processColor,
  CGColorArray: processColorArray,
  UIColor: processColor,
  UIColorArray: processColorArray,
  CGImage: resolveAssetSource,
  UIImage: resolveAssetSource,
  RCTImageSource: resolveAssetSource,

  Color: processColor,
  ColorArray: processColorArray
};

module.exports = requireNativeComponent;