

'use strict';

var ReactNativeComponentTree = require('ReactNativeComponentTree');
var ReactNativeTagHandles = require('ReactNativeTagHandles');
var UIManager = require('UIManager');

var invariant = require('fbjs/lib/invariant');

var ReactNativeTextComponent = function ReactNativeTextComponent(text) {
  this._currentElement = text;
  this._stringText = '' + text;
  this._hostParent = null;
  this._rootNodeID = 0;
};

babelHelpers.extends(ReactNativeTextComponent.prototype, {

  mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
    invariant(context.isInAParentText, 'RawText "%s" must be wrapped in an explicit <Text> component.', this._stringText);
    this._hostParent = hostParent;
    var tag = ReactNativeTagHandles.allocateTag();
    this._rootNodeID = tag;
    var nativeTopRootTag = hostContainerInfo._tag;
    UIManager.createView(tag, 'RCTRawText', nativeTopRootTag, { text: this._stringText });

    ReactNativeComponentTree.precacheNode(this, tag);

    return tag;
  },

  getHostNode: function getHostNode() {
    return this._rootNodeID;
  },

  receiveComponent: function receiveComponent(nextText, transaction, context) {
    if (nextText !== this._currentElement) {
      this._currentElement = nextText;
      var nextStringText = '' + nextText;
      if (nextStringText !== this._stringText) {
        this._stringText = nextStringText;
        UIManager.updateView(this._rootNodeID, 'RCTRawText', { text: this._stringText });
      }
    }
  },

  unmountComponent: function unmountComponent() {
    ReactNativeComponentTree.uncacheNode(this);
    this._currentElement = null;
    this._stringText = null;
    this._rootNodeID = 0;
  }

});

module.exports = ReactNativeTextComponent;