Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = '/usr/src/app/index.vr.js';

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactVr = require('react-vr');

var _VideoPlayer = require('./components/VideoPlayer.js');

var _VideoPlayer2 = babelHelpers.interopRequireDefault(_VideoPlayer);

var VrVideoApp = function (_React$Component) {
  babelHelpers.inherits(VrVideoApp, _React$Component);

  function VrVideoApp() {
    babelHelpers.classCallCheck(this, VrVideoApp);
    return babelHelpers.possibleConstructorReturn(this, (VrVideoApp.__proto__ || Object.getPrototypeOf(VrVideoApp)).apply(this, arguments));
  }

  babelHelpers.createClass(VrVideoApp, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_VideoPlayer2.default, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 14
        }
      });
    }
  }]);
  return VrVideoApp;
}(_react2.default.Component);

exports.default = VrVideoApp;
;

_reactVr.AppRegistry.registerComponent('VrVideoApp', function () {
  return VrVideoApp;
});