
'use strict';

var ReactPropTypes = require('React').PropTypes;
var ColorPropType = require('ColorPropType');
var ViewStylePropTypes = require('ViewStylePropTypes');

var TextStylePropTypes = babelHelpers.extends({}, ViewStylePropTypes, {

  color: ColorPropType,
  fontFamily: ReactPropTypes.string,
  fontSize: ReactPropTypes.number,
  fontStyle: ReactPropTypes.oneOf(['normal', 'italic']),

  fontWeight: ReactPropTypes.oneOf(['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']),

  fontVariant: ReactPropTypes.arrayOf(ReactPropTypes.oneOf(['small-caps', 'oldstyle-nums', 'lining-nums', 'tabular-nums', 'proportional-nums'])),
  textShadowOffset: ReactPropTypes.shape({ width: ReactPropTypes.number, height: ReactPropTypes.number }),
  textShadowRadius: ReactPropTypes.number,
  textShadowColor: ColorPropType,

  letterSpacing: ReactPropTypes.number,
  lineHeight: ReactPropTypes.number,

  textAlign: ReactPropTypes.oneOf(['auto', 'left', 'right', 'center', 'justify']),

  textAlignVertical: ReactPropTypes.oneOf(['auto', 'top', 'bottom', 'center']),

  includeFontPadding: ReactPropTypes.bool,
  textDecorationLine: ReactPropTypes.oneOf(['none', 'underline', 'line-through', 'underline line-through']),

  textDecorationStyle: ReactPropTypes.oneOf(['solid', 'double', 'dotted', 'dashed']),

  textDecorationColor: ColorPropType,

  writingDirection: ReactPropTypes.oneOf(['auto', 'ltr', 'rtl'])
});

module.exports = TextStylePropTypes;