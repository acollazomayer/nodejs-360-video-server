

'use strict';

var ImageStylePropTypes = require('ImageStylePropTypes');
var TextStylePropTypes = require('TextStylePropTypes');
var ViewStylePropTypes = require('ViewStylePropTypes');

var keyMirror = require('fbjs/lib/keyMirror');
var matricesDiffer = require('matricesDiffer');
var processColor = require('processColor');
var processTransform = require('processTransform');
var sizesDiffer = require('sizesDiffer');

var ReactNativeStyleAttributes = babelHelpers.extends({}, keyMirror(ViewStylePropTypes), keyMirror(TextStylePropTypes), keyMirror(ImageStylePropTypes));

ReactNativeStyleAttributes.transform = { process: processTransform };
ReactNativeStyleAttributes.transformMatrix = { diff: matricesDiffer };
ReactNativeStyleAttributes.shadowOffset = { diff: sizesDiffer };

ReactNativeStyleAttributes.decomposedMatrix = 'decomposedMatrix';

var colorAttributes = { process: processColor };
ReactNativeStyleAttributes.backgroundColor = colorAttributes;
ReactNativeStyleAttributes.borderBottomColor = colorAttributes;
ReactNativeStyleAttributes.borderColor = colorAttributes;
ReactNativeStyleAttributes.borderLeftColor = colorAttributes;
ReactNativeStyleAttributes.borderRightColor = colorAttributes;
ReactNativeStyleAttributes.borderTopColor = colorAttributes;
ReactNativeStyleAttributes.color = colorAttributes;
ReactNativeStyleAttributes.shadowColor = colorAttributes;
ReactNativeStyleAttributes.textDecorationColor = colorAttributes;
ReactNativeStyleAttributes.tintColor = colorAttributes;
ReactNativeStyleAttributes.textShadowColor = colorAttributes;
ReactNativeStyleAttributes.overlayColor = colorAttributes;

module.exports = ReactNativeStyleAttributes;