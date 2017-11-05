

'use strict';

var invariant = require('fbjs/lib/invariant');

function accumulate(current, next) {
  invariant(next != null, 'accumulate(...): Accumulated items must be not be null or undefined.');

  if (current == null) {
    return next;
  }

  if (Array.isArray(current)) {
    return current.concat(next);
  }

  if (Array.isArray(next)) {
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulate;