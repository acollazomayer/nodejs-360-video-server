
'use strict';

var ColorPropType = require('ColorPropType');
var LayoutPropTypes = require('LayoutPropTypes');
var TransformPropTypes = require('TransformPropTypes');

var LayoutAndTransformTintPropTypes = babelHelpers.extends({}, LayoutPropTypes, TransformPropTypes, {
  tintColor: ColorPropType
});

module.exports = LayoutAndTransformTintPropTypes;