

'use strict';

var invariant = require('fbjs/lib/invariant');

var injected = false;

var ReactComponentEnvironment = {
  replaceNodeWithMarkup: null,

  processChildrenUpdates: null,

  injection: {
    injectEnvironment: function injectEnvironment(environment) {
      invariant(!injected, 'ReactCompositeComponent: injectEnvironment() can only be called once.');
      ReactComponentEnvironment.replaceNodeWithMarkup = environment.replaceNodeWithMarkup;
      ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates;
      injected = true;
    }
  }

};

module.exports = ReactComponentEnvironment;