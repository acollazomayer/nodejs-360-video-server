var _jsxFileName = '/usr/src/app/components/VideoPlayer.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactVr = require('react-vr');

var VideoPlayer = function (_React$Component) {
  babelHelpers.inherits(VideoPlayer, _React$Component);

  function VideoPlayer(props) {
    babelHelpers.classCallCheck(this, VideoPlayer);

    var _this = babelHelpers.possibleConstructorReturn(this, (VideoPlayer.__proto__ || Object.getPrototypeOf(VideoPlayer)).call(this, props));

    _this.state = {
      playerState: new _reactVr.MediaPlayerState({ autoPlay: true, muted: true }) };
    return _this;
  }

  babelHelpers.createClass(VideoPlayer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactVr.View,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          }
        },
        _react2.default.createElement(_reactVr.VideoPano, {
          style: { height: 2.25, width: 4 },
          source: { uri: 'http://localhost:9000/video/360.mp4' },
          playerState: this.state.playerState, __source: {
            fileName: _jsxFileName,
            lineNumber: 20
          }
        }),
        _react2.default.createElement(_reactVr.VideoControl, {
          style: { height: 10, width: 4 },
          playerState: this.state.playerState, __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        })
      );
    }
  }]);
  return VideoPlayer;
}(_react2.default.Component);

module.exports = VideoPlayer;