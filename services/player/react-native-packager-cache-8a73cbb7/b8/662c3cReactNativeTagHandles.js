
'use strict';

var invariant = require('fbjs/lib/invariant');

var INITIAL_TAG_COUNT = 1;
var ReactNativeTagHandles = {
  tagsStartAt: INITIAL_TAG_COUNT,
  tagCount: INITIAL_TAG_COUNT,

  allocateTag: function allocateTag() {
    while (this.reactTagIsNativeTopRootID(ReactNativeTagHandles.tagCount)) {
      ReactNativeTagHandles.tagCount++;
    }
    var tag = ReactNativeTagHandles.tagCount;
    ReactNativeTagHandles.tagCount++;
    return tag;
  },

  assertRootTag: function assertRootTag(tag) {
    invariant(this.reactTagIsNativeTopRootID(tag), 'Expect a native root tag, instead got %s', tag);
  },

  reactTagIsNativeTopRootID: function reactTagIsNativeTopRootID(reactTag) {
    return reactTag % 10 === 1;
  }
};

module.exports = ReactNativeTagHandles;