
'use strict';

var ReactNativeStyleAttributes = require('ReactNativeStyleAttributes');

function verifyPropTypes(componentInterface, viewConfig, nativePropsToIgnore) {
  if (!viewConfig) {
    return;
  }
  var componentName = componentInterface.displayName || componentInterface.name || 'unknown';

  if (!componentInterface.propTypes) {
    throw new Error('`' + componentName + '` has no propTypes defined`');
  }

  var nativeProps = viewConfig.NativeProps;
  for (var prop in nativeProps) {
    if (!componentInterface.propTypes[prop] && !ReactNativeStyleAttributes[prop] && (!nativePropsToIgnore || !nativePropsToIgnore[prop])) {
      var message;
      if (componentInterface.propTypes.hasOwnProperty(prop)) {
        message = '`' + componentName + '` has incorrectly defined propType for native prop `' + viewConfig.uiViewClassName + '.' + prop + '` of native type `' + nativeProps[prop];
      } else {
        message = '`' + componentName + '` has no propType for native prop `' + viewConfig.uiViewClassName + '.' + prop + '` of native type `' + nativeProps[prop] + '`';
      }
      message += '\nIf you haven\'t changed this prop yourself, this usually means that ' + 'your versions of the native code and JavaScript code are out of sync. Updating both ' + 'should make this error go away.';
      throw new Error(message);
    }
  }
}

module.exports = verifyPropTypes;