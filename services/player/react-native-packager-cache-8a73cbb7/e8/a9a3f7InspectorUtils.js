
'use strict';

var ReactNativeComponentTree = require('ReactNativeComponentTree');

function traverseOwnerTreeUp(hierarchy, instance) {
  if (instance) {
    hierarchy.unshift(instance);
    traverseOwnerTreeUp(hierarchy, instance._currentElement._owner);
  }
}

function findInstanceByNativeTag(nativeTag) {
  return ReactNativeComponentTree.getInstanceFromNode(nativeTag);
}

function getOwnerHierarchy(instance) {
  var hierarchy = [];
  traverseOwnerTreeUp(hierarchy, instance);
  return hierarchy;
}

function lastNotNativeInstance(hierarchy) {
  for (var i = hierarchy.length - 1; i > 1; i--) {
    var instance = hierarchy[i];
    if (!instance.viewConfig) {
      return instance;
    }
  }
  return hierarchy[0];
}

module.exports = { findInstanceByNativeTag: findInstanceByNativeTag, getOwnerHierarchy: getOwnerHierarchy, lastNotNativeInstance: lastNotNativeInstance };