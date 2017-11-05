
'use strict';

var ReactNativeDOMIDOperations = require('ReactNativeDOMIDOperations');
var ReactNativeReconcileTransaction = require('ReactNativeReconcileTransaction');

var ReactNativeComponentEnvironment = {

  processChildrenUpdates: ReactNativeDOMIDOperations.dangerouslyProcessChildrenUpdates,

  replaceNodeWithMarkup: ReactNativeDOMIDOperations.dangerouslyReplaceNodeWithMarkupByID,

  clearNode: function clearNode() {},

  ReactReconcileTransaction: ReactNativeReconcileTransaction
};

module.exports = ReactNativeComponentEnvironment;