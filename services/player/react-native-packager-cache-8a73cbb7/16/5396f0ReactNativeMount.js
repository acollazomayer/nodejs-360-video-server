
'use strict';

var React = require('React');
var ReactInstrumentation = require('ReactInstrumentation');
var ReactNativeContainerInfo = require('ReactNativeContainerInfo');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactReconciler = require('ReactReconciler');
var ReactUpdateQueue = require('ReactUpdateQueue');
var ReactUpdates = require('ReactUpdates');
var UIManager = require('UIManager');

var emptyObject = require('fbjs/lib/emptyObject');
var instantiateReactComponent = require('instantiateReactComponent');
var shouldUpdateReactComponent = require('shouldUpdateReactComponent');

var TopLevelWrapper = function TopLevelWrapper() {};
TopLevelWrapper.prototype.isReactComponent = {};
if (__DEV__) {
  TopLevelWrapper.displayName = 'TopLevelWrapper';
}
TopLevelWrapper.prototype.render = function () {
  return this.props.child;
};
TopLevelWrapper.isReactTopLevelWrapper = true;

function mountComponentIntoNode(componentInstance, containerTag, transaction) {
  var markup = ReactReconciler.mountComponent(componentInstance, transaction, null, ReactNativeContainerInfo(containerTag), emptyObject, 0);
  componentInstance._renderedComponent._topLevelWrapper = componentInstance;
  ReactNativeMount._mountImageIntoNode(markup, containerTag);
}

function batchedMountComponentIntoNode(componentInstance, containerTag) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
  transaction.perform(mountComponentIntoNode, null, componentInstance, containerTag, transaction);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}

var ReactNativeMount = {
  _instancesByContainerID: {},

  findNodeHandle: require('findNodeHandle'),

  renderComponent: function renderComponent(nextElement, containerTag, callback) {
    var nextWrappedElement = React.createElement(TopLevelWrapper, { child: nextElement });

    var topRootNodeID = containerTag;
    var prevComponent = ReactNativeMount._instancesByContainerID[topRootNodeID];
    if (prevComponent) {
      var prevWrappedElement = prevComponent._currentElement;
      var prevElement = prevWrappedElement.props.child;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        ReactUpdateQueue.enqueueElementInternal(prevComponent, nextWrappedElement, emptyObject);
        if (callback) {
          ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
        }
        return prevComponent;
      } else {
        ReactNativeMount.unmountComponentAtNode(containerTag);
      }
    }

    if (!ReactNativeTagHandles.reactTagIsNativeTopRootID(containerTag)) {
      console.error('You cannot render into anything but a top root');
      return null;
    }

    ReactNativeTagHandles.assertRootTag(containerTag);

    var instance = instantiateReactComponent(nextWrappedElement, false);
    ReactNativeMount._instancesByContainerID[containerTag] = instance;

    ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, instance, containerTag);
    var component = instance.getPublicInstance();
    if (callback) {
      callback.call(component);
    }
    return component;
  },

  _mountImageIntoNode: function _mountImageIntoNode(mountImage, containerID) {
    var childTag = mountImage;
    UIManager.setChildren(containerID, [childTag]);
  },

  unmountComponentAtNodeAndRemoveContainer: function unmountComponentAtNodeAndRemoveContainer(containerTag) {
    ReactNativeMount.unmountComponentAtNode(containerTag);

    UIManager.removeRootView(containerTag);
  },

  unmountComponentAtNode: function unmountComponentAtNode(containerTag) {
    if (!ReactNativeTagHandles.reactTagIsNativeTopRootID(containerTag)) {
      console.error('You cannot render into anything but a top root');
      return false;
    }

    var instance = ReactNativeMount._instancesByContainerID[containerTag];
    if (!instance) {
      return false;
    }
    if (__DEV__) {
      ReactInstrumentation.debugTool.onBeginFlush();
    }
    ReactNativeMount.unmountComponentFromNode(instance, containerTag);
    delete ReactNativeMount._instancesByContainerID[containerTag];
    if (__DEV__) {
      ReactInstrumentation.debugTool.onEndFlush();
    }
    return true;
  },

  unmountComponentFromNode: function unmountComponentFromNode(instance, containerID) {
    ReactReconciler.unmountComponent(instance);
    UIManager.removeSubviewsFromContainerWithID(containerID);
  }

};

module.exports = ReactNativeMount;