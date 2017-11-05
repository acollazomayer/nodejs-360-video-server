
'use strict';

var LayoutPropTypes = require('LayoutPropTypes');
var TransformPropTypes = require('TransformPropTypes');

var LayoutAndTransformPropTypes = babelHelpers.extends({}, LayoutPropTypes, TransformPropTypes);

module.exports = LayoutAndTransformPropTypes;