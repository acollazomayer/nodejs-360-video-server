

Object.assign = function (target, sources) {
  if (__DEV__) {
    if (target == null) {
      throw new TypeError('Object.assign target cannot be null or undefined');
    }
    if (typeof target !== 'object' && typeof target !== 'function') {
      throw new TypeError('In this environment the target of assign MUST be an object.' + 'This error is a performance optimization and not spec compliant.');
    }
  }

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    if (__DEV__) {
      if (typeof nextSource !== 'object' && typeof nextSource !== 'function') {
        throw new TypeError('In this environment the sources for assign MUST be an object.' + 'This error is a performance optimization and not spec compliant.');
      }
    }

    for (var key in nextSource) {
      if (__DEV__) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        if (!hasOwnProperty.call(nextSource, key)) {
          throw new TypeError('One of the sources for assign has an enumerable key on the ' + 'prototype chain. Are you trying to assign a prototype property? ' + 'We don\'t allow it, as this is an edge case that we do not support. ' + 'This error is a performance optimization and not spec compliant.');
        }
      }
      target[key] = nextSource[key];
    }
  }

  return target;
};