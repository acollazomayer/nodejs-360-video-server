
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/VideoPano/VideoPano.js';
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var View = require('View');
var requireNativeComponent = require('requireNativeComponent');
var StyleSheetPropType = require('StyleSheetPropType');
var UIManager = require('UIManager');
var ReactNative = require('ReactNative');
var LayoutAndTransformTintPropTypes = require('LayoutAndTransformTintPropTypes');

var resolveAssetSource = require('resolveAssetSource');

var VideoPano = React.createClass({
  displayName: 'VideoPano',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformTintPropTypes),

    source: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string,
      format: PropTypes.string,
      layout: PropTypes.string,
      stereo: PropTypes.string,
      metaData: PropTypes.any
    }), PropTypes.arrayOf(PropTypes.shape({
      uri: PropTypes.string,
      format: PropTypes.string,
      layout: PropTypes.string,
      stereo: PropTypes.string,
      metaData: PropTypes.any
    }))]),

    poster: PropTypes.oneOfType([PropTypes.shape({
      uri: PropTypes.string
    }), PropTypes.number]),

    autoPlay: PropTypes.bool,

    loop: PropTypes.bool,

    muted: PropTypes.bool,

    onEnded: PropTypes.func,

    onDurationChange: PropTypes.func,

    onTimeUpdate: PropTypes.func,

    onPlayStatusChange: PropTypes.func,

    playControl: PropTypes.oneOf(['play', 'pause']),

    playerState: PropTypes.object,

    volume: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'VideoPano',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      volume: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      autoPlay: true,
      loop: false,
      muted: false,
      volume: 1.0,
      playControl: null,
      source: null
    };
  },

  getInitialState: function getInitialState() {
    return {
      volume: 1.0,
      muted: false
    };
  },

  componentWillMount: function componentWillMount() {
    if (this.props.playerState) {
      this._subscribe(this.props.playerState);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.playerState !== nextProps.playerState) {
      if (this.props.playerState) {
        this._unsubscribe(this.props.playerState);
      }
      if (nextProps.playerState) {
        this._subscribe(nextProps.playerState);
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.props.playerState) {
      this._unsubscribe(this.props.playerState);
    }
  },
  _subscribe: function _subscribe(playerState) {
    playerState.addListener('play', this._play);
    playerState.addListener('pause', this._pause);
    playerState.addListener('seekTo', this._seekTo);
    playerState.addListener('registerUserGesture', this._registerUserGesture);
    playerState.addListener('unregisterUserGesture', this._unregisterUserGesture);
    playerState.addListener('volumeChange', this._volumeChange);
    playerState.addListener('mutedChange', this._mutedChange);
    this.setState({
      volume: playerState.volume,
      muted: playerState.muted
    });
  },
  _unsubscribe: function _unsubscribe(playerState) {
    playerState.removeListener('play', this._play);
    playerState.removeListener('pause', this._pause);
    playerState.removeListener('seekTo', this._seekTo);
    playerState.removeListener('registerUserGesture', this._registerUserGesture);
    playerState.removeListener('unregisterUserGesture', this._unregisterUserGesture);
    playerState.removeListener('volumeChange', this._volumeChange);
    playerState.removeListener('mutedChange', this._mutedChange);
  },
  _registerUserGesture: function _registerUserGesture(commandID, commandArgs, reactTag) {
    UIManager.dispatchViewManagerCommand(reactTag, UIManager.VideoPano.Commands.setImmediateOnTouchEnd, ['touchend', ReactNative.findNodeHandle(this), commandID, commandArgs]);
  },
  _unregisterUserGesture: function _unregisterUserGesture(reactTag) {
    UIManager.dispatchViewManagerCommand(reactTag, UIManager.VideoPano.Commands.setImmediateOnTouchEnd, []);
  },
  _play: function _play() {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.VideoPano.Commands.play, []);
  },
  _pause: function _pause() {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.VideoPano.Commands.pause, []);
  },
  _seekTo: function _seekTo(timeSec) {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.VideoPano.Commands.seekTo, [timeSec]);
  },
  _volumeChange: function _volumeChange(volume) {
    this.setState({ volume: volume });
  },
  _mutedChange: function _mutedChange(muted) {
    this.setState({ muted: muted });
  },


  _onEnded: function _onEnded() {
    this.props.onEnded && this.props.onEnded();
  },

  _onDurationChange: function _onDurationChange(event) {
    if (this.props.playerState) {
      this.props.playerState.onDurationChange(event);
    }
    this.props.onDurationChange && this.props.onDurationChange(event);
  },

  _onTimeUpdate: function _onTimeUpdate(event) {
    if (this.props.playerState) {
      this.props.playerState.onTimeUpdate(event);
    }
    this.props.onTimeUpdate && this.props.onTimeUpdate(event);
  },

  _onPlayStatusChange: function _onPlayStatusChange(event) {
    if (this.props.playerState) {
      this.props.playerState.onPlayStatusChange(event);
    }
    this.props.onPlayStatusChange && this.props.onPlayStatusChange(event);
  },

  render: function render() {
    var styleProps = [{ renderGroup: true }, this.props.style];

    var props = babelHelpers.extends({}, this.props);
    props.poster = resolveAssetSource(this.props.poster);
    if (this.props.playerState) {
      props.autoPlay = false;
      props.volume = this.state.volume;
      props.muted = this.state.muted;
    }

    props.onDurationChange = this._onDurationChange;
    props.onTimeUpdate = this._onTimeUpdate;
    props.onPlayStatusChange = this._onPlayStatusChange;

    return React.createElement(
      RKVideoPano,
      babelHelpers.extends({
        style: styleProps
      }, props, {
        onEnded: this._onEnded,
        testID: this.props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        }, __source: {
          fileName: _jsxFileName,
          lineNumber: 330
        }
      }),
      this.props.children
    );
  }
});

var RKVideoPano = requireNativeComponent('VideoPano', VideoPano, {
  nativeOnly: {}
});

module.exports = VideoPano;