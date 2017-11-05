
'use strict';

var LayoutPropTypes = require('LayoutPropTypes');
var PropTypes = require('react/lib/ReactPropTypes');
var TransformPropTypes = require('TransformPropTypes');

var LayoutAndTransformOpacityPropTypes = babelHelpers.extends({}, LayoutPropTypes, TransformPropTypes, {
  opacity: PropTypes.number
});

module.exports = LayoutAndTransformOpacityPropTypes;