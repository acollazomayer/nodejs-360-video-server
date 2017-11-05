
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Sound/Sound.js';
var LayoutAndTransformPropTypes = require('LayoutAndTransformPropTypes');
var NativeMethodsMixin = require('NativeMethodsMixin');
var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var UIManager = require('UIManager');
var ReactNative = require('ReactNative');
var StyleSheetPropType = require('StyleSheetPropType');
var View = require('View');

var requireNativeComponent = require('requireNativeComponent');
var resolveAssetSource = require('resolveAssetSource');

var Sound = React.createClass({
  displayName: 'Sound',

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    style: StyleSheetPropType(LayoutAndTransformPropTypes),

    source: PropTypes.object,

    autoPlay: PropTypes.bool,

    loop: PropTypes.bool,

    muted: PropTypes.bool,

    onEnded: PropTypes.func,

    onDurationChange: PropTypes.func,

    onTimeUpdate: PropTypes.func,

    onPlayStatusChange: PropTypes.func,

    playStatus: PropTypes.oneOf(['play', 'pause', 'stop']),

    playControl: PropTypes.oneOf(['play', 'pause', 'stop']),

    playerState: PropTypes.object,

    volume: PropTypes.number
  }),

  viewConfig: {
    uiViewClassName: 'Sound',
    validAttributes: babelHelpers.extends({}, ReactNativeViewAttributes.RCTView, {
      volume: true
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      autoPlay: true,
      volume: 1.0,
      loop: false,
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
    if (__DEV__) {
      if (this.props.playStatus) {
        console.warn('playStatus has been renamed to playControl. Please update your code before v2.0.0');
      }
    }
    if (this.props.playerState) {
      this._subscribe(this.props.playerState);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (__DEV__) {
      if (nextProps.playStatus) {
        console.warn('playStatus has been renamed to playControl. Please update your code before v2.0.0');
      }
    }
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
    playerState.removeListener('volumeChange', this._volumeChange);
    playerState.removeListener('mutedChange', this._mutedChange);
  },
  _play: function _play() {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.Sound.Commands.play, []);
  },
  _pause: function _pause() {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.Sound.Commands.pause, []);
  },
  _seekTo: function _seekTo(timeSec) {
    UIManager.dispatchViewManagerCommand(ReactNative.findNodeHandle(this), UIManager.Sound.Commands.seekTo, [timeSec]);
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
    var props = babelHelpers.extends({}, this.props) || {};
    props.style = props.style || {};
    if (__DEV__) {
      if (props.children) {
        console.warn('<Sound> must be a leaf node, props.children will not be rendered');
      }
    }
    if (props.playStatus && !props.playControl) {
      props.playControl = props.playStatus;
      delete props['playStatus'];
    }
    if (this.props.playerState) {
      props.autoPlay = false;
      props.volume = this.state.volume;
      props.muted = this.state.muted;
    }

    props.onDurationChange = this._onDurationChange;
    props.onTimeUpdate = this._onTimeUpdate;
    props.onPlayStatusChange = this._onPlayStatusChange;

    var source = resolveAssetSource(props.source);

    if (source) {
      return React.createElement(RKSound, babelHelpers.extends({
        style: [{ position: 'absolute' }, props.style]
      }, props, {
        onEnded: this._onEnded,
        testID: props.testID,
        onStartShouldSetResponder: function onStartShouldSetResponder() {
          return true;
        },
        onResponderTerminationRequest: function onResponderTerminationRequest() {
          return false;
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 313
        }
      }));
    }

    return null;
  }
});

var RKSound = requireNativeComponent('Sound', Sound, {
  nativeOnly: {}
});

module.exports = Sound;