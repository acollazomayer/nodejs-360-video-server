
'use strict';

var ReactNativeMount = require('ReactNativeMount');
var getReactData = require('getReactData');

var INDENTATION_SIZE = 2;
var MAX_DEPTH = 2;
var MAX_STRING_LENGTH = 50;

function dumpReactTree() {
  try {
    return getReactTree();
  } catch (e) {
    return 'Failed to dump react tree: ' + e;
  }
}

function getReactTree() {
  var output = '';
  var rootIds = Object.getOwnPropertyNames(ReactNativeMount._instancesByContainerID);
  for (var _iterator = rootIds, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var rootId = _ref;

    var instance = ReactNativeMount._instancesByContainerID[rootId];
    output += '============ Root ID: ' + rootId + ' ============\n';
    output += dumpNode(instance, 0);
    output += '============ End root ID: ' + rootId + ' ============\n';
  }
  return output;
}

function dumpNode(node, identation) {
  var data = getReactData(node);
  if (data.nodeType === 'Text') {
    return indent(identation) + data.text + '\n';
  } else if (data.nodeType === 'Empty') {
    return '';
  }
  var output = indent(identation) + ('<' + data.name);
  if (data.nodeType === 'Composite') {
    for (var _iterator2 = Object.getOwnPropertyNames(data.props || {}), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var propName = _ref2;

      if (isNormalProp(propName)) {
        try {
          var value = convertValue(data.props[propName]);
          if (value) {
            output += ' ' + propName + '=' + value;
          }
        } catch (e) {
          var message = '[Failed to get property: ' + e + ']';
          output += ' ' + propName + '=' + message;
        }
      }
    }
  }
  var childOutput = '';
  for (var _iterator3 = data.children || [], _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
    var _ref3;

    if (_isArray3) {
      if (_i3 >= _iterator3.length) break;
      _ref3 = _iterator3[_i3++];
    } else {
      _i3 = _iterator3.next();
      if (_i3.done) break;
      _ref3 = _i3.value;
    }

    var child = _ref3;

    childOutput += dumpNode(child, identation + 1);
  }

  if (childOutput) {
    output += '>\n' + childOutput + indent(identation) + ('</' + data.name + '>\n');
  } else {
    output += ' />\n';
  }

  return output;
}

function isNormalProp(name) {
  switch (name) {
    case 'children':
    case 'key':
    case 'ref':
      return false;
    default:
      return true;
  }
}

function convertObject(object, depth) {
  if (depth >= MAX_DEPTH) {
    return '[...omitted]';
  }
  var output = '{';
  var first = true;
  for (var _iterator4 = Object.getOwnPropertyNames(object), _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
    var _ref4;

    if (_isArray4) {
      if (_i4 >= _iterator4.length) break;
      _ref4 = _iterator4[_i4++];
    } else {
      _i4 = _iterator4.next();
      if (_i4.done) break;
      _ref4 = _i4.value;
    }

    var key = _ref4;

    if (!first) {
      output += ', ';
    }

    output += key + ': ' + convertValue(object[key], depth + 1);
    first = false;
  }
  return output + '}';
}

function convertValue(value) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (!value) {
    return null;
  }

  switch (typeof value) {
    case 'string':
      return JSON.stringify(possiblyEllipsis(value).replace('\n', '\\n'));
    case 'boolean':
    case 'number':
      return JSON.stringify(value);
    case 'function':
      return '[function]';
    case 'object':
      return convertObject(value, depth);
    default:
      return null;
  }
}

function possiblyEllipsis(value) {
  if (value.length > MAX_STRING_LENGTH) {
    return value.slice(0, MAX_STRING_LENGTH) + '...';
  } else {
    return value;
  }
}

function indent(size) {
  return ' '.repeat(size * INDENTATION_SIZE);
}

module.exports = dumpReactTree;