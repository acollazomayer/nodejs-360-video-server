var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/Video/VideoControl.js';


var PropTypes = require('react/lib/ReactPropTypes');
var React = require('React');
var View = require('View');
var Text = require('Text');
var Image = require('Image');
var VrButton = require('VrButton');
var UIManager = require('UIManager');
var ReactNative = require('ReactNative');
var StyleSheet = require('StyleSheet');

var _require = require('VideoUtils'),
    videoTimeFormat = _require.videoTimeFormat;

var createGlyph = require('createGlyph');

var ControlGlyphs = require('../../lib-assets/VideoControlGlyphs');
var IMAGE_PLAY = createGlyph(ControlGlyphs.PLAY);
var IMAGE_PAUSE = createGlyph(ControlGlyphs.PAUSE);
var IMAGE_MUTE = createGlyph(ControlGlyphs.MUTE);
var IMAGE_UNMUTE = createGlyph(ControlGlyphs.UNMUTE);

var VideoControlButton = function (_React$Component) {
  babelHelpers.inherits(VideoControlButton, _React$Component);

  function VideoControlButton() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, VideoControlButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = VideoControlButton.__proto__ || Object.getPrototypeOf(VideoControlButton)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isFocused: false
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(VideoControlButton, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        VrButton,
        {
          style: [this.props.style, { backgroundColor: this.state.isFocused ? '#444' : '#222' }],
          onClick: this.props.onClick,
          onButtonPress: this.props.onButtonPress,
          onButtonRelease: this.props.onButtonRelease,
          onEnter: function onEnter() {
            return _this2.setState({ isFocused: true });
          },
          onExit: function onExit(e) {
            _this2.setState({ isFocused: false });
            _this2.props.onExit && _this2.props.onExit(e);
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 46
          }
        },
        React.createElement(Image, { style: styles.icon, source: this.props.icon, __source: {
            fileName: _jsxFileName,
            lineNumber: 56
          }
        })
      );
    }
  }]);
  return VideoControlButton;
}(React.Component);

var VideoSliderBar = function (_React$Component2) {
  babelHelpers.inherits(VideoSliderBar, _React$Component2);

  function VideoSliderBar() {
    var _ref2;

    var _temp2, _this3, _ret2;

    babelHelpers.classCallCheck(this, VideoSliderBar);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp2 = (_this3 = babelHelpers.possibleConstructorReturn(this, (_ref2 = VideoSliderBar.__proto__ || Object.getPrototypeOf(VideoSliderBar)).call.apply(_ref2, [this].concat(args))), _this3), _this3._gazedPosition = -1, _this3._onExit = function () {
      _this3._gazedPosition = -1;
    }, _this3._onClick = function () {
      _this3._gazedPosition >= 0 && _this3.props.onClickProgress && _this3.props.onClickProgress(_this3._gazedPosition);
    }, _this3._onFillMove = function (e) {
      _this3._gazedPosition = _this3.props.progress * e.nativeEvent.offset[0];
    }, _this3._onEmptyMove = function (e) {
      _this3._gazedPosition = _this3.props.progress + (1 - _this3.props.progress) * e.nativeEvent.offset[0];
    }, _temp2), babelHelpers.possibleConstructorReturn(_this3, _ret2);
  }

  babelHelpers.createClass(VideoSliderBar, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        VrButton,
        {
          style: [this.props.style, styles.barContainer],
          onExit: this._onExit,
          onClick: this._onClick, __source: {
            fileName: _jsxFileName,
            lineNumber: 91
          }
        },
        React.createElement(View, {
          style: [styles.barFill, { flex: this.props.progress, backgroundColor: this.props.fillColor }],
          onMove: this._onFillMove,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 95
          }
        }),
        React.createElement(View, {
          style: [styles.barEmpty, { flex: 1 - this.props.progress }],
          onMove: this._onEmptyMove,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 102
          }
        })
      );
    }
  }]);
  return VideoSliderBar;
}(React.Component);

var VideoControl = React.createClass({
  displayName: 'VideoControl',

  propTypes: babelHelpers.extends({}, View.propTypes, {
    fontSize: PropTypes.number.isRequired,

    playerState: PropTypes.object.isRequired
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      fontSize: 0.1
    };
  },

  getInitialState: function getInitialState() {
    return {
      volume: 1.0,
      muted: false,
      playStatus: 'loading',
      duration: null,
      currentTime: null
    };
  },

  componentWillMount: function componentWillMount() {
    if (this.props.playerState) {
      this._subscribe(this.props.playerState);
    }
    this._registeredUserGesture = false;
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
    playerState.addListener('volumeChange', this._volumeChange);
    playerState.addListener('mutedChange', this._mutedChange);
    playerState.addListener('durationChange', this._durationChange);
    playerState.addListener('timeUpdate', this._timeUpdate);
    playerState.addListener('playStatusChange', this._playStatusChange);
    this.setState({
      playStatus: playerState.playStatus,
      volume: playerState.volume,
      muted: playerState.muted,
      duration: playerState.duration,
      currentTime: playerState.currentTime
    });
  },
  _unsubscribe: function _unsubscribe(playerState) {
    playerState.removeListener('volumeChange', this._volumeChange);
    playerState.removeListener('mutedChange', this._mutedChange);
    playerState.removeListener('durationChange', this._durationChange);
    playerState.removeListener('timeUpdate', this._timeUpdate);
    playerState.removeListener('playStatusChange', this._playStatusChange);
  },
  _volumeChange: function _volumeChange(volume) {
    this.setState({ volume: volume });
  },
  _mutedChange: function _mutedChange(muted) {
    this.setState({ muted: muted });
  },
  _durationChange: function _durationChange(duration) {
    this.setState({ duration: duration });
  },
  _timeUpdate: function _timeUpdate(currentTime) {
    this.setState({ currentTime: currentTime });
  },
  _playStatusChange: function _playStatusChange(playStatus) {
    this.setState({ playStatus: playStatus });
  },
  _onPlayButtonClick: function _onPlayButtonClick() {
    if (!this._registeredUserGesture) {
      if (this.state.playStatus === 'playing') {
        this.props.playerState.pause();
      } else {
        this.props.playerState.play();
      }
    }
  },
  _onPlayButtonPress: function _onPlayButtonPress(event) {
    if (event.nativeEvent.inputEvent.type === 'TouchInputEvent') {
      if (this.state.playStatus !== 'playing') {
        this.props.playerState.registerUserGesture(UIManager.Video.Commands.play, [], ReactNative.findNodeHandle(this));
        this._registeredUserGesture = true;
      }
    }
  },
  _onPlayButtonRelease: function _onPlayButtonRelease(event) {
    if (event.nativeEvent.inputEvent.type === 'TouchInputEvent') {
      if (this._registeredUserGesture) {
        this.props.playerState.unregisterUserGesture(ReactNative.findNodeHandle(this));
        this._registeredUserGesture = false;
      }
    }
  },
  _onPlayButtonExit: function _onPlayButtonExit() {
    if (this._registeredUserGesture) {
      this.props.playerState.unregisterUserGesture(ReactNative.findNodeHandle(this));
      this._registeredUserGesture = false;
    }
  },
  _onMuteButtonClick: function _onMuteButtonClick() {
    this.props.playerState.setMuted(!this.state.muted);
  },
  _onVolumeClick: function _onVolumeClick(volume) {
    this.props.playerState.setVolume(volume);
  },
  _onClickProgress: function _onClickProgress(progress) {
    this.props.playerState.seekTo(this.state.duration * progress);
  },


  render: function render() {
    var playButtonIcon = this.state.playStatus === 'playing' ? IMAGE_PAUSE : IMAGE_PLAY;
    var muteButonIcon = this.state.muted ? IMAGE_MUTE : IMAGE_UNMUTE;
    var videoProgress = this.state.currentTime && this.state.duration ? this.state.currentTime / this.state.duration : 0;
    return React.createElement(
      View,
      { style: [this.props.style, styles.container], __source: {
          fileName: _jsxFileName,
          lineNumber: 283
        }
      },
      React.createElement(VideoControlButton, {
        onClick: this._onPlayButtonClick,
        onButtonPress: this._onPlayButtonPress,
        onButtonRelease: this._onPlayButtonRelease,
        onExit: this._onPlayButtonExit,
        style: styles.button,
        icon: playButtonIcon,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 284
        }
      }),
      React.createElement(
        View,
        { style: styles.timerContainer, __source: {
            fileName: _jsxFileName,
            lineNumber: 292
          }
        },
        React.createElement(VideoSliderBar, {
          fillColor: '#1099eb',
          onClickProgress: this._onClickProgress,
          progress: videoProgress,
          style: styles.progressBar,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 293
          }
        }),
        React.createElement(
          Text,
          { style: [styles.text, styles.timerText, { fontSize: this.props.fontSize }], __source: {
              fileName: _jsxFileName,
              lineNumber: 299
            }
          },
          videoTimeFormat(this.state.currentTime) + '/' + videoTimeFormat(this.state.duration)
        )
      ),
      React.createElement(VideoControlButton, {
        onClick: this._onMuteButtonClick,
        style: styles.button,
        icon: muteButonIcon,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 303
        }
      }),
      React.createElement(
        View,
        { style: styles.volumeContainer, __source: {
            fileName: _jsxFileName,
            lineNumber: 308
          }
        },
        React.createElement(VideoSliderBar, {
          fillColor: '#888',
          onClickProgress: this._onVolumeClick,
          progress: this.state.volume,
          style: styles.volumeBar,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 309
          }
        })
      )
    );
  }
});

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#999'
  },
  button: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    height: '70%',
    maxWidth: '100%',
    aspectRatio: 1.0
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: '2%'
  },
  timerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '2%'
  },
  timerText: {
    paddingLeft: '2%',
    paddingRight: 0
  },
  progressBar: {
    flex: 1
  },
  barContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  barFill: {
    height: '30%'
  },
  barEmpty: {
    height: '30%',
    backgroundColor: '#333'
  },
  volumeContainer: {
    flex: 0.3,
    paddingHorizontal: '2%',
    backgroundColor: '#222'
  },
  volumeBar: {
    flex: 1
  }
});

module.exports = VideoControl;