
'use strict';

var ImageStylePropTypes = require('ImageStylePropTypes');
var ReactPropTypeLocations = require('react/lib/ReactPropTypeLocations');
var ReactPropTypesSecret = require('react/lib/ReactPropTypesSecret');
var TextStylePropTypes = require('TextStylePropTypes');
var ViewStylePropTypes = require('ViewStylePropTypes');

var invariant = require('fbjs/lib/invariant');

var StyleSheetValidation = function () {
  function StyleSheetValidation() {
    babelHelpers.classCallCheck(this, StyleSheetValidation);
  }

  babelHelpers.createClass(StyleSheetValidation, null, [{
    key: 'validateStyleProp',
    value: function validateStyleProp(prop, style, caller) {
      if (!__DEV__) {
        return;
      }
      if (allStylePropTypes[prop] === undefined) {
        var message1 = '"' + prop + '" is not a valid style property.';
        var message2 = '\nValid style props: ' + JSON.stringify(Object.keys(allStylePropTypes).sort(), null, '  ');
        styleError(message1, style, caller, message2);
      }
      var error = allStylePropTypes[prop](style, prop, caller, ReactPropTypeLocations.prop, null, ReactPropTypesSecret);
      if (error) {
        styleError(error.message, style, caller);
      }
    }
  }, {
    key: 'validateStyle',
    value: function validateStyle(name, styles) {
      if (!__DEV__) {
        return;
      }
      for (var prop in styles[name]) {
        StyleSheetValidation.validateStyleProp(prop, styles[name], 'StyleSheet ' + name);
      }
    }
  }, {
    key: 'addValidStylePropTypes',
    value: function addValidStylePropTypes(stylePropTypes) {
      for (var key in stylePropTypes) {
        allStylePropTypes[key] = stylePropTypes[key];
      }
    }
  }]);
  return StyleSheetValidation;
}();

var styleError = function styleError(message1, style, caller, message2) {
  invariant(false, message1 + '\n' + (caller || '<<unknown>>') + ': ' + JSON.stringify(style, null, '  ') + (message2 || ''));
};

var allStylePropTypes = {};

StyleSheetValidation.addValidStylePropTypes(ImageStylePropTypes);
StyleSheetValidation.addValidStylePropTypes(TextStylePropTypes);
StyleSheetValidation.addValidStylePropTypes(ViewStylePropTypes);

module.exports = StyleSheetValidation;