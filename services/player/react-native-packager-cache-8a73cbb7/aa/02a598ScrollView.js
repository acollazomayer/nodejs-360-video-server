
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/ScrollView/ScrollView.js';
var ColorPropType = require('ColorPropType');
var EdgeInsetsPropType = require('EdgeInsetsPropType');
var Platform = require('Platform');
var PointPropType = require('PointPropType');
var React = require('React');
var ReactNative = require('ReactNative');
var ScrollResponder = require('ScrollResponder');
var StyleSheet = require('StyleSheet');
var StyleSheetPropType = require('StyleSheetPropType');
var View = require('View');
var ViewStylePropTypes = require('ViewStylePropTypes');

var dismissKeyboard = require('dismissKeyboard');
var flattenStyle = require('flattenStyle');
var invariant = require('fbjs/lib/invariant');
var processDecelerationRate = require('processDecelerationRate');
var PropTypes = React.PropTypes;
var requireNativeComponent = require('requireNativeComponent');

var ScrollView = React.createClass({
  displayName: 'ScrollView',

  propTypes: babelHelpers.extends({}, View.propTypes, {
    automaticallyAdjustContentInsets: PropTypes.bool,

    contentInset: EdgeInsetsPropType,

    contentOffset: PointPropType,

    bounces: PropTypes.bool,

    bouncesZoom: PropTypes.bool,

    alwaysBounceHorizontal: PropTypes.bool,

    alwaysBounceVertical: PropTypes.bool,

    centerContent: PropTypes.bool,

    contentContainerStyle: StyleSheetPropType(ViewStylePropTypes),

    decelerationRate: PropTypes.oneOfType([PropTypes.oneOf(['fast', 'normal']), PropTypes.number]),

    horizontal: PropTypes.bool,

    indicatorStyle: PropTypes.oneOf(['default', 'black', 'white']),

    directionalLockEnabled: PropTypes.bool,

    canCancelContentTouches: PropTypes.bool,

    keyboardDismissMode: PropTypes.oneOf(['none', 'interactive', 'on-drag']),

    keyboardShouldPersistTaps: PropTypes.oneOf(['always', 'never', 'handled', false, true]),

    maximumZoomScale: PropTypes.number,

    minimumZoomScale: PropTypes.number,

    onScroll: PropTypes.func,

    onScrollAnimationEnd: PropTypes.func,

    onContentSizeChange: PropTypes.func,

    pagingEnabled: PropTypes.bool,

    scrollEnabled: PropTypes.bool,

    scrollEventThrottle: PropTypes.number,

    scrollIndicatorInsets: EdgeInsetsPropType,

    scrollsToTop: PropTypes.bool,

    showsHorizontalScrollIndicator: PropTypes.bool,

    showsVerticalScrollIndicator: PropTypes.bool,

    stickyHeaderIndices: PropTypes.arrayOf(PropTypes.number),
    style: StyleSheetPropType(ViewStylePropTypes),

    snapToInterval: PropTypes.number,

    snapToAlignment: PropTypes.oneOf(['start', 'center', 'end']),

    removeClippedSubviews: PropTypes.bool,

    zoomScale: PropTypes.number,

    refreshControl: PropTypes.element,

    endFillColor: ColorPropType,

    scrollPerfTag: PropTypes.string,

    overScrollMode: PropTypes.oneOf(['auto', 'always', 'never'])
  }),

  mixins: [ScrollResponder.Mixin],

  getInitialState: function getInitialState() {
    return this.scrollResponderMixinGetInitialState();
  },

  setNativeProps: function setNativeProps(props) {
    this._scrollViewRef && this._scrollViewRef.setNativeProps(props);
  },

  getScrollResponder: function getScrollResponder() {
    return this;
  },

  getScrollableNode: function getScrollableNode() {
    return ReactNative.findNodeHandle(this._scrollViewRef);
  },

  getInnerViewNode: function getInnerViewNode() {
    return ReactNative.findNodeHandle(this._innerViewRef);
  },

  scrollTo: function scrollTo(y, x, animated) {
    if (typeof y === 'number') {
      console.warn('`scrollTo(y, x, animated)` is deprecated. Use `scrollTo({x: 5, y: 5, animated: true})` instead.');
    } else {
      var _ref = y || {};

      x = _ref.x;
      y = _ref.y;
      animated = _ref.animated;
    }
    this.getScrollResponder().scrollResponderScrollTo({ x: x || 0, y: y || 0, animated: animated !== false });
  },

  scrollToEnd: function scrollToEnd(options) {
    var animated = (options && options.animated) !== false;
    this.getScrollResponder().scrollResponderScrollToEnd({
      animated: animated
    });
  },

  scrollWithoutAnimationTo: function scrollWithoutAnimationTo() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    console.warn('`scrollWithoutAnimationTo` is deprecated. Use `scrollTo` instead');
    this.scrollTo({ x: x, y: y, animated: false });
  },

  _handleScroll: function _handleScroll(e) {
    if (__DEV__) {
      if (this.props.onScroll && this.props.scrollEventThrottle == null && Platform.OS === 'ios') {
        console.log('You specified `onScroll` on a <ScrollView> but not ' + '`scrollEventThrottle`. You will only receive one event. ' + 'Using `16` you get all the events but be aware that it may ' + 'cause frame drops, use a bigger number if you don\'t need as ' + 'much precision.');
      }
    }
    if (Platform.OS === 'android') {
      if (this.props.keyboardDismissMode === 'on-drag') {
        dismissKeyboard();
      }
    }
    this.scrollResponderHandleScroll(e);
  },

  _handleContentOnLayout: function _handleContentOnLayout(e) {
    var _e$nativeEvent$layout = e.nativeEvent.layout,
        width = _e$nativeEvent$layout.width,
        height = _e$nativeEvent$layout.height;

    this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);
  },

  _scrollViewRef: null,
  _setScrollViewRef: function _setScrollViewRef(ref) {
    this._scrollViewRef = ref;
  },

  _innerViewRef: null,
  _setInnerViewRef: function _setInnerViewRef(ref) {
    this._innerViewRef = ref;
  },

  render: function render() {
    var contentContainerStyle = [this.props.horizontal && styles.contentContainerHorizontal, this.props.contentContainerStyle];
    var style = void 0,
        childLayoutProps = void 0;
    if (__DEV__ && this.props.style) {
      style = flattenStyle(this.props.style);
      childLayoutProps = ['alignItems', 'justifyContent'].filter(function (prop) {
        return style && style[prop] !== undefined;
      });
      invariant(childLayoutProps.length === 0, 'ScrollView child layout (' + JSON.stringify(childLayoutProps) + ') must be applied through the contentContainerStyle prop.');
    }

    var contentSizeChangeProps = {};
    if (this.props.onContentSizeChange) {
      contentSizeChangeProps = {
        onLayout: this._handleContentOnLayout
      };
    }

    var contentContainer = React.createElement(
      View,
      babelHelpers.extends({}, contentSizeChangeProps, {
        ref: this._setInnerViewRef,
        style: contentContainerStyle,
        removeClippedSubviews: this.props.removeClippedSubviews,
        collapsable: false, __source: {
          fileName: _jsxFileName,
          lineNumber: 510
        }
      }),
      this.props.children
    );

    var alwaysBounceHorizontal = this.props.alwaysBounceHorizontal !== undefined ? this.props.alwaysBounceHorizontal : this.props.horizontal;

    var alwaysBounceVertical = this.props.alwaysBounceVertical !== undefined ? this.props.alwaysBounceVertical : !this.props.horizontal;

    var baseStyle = this.props.horizontal ? styles.baseHorizontal : styles.baseVertical;
    var props = babelHelpers.extends({}, this.props, {
      alwaysBounceHorizontal: alwaysBounceHorizontal,
      alwaysBounceVertical: alwaysBounceVertical,
      style: [baseStyle, this.props.style],

      onContentSizeChange: null,
      onTouchStart: this.scrollResponderHandleTouchStart,
      onTouchMove: this.scrollResponderHandleTouchMove,
      onTouchEnd: this.scrollResponderHandleTouchEnd,
      onScrollBeginDrag: this.scrollResponderHandleScrollBeginDrag,
      onScrollEndDrag: this.scrollResponderHandleScrollEndDrag,
      onMomentumScrollBegin: this.scrollResponderHandleMomentumScrollBegin,
      onMomentumScrollEnd: this.scrollResponderHandleMomentumScrollEnd,
      onStartShouldSetResponder: this.scrollResponderHandleStartShouldSetResponder,
      onStartShouldSetResponderCapture: this.scrollResponderHandleStartShouldSetResponderCapture,
      onScrollShouldSetResponder: this.scrollResponderHandleScrollShouldSetResponder,
      onScroll: this._handleScroll,
      onResponderGrant: this.scrollResponderHandleResponderGrant,
      onResponderTerminationRequest: this.scrollResponderHandleTerminationRequest,
      onResponderTerminate: this.scrollResponderHandleTerminate,
      onResponderRelease: this.scrollResponderHandleResponderRelease,
      onResponderReject: this.scrollResponderHandleResponderReject,
      sendMomentumEvents: this.props.onMomentumScrollBegin || this.props.onMomentumScrollEnd ? true : false
    });

    var decelerationRate = this.props.decelerationRate;

    if (decelerationRate) {
      props.decelerationRate = processDecelerationRate(decelerationRate);
    }

    var ScrollViewClass = void 0;
    if (Platform.OS === 'ios') {
      ScrollViewClass = RCTScrollView;
    } else if (Platform.OS === 'android') {
      if (this.props.horizontal) {
        ScrollViewClass = AndroidHorizontalScrollView;
      } else {
        ScrollViewClass = AndroidScrollView;
      }
    }
    invariant(ScrollViewClass !== undefined, 'ScrollViewClass must not be undefined');

    var refreshControl = this.props.refreshControl;
    if (refreshControl) {
      if (Platform.OS === 'ios') {
        return React.createElement(
          ScrollViewClass,
          babelHelpers.extends({}, props, { ref: this._setScrollViewRef, __source: {
              fileName: _jsxFileName,
              lineNumber: 582
            }
          }),
          refreshControl,
          contentContainer
        );
      } else if (Platform.OS === 'android') {

        return React.cloneElement(refreshControl, { style: props.style }, React.createElement(
          ScrollViewClass,
          babelHelpers.extends({}, props, { style: baseStyle, ref: this._setScrollViewRef, __source: {
              fileName: _jsxFileName,
              lineNumber: 597
            }
          }),
          contentContainer
        ));
      }
    }
    return React.createElement(
      ScrollViewClass,
      babelHelpers.extends({}, props, { ref: this._setScrollViewRef, __source: {
          fileName: _jsxFileName,
          lineNumber: 604
        }
      }),
      contentContainer
    );
  }
});

var styles = StyleSheet.create({
  baseVertical: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'column',
    overflow: 'scroll'
  },
  baseHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    overflow: 'scroll'
  },
  contentContainerHorizontal: {
    flexDirection: 'row'
  }
});

var nativeOnlyProps = void 0,
    AndroidScrollView = void 0,
    AndroidHorizontalScrollView = void 0,
    RCTScrollView = void 0;
if (Platform.OS === 'android') {
  nativeOnlyProps = {
    nativeOnly: {
      sendMomentumEvents: true
    }
  };
  AndroidScrollView = requireNativeComponent('RCTScrollView', ScrollView, nativeOnlyProps);
  AndroidHorizontalScrollView = requireNativeComponent('AndroidHorizontalScrollView', ScrollView, nativeOnlyProps);
} else if (Platform.OS === 'ios') {
  nativeOnlyProps = {
    nativeOnly: {
      onMomentumScrollBegin: true,
      onMomentumScrollEnd: true,
      onScrollBeginDrag: true,
      onScrollEndDrag: true
    }
  };
  RCTScrollView = requireNativeComponent('RCTScrollView', ScrollView, nativeOnlyProps);
}

module.exports = ScrollView;