

'use strict';

var invariant = require('fbjs/lib/invariant');

var instanceCache = {};

function getRenderedHostOrTextFromComponent(component) {
  var rendered;
  while (rendered = component._renderedComponent) {
    component = rendered;
  }
  return component;
}

function precacheNode(inst, tag) {
  var nativeInst = getRenderedHostOrTextFromComponent(inst);
  instanceCache[tag] = nativeInst;
}

function uncacheNode(inst) {
  var tag = inst._rootNodeID;
  if (tag) {
    delete instanceCache[tag];
  }
}

function getInstanceFromTag(tag) {
  return instanceCache[tag] || null;
}

function getTagFromInstance(inst) {
  invariant(inst._rootNodeID, 'All native instances should have a tag.');
  return inst._rootNodeID;
}

var ReactNativeComponentTree = {
  getClosestInstanceFromNode: getInstanceFromTag,
  getInstanceFromNode: getInstanceFromTag,
  getNodeFromInstance: getTagFromInstance,
  precacheNode: precacheNode,
  uncacheNode: uncacheNode
};

module.exports = ReactNativeComponentTree;