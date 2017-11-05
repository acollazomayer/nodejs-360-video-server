
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Experimental/SwipeableRow/SwipeableRow.js';
var Animated = require('Animated');
var PanResponder = require('PanResponder');
var I18nManager = require('I18nManager');
var React = require('React');
var StyleSheet = require('StyleSheet');
var TimerMixin = require('react-timer-mixin');
var View = require('View');

var PropTypes = React.PropTypes;


var emptyFunction = require('fbjs/lib/emptyFunction');

var IS_RTL = I18nManager.isRTL;

var CLOSED_LEFT_POSITION = 0;

var HORIZONTAL_SWIPE_DISTANCE_THRESHOLD = 10;

var HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD = 0.3;

var SLOW_SPEED_SWIPE_FACTOR = 4;

var SWIPE_DURATION = 300;

var ON_MOUNT_BOUNCE_DELAY = 700;
var ON_MOUNT_BOUNCE_DURATION = 400;

var RIGHT_SWIPE_BOUNCE_BACK_DISTANCE = 30;
var RIGHT_SWIPE_BOUNCE_BACK_DURATION = 300;

var RIGHT_SWIPE_THRESHOLD = 30 * SLOW_SPEED_SWIPE_FACTOR;

var SwipeableRow = React.createClass({
  displayName: 'SwipeableRow',

  _panResponder: {},
  _previousLeft: CLOSED_LEFT_POSITION,

  mixins: [TimerMixin],

  propTypes: {
    children: PropTypes.any,
    isOpen: PropTypes.bool,
    maxSwipeDistance: PropTypes.number.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwipeEnd: PropTypes.func.isRequired,
    onSwipeStart: PropTypes.func.isRequired,

    shouldBounceOnMount: PropTypes.bool,

    slideoutView: PropTypes.node.isRequired,

    swipeThreshold: PropTypes.number.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      currentLeft: new Animated.Value(this._previousLeft),

      isSwipeableViewRendered: false,
      rowHeight: null
    };
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isOpen: false,
      maxSwipeDistance: 0,
      onOpen: emptyFunction,
      onClose: emptyFunction,
      onSwipeEnd: emptyFunction,
      onSwipeStart: emptyFunction,
      swipeThreshold: 30
    };
  },
  componentWillMount: function componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponderCapture,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._onPanResponderTerminationRequest,
      onPanResponderTerminate: this._handlePanResponderEnd,
      onShouldBlockNativeResponder: function onShouldBlockNativeResponder(event, gestureState) {
        return false;
      }
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    if (this.props.shouldBounceOnMount) {
      this.setTimeout(function () {
        _this._animateBounceBack(ON_MOUNT_BOUNCE_DURATION);
      }, ON_MOUNT_BOUNCE_DELAY);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.isOpen && !nextProps.isOpen) {
      this._animateToClosedPosition();
    }
  },
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    if (this.props.shouldBounceOnMount && !nextProps.shouldBounceOnMount) {
      return false;
    }

    return true;
  },
  render: function render() {
    var slideOutView = void 0;
    if (this.state.isSwipeableViewRendered) {
      slideOutView = React.createElement(
        View,
        { style: [styles.slideOutContainer, { height: this.state.rowHeight }], __source: {
            fileName: _jsxFileName,
            lineNumber: 179
          }
        },
        this.props.slideoutView
      );
    }

    var swipeableView = React.createElement(
      Animated.View,
      {
        onLayout: this._onSwipeableViewLayout,
        style: [styles.swipeableContainer, {
          transform: [{ translateX: this.state.currentLeft }]
        }], __source: {
          fileName: _jsxFileName,
          lineNumber: 190
        }
      },
      this.props.children
    );

    return React.createElement(
      View,
      babelHelpers.extends({}, this._panResponder.panHandlers, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 203
        }
      }),
      slideOutView,
      swipeableView
    );
  },
  _onSwipeableViewLayout: function _onSwipeableViewLayout(event) {
    this.setState({
      isSwipeableViewRendered: true,
      rowHeight: event.nativeEvent.layout.height
    });
  },
  _handleMoveShouldSetPanResponderCapture: function _handleMoveShouldSetPanResponderCapture(event, gestureState) {
    return gestureState.dy < 10 && this._isValidSwipe(gestureState);
  },
  _handlePanResponderGrant: function _handlePanResponderGrant(event, gestureState) {},
  _handlePanResponderMove: function _handlePanResponderMove(event, gestureState) {
    if (this._isSwipingExcessivelyRightFromClosedPosition(gestureState)) {
      return;
    }

    this.props.onSwipeStart();

    if (this._isSwipingRightFromClosed(gestureState)) {
      this._swipeSlowSpeed(gestureState);
    } else {
      this._swipeFullSpeed(gestureState);
    }
  },
  _isSwipingRightFromClosed: function _isSwipingRightFromClosed(gestureState) {
    var gestureStateDx = IS_RTL ? -gestureState.dx : gestureState.dx;
    return this._previousLeft === CLOSED_LEFT_POSITION && gestureStateDx > 0;
  },
  _swipeFullSpeed: function _swipeFullSpeed(gestureState) {
    this.state.currentLeft.setValue(this._previousLeft + gestureState.dx);
  },
  _swipeSlowSpeed: function _swipeSlowSpeed(gestureState) {
    this.state.currentLeft.setValue(this._previousLeft + gestureState.dx / SLOW_SPEED_SWIPE_FACTOR);
  },
  _isSwipingExcessivelyRightFromClosedPosition: function _isSwipingExcessivelyRightFromClosedPosition(gestureState) {
    var gestureStateDx = IS_RTL ? -gestureState.dx : gestureState.dx;
    return this._isSwipingRightFromClosed(gestureState) && gestureStateDx > RIGHT_SWIPE_THRESHOLD;
  },
  _onPanResponderTerminationRequest: function _onPanResponderTerminationRequest(event, gestureState) {
    return false;
  },
  _animateTo: function _animateTo(toValue) {
    var _this2 = this;

    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SWIPE_DURATION;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : emptyFunction;

    Animated.timing(this.state.currentLeft, {
      duration: duration,
      toValue: toValue
    }).start(function () {
      _this2._previousLeft = toValue;
      callback();
    });
  },
  _animateToOpenPosition: function _animateToOpenPosition() {
    var maxSwipeDistance = IS_RTL ? -this.props.maxSwipeDistance : this.props.maxSwipeDistance;
    this._animateTo(-maxSwipeDistance);
  },
  _animateToOpenPositionWith: function _animateToOpenPositionWith(speed, distMoved) {
    speed = speed > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD ? speed : HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD;

    var duration = Math.abs((this.props.maxSwipeDistance - Math.abs(distMoved)) / speed);
    var maxSwipeDistance = IS_RTL ? -this.props.maxSwipeDistance : this.props.maxSwipeDistance;
    this._animateTo(-maxSwipeDistance, duration);
  },
  _animateToClosedPosition: function _animateToClosedPosition() {
    var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SWIPE_DURATION;

    this._animateTo(CLOSED_LEFT_POSITION, duration);
  },
  _animateToClosedPositionDuringBounce: function _animateToClosedPositionDuringBounce() {
    this._animateToClosedPosition(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
  },
  _animateBounceBack: function _animateBounceBack(duration) {
    var swipeBounceBackDistance = IS_RTL ? -RIGHT_SWIPE_BOUNCE_BACK_DISTANCE : RIGHT_SWIPE_BOUNCE_BACK_DISTANCE;
    this._animateTo(-swipeBounceBackDistance, duration, this._animateToClosedPositionDuringBounce);
  },
  _isValidSwipe: function _isValidSwipe(gestureState) {
    return Math.abs(gestureState.dx) > HORIZONTAL_SWIPE_DISTANCE_THRESHOLD;
  },
  _shouldAnimateRemainder: function _shouldAnimateRemainder(gestureState) {
    return Math.abs(gestureState.dx) > this.props.swipeThreshold || gestureState.vx > HORIZONTAL_FULL_SWIPE_SPEED_THRESHOLD;
  },
  _handlePanResponderEnd: function _handlePanResponderEnd(event, gestureState) {
    var horizontalDistance = IS_RTL ? -gestureState.dx : gestureState.dx;
    if (this._isSwipingRightFromClosed(gestureState)) {
      this.props.onOpen();
      this._animateBounceBack(RIGHT_SWIPE_BOUNCE_BACK_DURATION);
    } else if (this._shouldAnimateRemainder(gestureState)) {
      if (horizontalDistance < 0) {
        this.props.onOpen();
        this._animateToOpenPositionWith(gestureState.vx, horizontalDistance);
      } else {
        this.props.onClose();
        this._animateToClosedPosition();
      }
    } else {
      if (this._previousLeft === CLOSED_LEFT_POSITION) {
        this._animateToClosedPosition();
      } else {
        this._animateToOpenPosition();
      }
    }

    this.props.onSwipeEnd();
  }
});

var styles = StyleSheet.create({
  slideOutContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  swipeableContainer: {
    flex: 1
  }
});

module.exports = SwipeableRow;