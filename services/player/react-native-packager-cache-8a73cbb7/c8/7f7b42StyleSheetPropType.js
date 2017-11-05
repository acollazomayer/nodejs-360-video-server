
'use strict';

var createStrictShapeTypeChecker = require('createStrictShapeTypeChecker');
var flattenStyle = require('flattenStyle');

function StyleSheetPropType(shape) {
  var shapePropType = createStrictShapeTypeChecker(shape);
  return function (props, propName, componentName, location) {
    var newProps = props;
    if (props[propName]) {
      newProps = {};
      newProps[propName] = flattenStyle(props[propName]);
    }
    return shapePropType(newProps, propName, componentName, location);
  };
}

module.exports = StyleSheetPropType;