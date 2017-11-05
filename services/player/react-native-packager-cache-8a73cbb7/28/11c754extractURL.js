Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractURL;
function extractURL(resource) {
  if (typeof resource === 'string') {
    return resource;
  }
  if (typeof resource === 'object' && typeof resource.uri === 'string') {
    return resource.uri;
  }
  return null;
}