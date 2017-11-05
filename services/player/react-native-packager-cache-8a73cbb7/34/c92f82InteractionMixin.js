
'use strict';

var InteractionManager = require('InteractionManager');

var InteractionMixin = {
  componentWillUnmount: function componentWillUnmount() {
    while (this._interactionMixinHandles.length) {
      InteractionManager.clearInteractionHandle(this._interactionMixinHandles.pop());
    }
  },

  _interactionMixinHandles: [],

  createInteractionHandle: function createInteractionHandle() {
    var handle = InteractionManager.createInteractionHandle();
    this._interactionMixinHandles.push(handle);
    return handle;
  },

  clearInteractionHandle: function clearInteractionHandle(clearHandle) {
    InteractionManager.clearInteractionHandle(clearHandle);
    this._interactionMixinHandles = this._interactionMixinHandles.filter(function (handle) {
      return handle !== clearHandle;
    });
  },

  runAfterInteractions: function runAfterInteractions(callback) {
    InteractionManager.runAfterInteractions(callback);
  }
};

module.exports = InteractionMixin;