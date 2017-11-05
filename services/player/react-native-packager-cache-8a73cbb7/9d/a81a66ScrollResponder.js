
'use strict';

var Dimensions = require('Dimensions');
var Platform = require('Platform');
var Keyboard = require('Keyboard');
var ReactNative = require('ReactNative');
var Subscribable = require('Subscribable');
var TextInputState = require('TextInputState');
var UIManager = require('UIManager');
var warning = require('fbjs/lib/warning');

var _require = require('ReactNativeComponentTree'),
    getInstanceFromNode = _require.getInstanceFromNode;

var _require2 = require('NativeModules'),
    ScrollViewManager = _require2.ScrollViewManager;

var invariant = require('fbjs/lib/invariant');

var IS_ANIMATING_TOUCH_START_THRESHOLD_MS = 16;

function isTagInstanceOfTextInput(tag) {
  var instance = getInstanceFromNode(tag);
  return instance && instance.viewConfig && (instance.viewConfig.uiViewClassName === 'AndroidTextInput' || instance.viewConfig.uiViewClassName === 'RCTTextView' || instance.viewConfig.uiViewClassName === 'RCTTextField');
}

var ScrollResponderMixin = {
  mixins: [Subscribable.Mixin],
  scrollResponderMixinGetInitialState: function scrollResponderMixinGetInitialState() {
    return {
      isTouching: false,
      lastMomentumScrollBeginTime: 0,
      lastMomentumScrollEndTime: 0,

      observedScrollSinceBecomingResponder: false,
      becameResponderWhileAnimating: false
    };
  },

  scrollResponderHandleScrollShouldSetResponder: function scrollResponderHandleScrollShouldSetResponder() {
    return this.state.isTouching;
  },

  scrollResponderHandleStartShouldSetResponder: function scrollResponderHandleStartShouldSetResponder(e) {
    var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();

    if (this.props.keyboardShouldPersistTaps === 'handled' && currentlyFocusedTextInput != null && e.target !== currentlyFocusedTextInput) {
      return true;
    }
    return false;
  },

  scrollResponderHandleStartShouldSetResponderCapture: function scrollResponderHandleStartShouldSetResponderCapture(e) {
    var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
    var keyboardShouldPersistTaps = this.props.keyboardShouldPersistTaps;

    var keyboardNeverPersistTaps = !keyboardShouldPersistTaps || keyboardShouldPersistTaps === 'never';
    if (keyboardNeverPersistTaps && currentlyFocusedTextInput != null && !isTagInstanceOfTextInput(e.target)) {
      return true;
    }
    return this.scrollResponderIsAnimating();
  },

  scrollResponderHandleResponderReject: function scrollResponderHandleResponderReject() {},

  scrollResponderHandleTerminationRequest: function scrollResponderHandleTerminationRequest() {
    return !this.state.observedScrollSinceBecomingResponder;
  },

  scrollResponderHandleTouchEnd: function scrollResponderHandleTouchEnd(e) {
    var nativeEvent = e.nativeEvent;
    this.state.isTouching = nativeEvent.touches.length !== 0;
    this.props.onTouchEnd && this.props.onTouchEnd(e);
  },

  scrollResponderHandleResponderRelease: function scrollResponderHandleResponderRelease(e) {
    this.props.onResponderRelease && this.props.onResponderRelease(e);

    var currentlyFocusedTextInput = TextInputState.currentlyFocusedField();
    if (this.props.keyboardShouldPersistTaps !== true && this.props.keyboardShouldPersistTaps !== 'always' && currentlyFocusedTextInput != null && e.target !== currentlyFocusedTextInput && !this.state.observedScrollSinceBecomingResponder && !this.state.becameResponderWhileAnimating) {
      this.props.onScrollResponderKeyboardDismissed && this.props.onScrollResponderKeyboardDismissed(e);
      TextInputState.blurTextInput(currentlyFocusedTextInput);
    }
  },

  scrollResponderHandleScroll: function scrollResponderHandleScroll(e) {
    this.state.observedScrollSinceBecomingResponder = true;
    this.props.onScroll && this.props.onScroll(e);
  },

  scrollResponderHandleResponderGrant: function scrollResponderHandleResponderGrant(e) {
    this.state.observedScrollSinceBecomingResponder = false;
    this.props.onResponderGrant && this.props.onResponderGrant(e);
    this.state.becameResponderWhileAnimating = this.scrollResponderIsAnimating();
  },

  scrollResponderHandleScrollBeginDrag: function scrollResponderHandleScrollBeginDrag(e) {
    this.props.onScrollBeginDrag && this.props.onScrollBeginDrag(e);
  },

  scrollResponderHandleScrollEndDrag: function scrollResponderHandleScrollEndDrag(e) {
    this.props.onScrollEndDrag && this.props.onScrollEndDrag(e);
  },

  scrollResponderHandleMomentumScrollBegin: function scrollResponderHandleMomentumScrollBegin(e) {
    this.state.lastMomentumScrollBeginTime = Date.now();
    this.props.onMomentumScrollBegin && this.props.onMomentumScrollBegin(e);
  },

  scrollResponderHandleMomentumScrollEnd: function scrollResponderHandleMomentumScrollEnd(e) {
    this.state.lastMomentumScrollEndTime = Date.now();
    this.props.onMomentumScrollEnd && this.props.onMomentumScrollEnd(e);
  },

  scrollResponderHandleTouchStart: function scrollResponderHandleTouchStart(e) {
    this.state.isTouching = true;
    this.props.onTouchStart && this.props.onTouchStart(e);
  },

  scrollResponderHandleTouchMove: function scrollResponderHandleTouchMove(e) {
    this.props.onTouchMove && this.props.onTouchMove(e);
  },

  scrollResponderIsAnimating: function scrollResponderIsAnimating() {
    var now = Date.now();
    var timeSinceLastMomentumScrollEnd = now - this.state.lastMomentumScrollEndTime;
    var isAnimating = timeSinceLastMomentumScrollEnd < IS_ANIMATING_TOUCH_START_THRESHOLD_MS || this.state.lastMomentumScrollEndTime < this.state.lastMomentumScrollBeginTime;
    return isAnimating;
  },

  scrollResponderGetScrollableNode: function scrollResponderGetScrollableNode() {
    return this.getScrollableNode ? this.getScrollableNode() : ReactNative.findNodeHandle(this);
  },

  scrollResponderScrollTo: function scrollResponderScrollTo(x, y, animated) {
    if (typeof x === 'number') {
      console.warn('`scrollResponderScrollTo(x, y, animated)` is deprecated. Use `scrollResponderScrollTo({x: 5, y: 5, animated: true})` instead.');
    } else {
      var _ref = x || {};

      x = _ref.x;
      y = _ref.y;
      animated = _ref.animated;
    }
    UIManager.dispatchViewManagerCommand(this.scrollResponderGetScrollableNode(), UIManager.RCTScrollView.Commands.scrollTo, [x || 0, y || 0, animated !== false]);
  },

  scrollResponderScrollToEnd: function scrollResponderScrollToEnd(options) {
    var animated = (options && options.animated) !== false;
    UIManager.dispatchViewManagerCommand(this.scrollResponderGetScrollableNode(), UIManager.RCTScrollView.Commands.scrollToEnd, [animated]);
  },

  scrollResponderScrollWithoutAnimationTo: function scrollResponderScrollWithoutAnimationTo(offsetX, offsetY) {
    console.warn('`scrollResponderScrollWithoutAnimationTo` is deprecated. Use `scrollResponderScrollTo` instead');
    this.scrollResponderScrollTo({ x: offsetX, y: offsetY, animated: false });
  },

  scrollResponderZoomTo: function scrollResponderZoomTo(rect, animated) {
    invariant(ScrollViewManager && ScrollViewManager.zoomToRect, 'zoomToRect is not implemented');
    if ('animated' in rect) {
      var animated = rect.animated,
          rect = babelHelpers.objectWithoutProperties(rect, ['animated']);
    } else if (typeof animated !== 'undefined') {
      console.warn('`scrollResponderZoomTo` `animated` argument is deprecated. Use `options.animated` instead');
    }
    ScrollViewManager.zoomToRect(this.scrollResponderGetScrollableNode(), rect, animated !== false);
  },

  scrollResponderScrollNativeHandleToKeyboard: function scrollResponderScrollNativeHandleToKeyboard(nodeHandle, additionalOffset, preventNegativeScrollOffset) {
    this.additionalScrollOffset = additionalOffset || 0;
    this.preventNegativeScrollOffset = !!preventNegativeScrollOffset;
    UIManager.measureLayout(nodeHandle, ReactNative.findNodeHandle(this.getInnerViewNode()), this.scrollResponderTextInputFocusError, this.scrollResponderInputMeasureAndScrollToKeyboard);
  },

  scrollResponderInputMeasureAndScrollToKeyboard: function scrollResponderInputMeasureAndScrollToKeyboard(left, top, width, height) {
    var keyboardScreenY = Dimensions.get('window').height;
    if (this.keyboardWillOpenTo) {
      keyboardScreenY = this.keyboardWillOpenTo.endCoordinates.screenY;
    }
    var scrollOffsetY = top - keyboardScreenY + height + this.additionalScrollOffset;

    if (this.preventNegativeScrollOffset) {
      scrollOffsetY = Math.max(0, scrollOffsetY);
    }
    this.scrollResponderScrollTo({ x: 0, y: scrollOffsetY, animated: true });

    this.additionalOffset = 0;
    this.preventNegativeScrollOffset = false;
  },

  scrollResponderTextInputFocusError: function scrollResponderTextInputFocusError(e) {
    console.error('Error measuring text field: ', e);
  },

  componentWillMount: function componentWillMount() {
    var keyboardShouldPersistTaps = this.props.keyboardShouldPersistTaps;

    warning(typeof keyboardShouldPersistTaps !== 'boolean', '\'keyboardShouldPersistTaps={' + keyboardShouldPersistTaps + '}\' is deprecated. ' + ('Use \'keyboardShouldPersistTaps="' + (keyboardShouldPersistTaps ? "always" : "never") + '"\' instead'));

    this.keyboardWillOpenTo = null;
    this.additionalScrollOffset = 0;
    this.addListenerOn(Keyboard, 'keyboardWillShow', this.scrollResponderKeyboardWillShow);
    this.addListenerOn(Keyboard, 'keyboardWillHide', this.scrollResponderKeyboardWillHide);
    this.addListenerOn(Keyboard, 'keyboardDidShow', this.scrollResponderKeyboardDidShow);
    this.addListenerOn(Keyboard, 'keyboardDidHide', this.scrollResponderKeyboardDidHide);
  },

  scrollResponderKeyboardWillShow: function scrollResponderKeyboardWillShow(e) {
    this.keyboardWillOpenTo = e;
    this.props.onKeyboardWillShow && this.props.onKeyboardWillShow(e);
  },

  scrollResponderKeyboardWillHide: function scrollResponderKeyboardWillHide(e) {
    this.keyboardWillOpenTo = null;
    this.props.onKeyboardWillHide && this.props.onKeyboardWillHide(e);
  },

  scrollResponderKeyboardDidShow: function scrollResponderKeyboardDidShow(e) {
    if (e) {
      this.keyboardWillOpenTo = e;
    }
    this.props.onKeyboardDidShow && this.props.onKeyboardDidShow(e);
  },

  scrollResponderKeyboardDidHide: function scrollResponderKeyboardDidHide(e) {
    this.keyboardWillOpenTo = null;
    this.props.onKeyboardDidHide && this.props.onKeyboardDidHide(e);
  }

};

var ScrollResponder = {
  Mixin: ScrollResponderMixin
};

module.exports = ScrollResponder;