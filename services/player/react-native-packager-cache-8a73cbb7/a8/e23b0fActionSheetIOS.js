
'use strict';

var RCTActionSheetManager = require('NativeModules').ActionSheetManager;

var invariant = require('fbjs/lib/invariant');
var processColor = require('processColor');

var ActionSheetIOS = {
  showActionSheetWithOptions: function showActionSheetWithOptions(options, callback) {
    invariant(typeof options === 'object' && options !== null, 'Options must be a valid object');
    invariant(typeof callback === 'function', 'Must provide a valid callback');
    RCTActionSheetManager.showActionSheetWithOptions(babelHelpers.extends({}, options, { tintColor: processColor(options.tintColor) }), callback);
  },
  showShareActionSheetWithOptions: function showShareActionSheetWithOptions(options, failureCallback, successCallback) {
    invariant(typeof options === 'object' && options !== null, 'Options must be a valid object');
    invariant(typeof failureCallback === 'function', 'Must provide a valid failureCallback');
    invariant(typeof successCallback === 'function', 'Must provide a valid successCallback');
    RCTActionSheetManager.showShareActionSheetWithOptions(babelHelpers.extends({}, options, { tintColor: processColor(options.tintColor) }), failureCallback, successCallback);
  }
};

module.exports = ActionSheetIOS;