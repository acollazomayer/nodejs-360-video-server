
'use strict';

var PropTypes = require('React').PropTypes;

var createStrictShapeTypeChecker = require('createStrictShapeTypeChecker');

var PointPropType = createStrictShapeTypeChecker({
  x: PropTypes.number,
  y: PropTypes.number
});

module.exports = PointPropType;