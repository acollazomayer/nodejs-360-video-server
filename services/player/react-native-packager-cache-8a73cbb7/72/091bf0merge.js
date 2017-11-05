Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge(foo, bar) {
  var merged = {};
  for (var each in bar) {
    if (foo.hasOwnProperty(each) && bar.hasOwnProperty(each)) {
      if (typeof foo[each] === 'object' && typeof bar[each] === 'object') {
        merged[each] = merge(foo[each], bar[each]);
      } else {
        merged[each] = bar[each];
      }
    } else if (bar.hasOwnProperty(each)) {
      merged[each] = bar[each];
    }
  }
  for (var _each in foo) {
    if (!(_each in bar) && foo.hasOwnProperty(_each)) {
      merged[_each] = foo[_each];
    }
  }
  return merged;
}