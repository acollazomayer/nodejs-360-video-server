
'use strict';

var LayoutPropTypes = require('LayoutPropTypes');
var ReactPropTypes = require('React').PropTypes;
var ColorPropType = require('ColorPropType');
var ShadowPropTypesIOS = require('ShadowPropTypesIOS');
var TransformPropTypes = require('TransformPropTypes');

var ViewStylePropTypes = babelHelpers.extends({}, LayoutPropTypes, ShadowPropTypesIOS, TransformPropTypes, {
  backfaceVisibility: ReactPropTypes.oneOf(['visible', 'hidden']),
  backgroundColor: ColorPropType,
  borderColor: ColorPropType,
  borderTopColor: ColorPropType,
  borderRightColor: ColorPropType,
  borderBottomColor: ColorPropType,
  borderLeftColor: ColorPropType,
  borderRadius: ReactPropTypes.number,
  borderTopLeftRadius: ReactPropTypes.number,
  borderTopRightRadius: ReactPropTypes.number,
  borderBottomLeftRadius: ReactPropTypes.number,
  borderBottomRightRadius: ReactPropTypes.number,
  borderStyle: ReactPropTypes.oneOf(['solid', 'dotted', 'dashed']),
  borderWidth: ReactPropTypes.number,
  borderTopWidth: ReactPropTypes.number,
  borderRightWidth: ReactPropTypes.number,
  borderBottomWidth: ReactPropTypes.number,
  borderLeftWidth: ReactPropTypes.number,
  opacity: ReactPropTypes.number,

  elevation: ReactPropTypes.number
});

module.exports = ViewStylePropTypes;