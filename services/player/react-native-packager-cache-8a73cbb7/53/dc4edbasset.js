var _reactNative = require('react-native');

var assetRoot = _reactNative.NativeModules.ExternalAssets.assetRoot;


function asset(localPath) {
  var sourceExtra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var uri = localPath;
  if (assetRoot) {
    if (localPath.startsWith('/')) {
      uri = assetRoot + localPath.substr(1);
    } else {
      uri = assetRoot + localPath;
    }
  }
  return babelHelpers.extends({}, sourceExtra, {
    uri: uri
  });
}

module.exports = asset;