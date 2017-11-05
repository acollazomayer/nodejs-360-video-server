

'use strict';

var invariant = require('fbjs/lib/invariant');

var genericComponentClass = null;

var tagToComponentClass = {};
var textComponentClass = null;

var ReactHostComponentInjection = {
  injectGenericComponentClass: function injectGenericComponentClass(componentClass) {
    genericComponentClass = componentClass;
  },

  injectTextComponentClass: function injectTextComponentClass(componentClass) {
    textComponentClass = componentClass;
  },

  injectComponentClasses: function injectComponentClasses(componentClasses) {
    babelHelpers.extends(tagToComponentClass, componentClasses);
  }
};

function createInternalComponent(element) {
  invariant(genericComponentClass, 'There is no registered component for the tag %s', element.type);
  return new genericComponentClass(element);
}

function createInstanceForText(text) {
  return new textComponentClass(text);
}

function isTextComponent(component) {
  return component instanceof textComponentClass;
}

var ReactHostComponent = {
  createInternalComponent: createInternalComponent,
  createInstanceForText: createInstanceForText,
  isTextComponent: isTextComponent,
  injection: ReactHostComponentInjection
};

module.exports = ReactHostComponent;