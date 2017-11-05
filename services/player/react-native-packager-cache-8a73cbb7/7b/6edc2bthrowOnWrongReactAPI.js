

'use strict';

function throwOnWrongReactAPI(key) {
  throw new Error('Seems you\'re trying to access \'ReactNative.' + key + '\' from the \'react-native\' package. Perhaps you meant to access \'React.' + key + '\' from the \'react\' package instead?\n\nFor example, instead of:\n\n  import React, { Component, View } from \'react-native\';\n\nYou should now do:\n\n  import React, { Component } from \'react\';\n  import { View } from \'react-native\';\n\nCheck the release notes on how to upgrade your code - https://github.com/facebook/react-native/releases/tag/v0.25.1\n');
}

module.exports = throwOnWrongReactAPI;