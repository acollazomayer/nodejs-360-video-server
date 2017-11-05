

if (Number.EPSILON === undefined) {
  Object.defineProperty(Number, 'EPSILON', {
    value: Math.pow(2, -52)
  });
}
if (Number.MAX_SAFE_INTEGER === undefined) {
  Object.defineProperty(Number, 'MAX_SAFE_INTEGER', {
    value: Math.pow(2, 53) - 1
  });
}
if (Number.MIN_SAFE_INTEGER === undefined) {
  Object.defineProperty(Number, 'MIN_SAFE_INTEGER', {
    value: -(Math.pow(2, 53) - 1)
  });
}
if (!Number.isNaN) {
  var globalIsNaN = global.isNaN;
  Object.defineProperty(Number, 'isNaN', {
    configurable: true,
    enumerable: false,
    value: function isNaN(value) {
      return typeof value === 'number' && globalIsNaN(value);
    },
    writable: true
  });
}