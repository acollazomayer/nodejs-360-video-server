
'use strict';

var ReactNativeStyleAttributes = require('ReactNativeStyleAttributes');

var ReactNativeViewAttributes = {};

ReactNativeViewAttributes.UIView = {
  pointerEvents: true,
  accessible: true,
  accessibilityLabel: true,
  accessibilityComponentType: true,
  accessibilityLiveRegion: true,
  accessibilityTraits: true,
  importantForAccessibility: true,
  testID: true,
  renderToHardwareTextureAndroid: true,
  shouldRasterizeIOS: true,
  onLayout: true,
  onAccessibilityTap: true,
  onMagicTap: true,
  onEnter: true,
  onExit: true,
  onInput: true,
  onGazeEnter: true,
  onGazeExit: true,
  onMouseEnter: true,
  onMouseExit: true,
  onChange: true,
  onHeadPose: true,
  onGazeInput: true,
  onGazeHeadPose: true,
  onMouseInput: true,
  onMouseHeadPose: true,
  onChangeCaptured: true,
  onInputCaptured: true,
  onHeadPoseCaptured: true,
  onGazeInputCaptured: true,
  onGazeHeadPoseCaptured: true,
  onMouseInputCaptured: true,
  onMouseHeadPoseCaptured: true,
  collapsable: true,
  needsOffscreenAlphaCompositing: true,
  style: ReactNativeStyleAttributes
};

ReactNativeViewAttributes.RCTView = babelHelpers.extends({}, ReactNativeViewAttributes.UIView, {
  removeClippedSubviews: true
});

module.exports = ReactNativeViewAttributes;