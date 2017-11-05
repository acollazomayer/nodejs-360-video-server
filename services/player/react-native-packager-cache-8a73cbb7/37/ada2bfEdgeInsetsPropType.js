
'use strict';

var _require = require('React'),
    PropTypes = _require.PropTypes;

var createStrictShapeTypeChecker = require('createStrictShapeTypeChecker');

var EdgeInsetsPropType = createStrictShapeTypeChecker({
  top: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number
});

module.exports = EdgeInsetsPropType;