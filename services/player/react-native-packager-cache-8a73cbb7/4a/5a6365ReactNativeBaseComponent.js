
'use strict';

var NativeMethodsMixin = require('NativeMethodsMixin');
var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var ReactNativeComponentTree = require('ReactNativeComponentTree');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var ReactMultiChild = require('ReactMultiChild');
var UIManager = require('UIManager');

var deepFreezeAndThrowOnMutationInDev = require('deepFreezeAndThrowOnMutationInDev');

var registrationNames = ReactNativeEventEmitter.registrationNames;
var putListener = ReactNativeEventEmitter.putListener;
var deleteListener = ReactNativeEventEmitter.deleteListener;
var deleteAllListeners = ReactNativeEventEmitter.deleteAllListeners;

var ReactNativeBaseComponent = function ReactNativeBaseComponent(viewConfig) {
  this.viewConfig = viewConfig;
};

ReactNativeBaseComponent.Mixin = {
  getPublicInstance: function getPublicInstance() {
    return this;
  },

  unmountComponent: function unmountComponent() {
    ReactNativeComponentTree.uncacheNode(this);
    deleteAllListeners(this);
    this.unmountChildren();
    this._rootNodeID = 0;
  },

  initializeChildren: function initializeChildren(children, containerTag, transaction, context) {
    var mountImages = this.mountChildren(children, transaction, context);

    if (mountImages.length) {
      var createdTags = [];
      for (var i = 0, l = mountImages.length; i < l; i++) {
        var mountImage = mountImages[i];
        var childTag = mountImage;
        createdTags[i] = childTag;
      }
      UIManager.setChildren(containerTag, createdTags);
    }
  },

  receiveComponent: function receiveComponent(nextElement, transaction, context) {
    var prevElement = this._currentElement;
    this._currentElement = nextElement;

    if (__DEV__) {
      for (var key in this.viewConfig.validAttributes) {
        if (nextElement.props.hasOwnProperty(key)) {
          deepFreezeAndThrowOnMutationInDev(nextElement.props[key]);
        }
      }
    }

    var updatePayload = ReactNativeAttributePayload.diff(prevElement.props, nextElement.props, this.viewConfig.validAttributes);

    if (updatePayload) {
      UIManager.updateView(this._rootNodeID, this.viewConfig.uiViewClassName, updatePayload);
    }

    this._reconcileListenersUponUpdate(prevElement.props, nextElement.props);
    this.updateChildren(nextElement.props.children, transaction, context);
  },

  _registerListenersUponCreation: function _registerListenersUponCreation(initialProps) {
    for (var key in initialProps) {
      if (registrationNames[key] && initialProps[key]) {
        var listener = initialProps[key];
        putListener(this, key, listener);
      }
    }
  },

  _reconcileListenersUponUpdate: function _reconcileListenersUponUpdate(prevProps, nextProps) {
    for (var key in nextProps) {
      if (registrationNames[key] && nextProps[key] !== prevProps[key]) {
        if (nextProps[key]) {
          putListener(this, key, nextProps[key]);
        } else {
          deleteListener(this, key);
        }
      }
    }
  },

  getHostNode: function getHostNode() {
    return this._rootNodeID;
  },

  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    var tag = ReactNativeTagHandles.allocateTag();

    this._rootNodeID = tag;
    this._hostParent = hostParent;
    this._hostContainerInfo = hostContainerInfo;

    if (__DEV__) {
      for (var key in this.viewConfig.validAttributes) {
        if (this._currentElement.props.hasOwnProperty(key)) {
          deepFreezeAndThrowOnMutationInDev(this._currentElement.props[key]);
        }
      }
    }

    var updatePayload = ReactNativeAttributePayload.create(this._currentElement.props, this.viewConfig.validAttributes);

    var nativeTopRootTag = hostContainerInfo._tag;
    UIManager.createView(tag, this.viewConfig.uiViewClassName, nativeTopRootTag, updatePayload);

    ReactNativeComponentTree.precacheNode(this, tag);

    this._registerListenersUponCreation(this._currentElement.props);
    this.initializeChildren(this._currentElement.props.children, tag, transaction, context);
    return tag;
  }
};

babelHelpers.extends(ReactNativeBaseComponent.prototype, ReactMultiChild, ReactNativeBaseComponent.Mixin, NativeMethodsMixin);

module.exports = ReactNativeBaseComponent;