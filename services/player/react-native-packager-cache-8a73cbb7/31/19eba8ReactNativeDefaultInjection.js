
'use strict';

require('InitializeCore');

var EventPluginHub = require('EventPluginHub');
var EventPluginUtils = require('EventPluginUtils');
var RCTEventEmitter = require('RCTEventEmitter');
var React = require('React');
var ReactComponentEnvironment = require('ReactComponentEnvironment');
var ReactDefaultBatchingStrategy = require('ReactDefaultBatchingStrategy');
var ReactEmptyComponent = require('ReactEmptyComponent');
var ReactNativeBridgeEventPlugin = require('ReactNativeBridgeEventPlugin');
var ReactHostComponent = require('ReactHostComponent');
var ReactNativeComponentEnvironment = require('ReactNativeComponentEnvironment');
var ReactNativeComponentTree = require('ReactNativeComponentTree');
var ReactNativeEventEmitter = require('ReactNativeEventEmitter');
var ReactNativeEventPluginOrder = require('ReactNativeEventPluginOrder');
var ReactNativeGlobalResponderHandler = require('ReactNativeGlobalResponderHandler');
var ReactNativeTextComponent = require('ReactNativeTextComponent');
var ReactNativeTreeTraversal = require('ReactNativeTreeTraversal');
var ReactSimpleEmptyComponent = require('ReactSimpleEmptyComponent');
var ReactUpdates = require('ReactUpdates');
var ResponderEventPlugin = require('ResponderEventPlugin');

var invariant = require('fbjs/lib/invariant');

function inject() {
  RCTEventEmitter.register(ReactNativeEventEmitter);

  EventPluginHub.injection.injectEventPluginOrder(ReactNativeEventPluginOrder);
  EventPluginUtils.injection.injectComponentTree(ReactNativeComponentTree);
  EventPluginUtils.injection.injectTreeTraversal(ReactNativeTreeTraversal);

  ResponderEventPlugin.injection.injectGlobalResponderHandler(ReactNativeGlobalResponderHandler);

  EventPluginHub.injection.injectEventPluginsByName({
    'ResponderEventPlugin': ResponderEventPlugin,
    'ReactNativeBridgeEventPlugin': ReactNativeBridgeEventPlugin
  });

  ReactUpdates.injection.injectReconcileTransaction(ReactNativeComponentEnvironment.ReactReconcileTransaction);

  ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);

  ReactComponentEnvironment.injection.injectEnvironment(ReactNativeComponentEnvironment);

  var EmptyComponent = function EmptyComponent(instantiate) {
    var View = require('View');
    return new ReactSimpleEmptyComponent(React.createElement(View, {
      collapsable: true,
      style: { position: 'absolute' }
    }), instantiate);
  };

  ReactEmptyComponent.injection.injectEmptyComponentFactory(EmptyComponent);

  ReactHostComponent.injection.injectTextComponentClass(ReactNativeTextComponent);
  ReactHostComponent.injection.injectGenericComponentClass(function (tag) {
    var info = '';
    if (typeof tag === 'string' && /^[a-z]/.test(tag)) {
      info += ' Each component name should start with an uppercase letter.';
    }
    invariant(false, 'Expected a component class, got %s.%s', tag, info);
  });
}

module.exports = {
  inject: inject
};