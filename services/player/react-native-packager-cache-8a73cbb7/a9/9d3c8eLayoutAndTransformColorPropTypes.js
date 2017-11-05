
'use strict';

var ColorPropType = require('ColorPropType');
var LayoutPropTypes = require('LayoutPropTypes');
var PropTypes = require('react/lib/ReactPropTypes');
var TransformPropTypes = require('TransformPropTypes');

var LayoutAndTransformColorPropTypes = babelHelpers.extends({}, LayoutPropTypes, TransformPropTypes, {
  color: ColorPropType,
  opacity: PropTypes.number
});

module.exports = LayoutAndTransformColorPropTypes;