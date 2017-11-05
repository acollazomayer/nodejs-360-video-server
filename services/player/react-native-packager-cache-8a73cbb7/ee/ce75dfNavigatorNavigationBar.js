
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorNavigationBar.js';
var React = require('React');
var NavigatorNavigationBarStylesAndroid = require('NavigatorNavigationBarStylesAndroid');
var NavigatorNavigationBarStylesIOS = require('NavigatorNavigationBarStylesIOS');
var Platform = require('Platform');
var StyleSheet = require('StyleSheet');
var View = require('View');

var guid = require('guid');

var _require = require('immutable'),
    Map = _require.Map;

var COMPONENT_NAMES = ['Title', 'LeftButton', 'RightButton'];

var NavigatorNavigationBarStyles = Platform.OS === 'android' ? NavigatorNavigationBarStylesAndroid : NavigatorNavigationBarStylesIOS;

var navStatePresentedIndex = function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }

  return navState.observedTopOfStack;
};

var NavigatorNavigationBar = function (_React$Component) {
  babelHelpers.inherits(NavigatorNavigationBar, _React$Component);

  function NavigatorNavigationBar() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, NavigatorNavigationBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = NavigatorNavigationBar.__proto__ || Object.getPrototypeOf(NavigatorNavigationBar)).call.apply(_ref, [this].concat(args))), _this), _this.immediatelyRefresh = function () {
      _this._reset();
      _this.forceUpdate();
    }, _this._reset = function () {
      _this._key = guid();
      _this._reusableProps = {};
      _this._components = {};
      _this._descriptors = {};

      COMPONENT_NAMES.forEach(function (componentName) {
        _this._components[componentName] = new Map();
        _this._descriptors[componentName] = new Map();
      });
    }, _this._getReusableProps = function (componentName, index) {
      var propStack = _this._reusableProps[componentName];
      if (!propStack) {
        propStack = _this._reusableProps[componentName] = [];
      }
      var props = propStack[index];
      if (!props) {
        props = propStack[index] = { style: {} };
      }
      return props;
    }, _this._updateIndexProgress = function (progress, index, fromIndex, toIndex) {
      var amount = toIndex > fromIndex ? progress : 1 - progress;
      var oldDistToCenter = index - fromIndex;
      var newDistToCenter = index - toIndex;
      var interpolate;
      if (oldDistToCenter > 0 && newDistToCenter === 0 || newDistToCenter > 0 && oldDistToCenter === 0) {
        interpolate = _this.props.navigationStyles.Interpolators.RightToCenter;
      } else if (oldDistToCenter < 0 && newDistToCenter === 0 || newDistToCenter < 0 && oldDistToCenter === 0) {
        interpolate = _this.props.navigationStyles.Interpolators.CenterToLeft;
      } else if (oldDistToCenter === newDistToCenter) {
        interpolate = _this.props.navigationStyles.Interpolators.RightToCenter;
      } else {
        interpolate = _this.props.navigationStyles.Interpolators.RightToLeft;
      }

      COMPONENT_NAMES.forEach(function (componentName) {
        var component = this._components[componentName].get(this.props.navState.routeStack[index]);
        var props = this._getReusableProps(componentName, index);
        if (component && interpolate[componentName](props.style, amount)) {
          props.pointerEvents = props.style.opacity === 0 ? 'none' : 'box-none';
          component.setNativeProps(props);
        }
      }, _this);
    }, _this.updateProgress = function (progress, fromIndex, toIndex) {
      var max = Math.max(fromIndex, toIndex);
      var min = Math.min(fromIndex, toIndex);
      for (var index = min; index <= max; index++) {
        _this._updateIndexProgress(progress, index, fromIndex, toIndex);
      }
    }, _this._getComponent = function (componentName, route, index) {
      if (_this._descriptors[componentName].includes(route)) {
        return _this._descriptors[componentName].get(route);
      }

      var rendered = null;

      var content = _this.props.routeMapper[componentName](_this.props.navState.routeStack[index], _this.props.navigator, index, _this.props.navState);
      if (!content) {
        return null;
      }

      var componentIsActive = index === navStatePresentedIndex(_this.props.navState);
      var initialStage = componentIsActive ? _this.props.navigationStyles.Stages.Center : _this.props.navigationStyles.Stages.Left;
      rendered = React.createElement(
        View,
        {
          ref: function ref(_ref2) {
            _this._components[componentName] = _this._components[componentName].set(route, _ref2);
          },
          pointerEvents: componentIsActive ? 'box-none' : 'none',
          style: initialStage[componentName], __source: {
            fileName: _jsxFileName,
            lineNumber: 196
          }
        },
        content
      );

      _this._descriptors[componentName] = _this._descriptors[componentName].set(route, rendered);
      return rendered;
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(NavigatorNavigationBar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._reset();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var navBarStyle = {
        height: this.props.navigationStyles.General.TotalNavHeight
      };
      var navState = this.props.navState;
      var components = navState.routeStack.map(function (route, index) {
        return COMPONENT_NAMES.map(function (componentName) {
          return _this2._getComponent(componentName, route, index);
        });
      });

      return React.createElement(
        View,
        {
          key: this._key,
          style: [styles.navBarContainer, navBarStyle, this.props.style], __source: {
            fileName: _jsxFileName,
            lineNumber: 166
          }
        },
        components
      );
    }
  }]);
  return NavigatorNavigationBar;
}(React.Component);

NavigatorNavigationBar.propTypes = {
  navigator: React.PropTypes.object,
  routeMapper: React.PropTypes.shape({
    Title: React.PropTypes.func.isRequired,
    LeftButton: React.PropTypes.func.isRequired,
    RightButton: React.PropTypes.func.isRequired
  }).isRequired,
  navState: React.PropTypes.shape({
    routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
    presentedIndex: React.PropTypes.number
  }),
  navigationStyles: React.PropTypes.object,
  style: View.propTypes.style
};
NavigatorNavigationBar.Styles = NavigatorNavigationBarStyles;
NavigatorNavigationBar.StylesAndroid = NavigatorNavigationBarStylesAndroid;
NavigatorNavigationBar.StylesIOS = NavigatorNavigationBarStylesIOS;
NavigatorNavigationBar.defaultProps = {
  navigationStyles: NavigatorNavigationBarStyles
};


var styles = StyleSheet.create({
  navBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
});

module.exports = NavigatorNavigationBar;