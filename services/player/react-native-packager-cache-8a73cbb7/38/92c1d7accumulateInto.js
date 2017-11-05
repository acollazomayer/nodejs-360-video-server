

'use strict';

var invariant = require('fbjs/lib/invariant');

function accumulateInto(current, next) {
  invariant(next != null, 'accumulateInto(...): Accumulated items must not be null or undefined.');

  if (current == null) {
    return next;
  }

  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;