

'use strict';

var KeyEscapeUtils = require('KeyEscapeUtils');
var traverseAllChildren = require('traverseAllChildren');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
}

function flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID) {
  if (traverseContext && typeof traverseContext === 'object') {
    var result = traverseContext;
    var keyUnique = result[name] === undefined;
    if (__DEV__) {
      if (!ReactComponentTreeHook) {
        ReactComponentTreeHook = require('react/lib/ReactComponentTreeHook');
      }
      if (!keyUnique) {
        warning(false, 'flattenChildren(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.%s', KeyEscapeUtils.unescape(name), ReactComponentTreeHook.getStackAddendumByID(selfDebugID));
      }
    }
    if (keyUnique && child != null) {
      result[name] = child;
    }
  }
}

function flattenChildren(children, selfDebugID) {
  if (children == null) {
    return children;
  }
  var result = {};

  if (__DEV__) {
    traverseAllChildren(children, function (traverseContext, child, name) {
      return flattenSingleChildIntoContext(traverseContext, child, name, selfDebugID);
    }, result);
  } else {
    traverseAllChildren(children, flattenSingleChildIntoContext, result);
  }
  return result;
}

module.exports = flattenChildren;