
'use strict';

var ReactPropTypes = require('react/lib/ReactPropTypes');

var OriginalLayoutPropTypes = require('react-native/Libraries/StyleSheet/LayoutPropTypes');

var LayoutPropTypes = babelHelpers.extends({}, OriginalLayoutPropTypes, {
  width: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  height: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  top: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  left: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  right: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  bottom: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  minWidth: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  maxWidth: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  minHeight: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  maxHeight: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  margin: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginVertical: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginHorizontal: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginTop: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginBottom: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginLeft: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  marginRight: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  padding: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingVertical: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingHorizontal: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingTop: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingBottom: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingLeft: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  paddingRight: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  flexBasis: ReactPropTypes.oneOfType([ReactPropTypes.number, ReactPropTypes.string]),

  display: ReactPropTypes.oneOf(['flex', 'none']),

  layoutOrigin: ReactPropTypes.arrayOf(ReactPropTypes.number),

  animation: ReactPropTypes.object,

  renderGroup: ReactPropTypes.bool
});

module.exports = LayoutPropTypes;