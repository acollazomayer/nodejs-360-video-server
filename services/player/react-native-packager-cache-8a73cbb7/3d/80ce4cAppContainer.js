

'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/ReactNative/AppContainer.js';
var EmitterSubscription = require('EmitterSubscription');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var React = require('React');
var ReactNative = require('ReactNative');
var StyleSheet = require('StyleSheet');
var View = require('View');

var AppContainer = function (_React$Component) {
  babelHelpers.inherits(AppContainer, _React$Component);

  function AppContainer() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, AppContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = AppContainer.__proto__ || Object.getPrototypeOf(AppContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      inspector: null,
      mainKey: 1
    }, _this._subscription = null, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(AppContainer, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        rootTag: this.props.rootTag
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (__DEV__) {
        this._subscription = RCTDeviceEventEmitter.addListener('toggleElementInspector', function () {
          var Inspector = require('Inspector');
          var inspector = _this2.state.inspector ? null : React.createElement(Inspector, {
            inspectedViewTag: ReactNative.findNodeHandle(_this2._mainRef),
            onRequestRerenderApp: function onRequestRerenderApp(updateInspectedViewTag) {
              _this2.setState(function (s) {
                return { mainKey: s.mainKey + 1 };
              }, function () {
                return updateInspectedViewTag(ReactNative.findNodeHandle(_this2._mainRef));
              });
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 61
            }
          });
          _this2.setState({ inspector: inspector });
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._subscription) {
        this._subscription.remove();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var yellowBox = null;
      if (__DEV__) {
        var YellowBox = require('YellowBox');
        yellowBox = React.createElement(YellowBox, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 88
          }
        });
      }

      return React.createElement(
        View,
        { style: styles.appContainer, pointerEvents: 'box-none', __source: {
            fileName: _jsxFileName,
            lineNumber: 92
          }
        },
        React.createElement(
          View,
          {
            collapsable: !this.state.inspector,
            key: this.state.mainKey,
            pointerEvents: 'box-none',
            style: styles.appContainer, ref: function ref(_ref2) {
              _this3._mainRef = _ref2;
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 93
            }
          },
          this.props.children
        ),
        yellowBox,
        this.state.inspector
      );
    }
  }]);
  return AppContainer;
}(React.Component);

AppContainer.childContextTypes = {
  rootTag: React.PropTypes.number
};


var styles = StyleSheet.create({
  appContainer: {
    flex: 1
  }
});

module.exports = AppContainer;