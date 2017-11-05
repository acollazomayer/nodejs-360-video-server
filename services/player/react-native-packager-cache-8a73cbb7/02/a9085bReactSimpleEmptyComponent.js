

'use strict';

var ReactReconciler = require('ReactReconciler');

var ReactSimpleEmptyComponent = function ReactSimpleEmptyComponent(placeholderElement, instantiate) {
  this._currentElement = null;
  this._renderedComponent = instantiate(placeholderElement);
};
babelHelpers.extends(ReactSimpleEmptyComponent.prototype, {
  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID) {
    return ReactReconciler.mountComponent(this._renderedComponent, transaction, hostParent, hostContainerInfo, context, parentDebugID);
  },
  receiveComponent: function receiveComponent() {},
  getHostNode: function getHostNode() {
    return ReactReconciler.getHostNode(this._renderedComponent);
  },
  unmountComponent: function unmountComponent() {
    ReactReconciler.unmountComponent(this._renderedComponent);
    this._renderedComponent = null;
  }
});

module.exports = ReactSimpleEmptyComponent;