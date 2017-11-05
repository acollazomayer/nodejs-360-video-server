
'use strict';

var UIManager = require('UIManager');
var ReactPropTypesSecret = require('react/lib/ReactPropTypesSecret');
var ReactPropTypeLocations = require('react/lib/ReactPropTypeLocations');

function deprecatedPropType(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (!UIManager[componentName] && props[propName] !== undefined) {
      console.warn('`' + propName + '` supplied to `' + componentName + '` has been deprecated. ' + explanation);
    }

    return propType(props, propName, componentName, ReactPropTypeLocations.prop, null, ReactPropTypesSecret);
  };
}

module.exports = deprecatedPropType;