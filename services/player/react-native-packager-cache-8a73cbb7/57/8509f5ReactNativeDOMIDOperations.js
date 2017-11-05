
'use strict';

var ReactNativeComponentTree = require('ReactNativeComponentTree');
var UIManager = require('UIManager');

var dangerouslyProcessChildrenUpdates = function dangerouslyProcessChildrenUpdates(inst, childrenUpdates) {
  if (!childrenUpdates.length) {
    return;
  }

  var containerTag = ReactNativeComponentTree.getNodeFromInstance(inst);

  var moveFromIndices;
  var moveToIndices;
  var addChildTags;
  var addAtIndices;
  var removeAtIndices;

  for (var i = 0; i < childrenUpdates.length; i++) {
    var update = childrenUpdates[i];
    if (update.type === 'MOVE_EXISTING') {
      (moveFromIndices || (moveFromIndices = [])).push(update.fromIndex);
      (moveToIndices || (moveToIndices = [])).push(update.toIndex);
    } else if (update.type === 'REMOVE_NODE') {
      (removeAtIndices || (removeAtIndices = [])).push(update.fromIndex);
    } else if (update.type === 'INSERT_MARKUP') {
      var mountImage = update.content;
      var tag = mountImage;
      (addAtIndices || (addAtIndices = [])).push(update.toIndex);
      (addChildTags || (addChildTags = [])).push(tag);
    }
  }

  UIManager.manageChildren(containerTag, moveFromIndices, moveToIndices, addChildTags, addAtIndices, removeAtIndices);
};

var ReactNativeDOMIDOperations = {
  dangerouslyProcessChildrenUpdates: dangerouslyProcessChildrenUpdates,

  dangerouslyReplaceNodeWithMarkupByID: function dangerouslyReplaceNodeWithMarkupByID(id, mountImage) {
    var oldTag = id;
    UIManager.replaceExistingNonRootView(oldTag, mountImage);
  }
};

module.exports = ReactNativeDOMIDOperations;