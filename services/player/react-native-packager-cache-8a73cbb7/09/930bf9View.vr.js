
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Components/View/View.vr.js';
var EdgeInsetsPropType = require('EdgeInsetsPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeStyleAttributes = require('ReactNativeStyleAttributes');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var StyleSheetPropType = require('StyleSheetPropType');
var UIManager = require('UIManager');
var ViewStylePropTypes = require('ViewStylePropTypes');

var requireNativeComponent = require('requireNativeComponent');

var stylePropType = StyleSheetPropType(ViewStylePropTypes);

var AccessibilityTraits = ['none', 'button', 'link', 'header', 'search', 'image', 'selected', 'plays', 'key', 'text', 'summary', 'disabled', 'frequentUpdates', 'startsMedia', 'adjustable', 'allowsDirectInteraction', 'pageTurn'];

var AccessibilityComponentType = ['none', 'button', 'radiobutton_checked', 'radiobutton_unchecked'];

var forceTouchAvailable = UIManager.RCTView && UIManager.RCTView.Constants && UIManager.RCTView.Constants.forceTouchAvailable || false;

var statics = {
  AccessibilityTraits: AccessibilityTraits,
  AccessibilityComponentType: AccessibilityComponentType,

  forceTouchAvailable: forceTouchAvailable
};

var View = React.createClass({
  displayName: 'View',

  mixins: [NativeMethodsMixin],

  viewConfig: {
    uiViewClassName: 'RCTView',
    validAttributes: ReactNativeViewAttributes.RCTView
  },

  statics: babelHelpers.extends({}, statics),

  propTypes: {
    accessible: PropTypes.bool,

    accessibilityLabel: PropTypes.string,

    accessibilityComponentType: PropTypes.oneOf(AccessibilityComponentType),

    accessibilityLiveRegion: PropTypes.oneOf(['none', 'polite', 'assertive']),

    importantForAccessibility: PropTypes.oneOf(['auto', 'yes', 'no', 'no-hide-descendants']),

    accessibilityTraits: PropTypes.oneOfType([PropTypes.oneOf(AccessibilityTraits), PropTypes.arrayOf(PropTypes.oneOf(AccessibilityTraits))]),

    onAccessibilityTap: PropTypes.func,

    onMagicTap: PropTypes.func,

    testID: PropTypes.string,

    onResponderGrant: PropTypes.func,

    onResponderMove: PropTypes.func,

    onResponderReject: PropTypes.func,

    onResponderRelease: PropTypes.func,

    onResponderTerminate: PropTypes.func,

    onResponderTerminationRequest: PropTypes.func,

    onStartShouldSetResponder: PropTypes.func,

    onStartShouldSetResponderCapture: PropTypes.func,

    onMoveShouldSetResponder: PropTypes.func,

    onMoveShouldSetResponderCapture: PropTypes.func,

    hitSlop: PropTypes.oneOfType([PropTypes.number, EdgeInsetsPropType]),

    cursorVisibilitySlop: PropTypes.oneOfType([PropTypes.number, EdgeInsetsPropType]),

    onLayout: PropTypes.func,

    billboarding: PropTypes.oneOf(['off', 'on']),

    onEnter: PropTypes.func,

    onExit: PropTypes.func,

    onInput: PropTypes.func,

    onChange: PropTypes.func,

    onHeadPose: PropTypes.func,
    onChangeCaptured: PropTypes.func,
    onInputCaptured: PropTypes.func,
    onHeadPoseCaptured: PropTypes.func,

    onMove: PropTypes.func,

    pointerEvents: PropTypes.oneOf(['box-none', 'none', 'box-only', 'auto']),
    style: stylePropType,

    removeClippedSubviews: PropTypes.bool,

    renderToHardwareTextureAndroid: PropTypes.bool,

    shouldRasterizeIOS: PropTypes.bool,

    collapsable: PropTypes.bool,

    needsOffscreenAlphaCompositing: PropTypes.bool
  },

  render: function render() {
    var props = babelHelpers.extends({}, this.props) || {};
    if (props.style && props.style['renderGroup'] === undefined && props.style.transform) {
      props.style.renderGroup = true;
    }
    return React.createElement(RCTView, babelHelpers.extends({}, props, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 542
      }
    }));
  }
});

var RCTView = requireNativeComponent('RCTView', View, {
  nativeOnly: {
    nativeBackgroundAndroid: true
  }
});

if (__DEV__) {
  var viewConfig = UIManager.viewConfigs && UIManager.viewConfigs.RCTView || {};
  for (var prop in viewConfig.nativeProps) {
    var viewAny = View;
    if (!viewAny.propTypes[prop] && !ReactNativeStyleAttributes[prop]) {
      throw new Error('View is missing propType for native prop `' + prop + '`');
    }
  }
}

module.exports = View;