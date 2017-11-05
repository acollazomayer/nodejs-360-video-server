Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bundleFromRoot;
function bundleFromRoot(root) {
  var path = location.pathname;
  if (!path.endsWith('/')) {
    path = path.substr(0, path.lastIndexOf('/'));
  } else {
    path = path.substr(0, path.length - 1);
  }
  return location.protocol + '//' + location.host + path + '/' + root;
}