
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/CustomComponents/Navigator/NavigatorBreadcrumbNavigationBar.js';
var NavigatorBreadcrumbNavigationBarStyles = require('NavigatorBreadcrumbNavigationBarStyles');
var NavigatorNavigationBarStylesAndroid = require('NavigatorNavigationBarStylesAndroid');
var NavigatorNavigationBarStylesIOS = require('NavigatorNavigationBarStylesIOS');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var guid = require('guid');
var invariant = require('fbjs/lib/invariant');

var _require = require('immutable'),
    Map = _require.Map;

var Interpolators = NavigatorBreadcrumbNavigationBarStyles.Interpolators;
var NavigatorNavigationBarStyles = Platform.OS === 'android' ? NavigatorNavigationBarStylesAndroid : NavigatorNavigationBarStylesIOS;
var PropTypes = React.PropTypes;

var CRUMB_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var ICON_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var SEPARATOR_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var TITLE_PROPS = Interpolators.map(function () {
  return { style: {} };
});
var RIGHT_BUTTON_PROPS = Interpolators.map(function () {
  return { style: {} };
});

function navStatePresentedIndex(navState) {
  if (navState.presentedIndex !== undefined) {
    return navState.presentedIndex;
  }

  return navState.observedTopOfStack;
}

function initStyle(index, presentedIndex) {
  return index === presentedIndex ? NavigatorBreadcrumbNavigationBarStyles.Center[index] : index < presentedIndex ? NavigatorBreadcrumbNavigationBarStyles.Left[index] : NavigatorBreadcrumbNavigationBarStyles.Right[index];
}

var NavigatorBreadcrumbNavigationBar = function (_React$Component) {
  babelHelpers.inherits(NavigatorBreadcrumbNavigationBar, _React$Component);

  function NavigatorBreadcrumbNavigationBar() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, NavigatorBreadcrumbNavigationBar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = NavigatorBreadcrumbNavigationBar.__proto__ || Object.getPrototypeOf(NavigatorBreadcrumbNavigationBar)).call.apply(_ref, [this].concat(args))), _this), _this._getBreadcrumb = function (route, index) {
      var pointerEvents = _this.props.navState.routeStack.length <= 1 && index === 0 ? 'none' : 'auto';
      var navBarRouteMapper = _this.props.routeMapper;
      var firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));

      var breadcrumbDescriptor = React.createElement(
        View,
        {
          key: 'crumb_' + index,
          pointerEvents: pointerEvents,
          ref: 'crumb_' + index,
          style: firstStyles.Crumb, __source: {
            fileName: _jsxFileName,
            lineNumber: 234
          }
        },
        React.createElement(
          View,
          { ref: 'icon_' + index, style: firstStyles.Icon, __source: {
              fileName: _jsxFileName,
              lineNumber: 239
            }
          },
          navBarRouteMapper.iconForRoute(route, _this.props.navigator)
        ),
        React.createElement(
          View,
          { ref: 'separator_' + index, style: firstStyles.Separator, __source: {
              fileName: _jsxFileName,
              lineNumber: 242
            }
          },
          navBarRouteMapper.separatorForRoute(route, _this.props.navigator)
        )
      );

      return breadcrumbDescriptor;
    }, _this._getTitle = function (route, index) {
      if (_this._descriptors.title.has(route)) {
        return _this._descriptors.title.get(route);
      }

      var titleContent = _this.props.routeMapper.titleContentForRoute(_this.props.navState.routeStack[index], _this.props.navigator);
      var firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));

      var titleDescriptor = React.createElement(
        View,
        {
          key: 'title_' + index,
          ref: 'title_' + index,
          style: firstStyles.Title, __source: {
            fileName: _jsxFileName,
            lineNumber: 263
          }
        },
        titleContent
      );
      _this._descriptors.title = _this._descriptors.title.set(route, titleDescriptor);
      return titleDescriptor;
    }, _this._getRightButton = function (route, index) {
      if (_this._descriptors.right.has(route)) {
        return _this._descriptors.right.get(route);
      }
      var rightContent = _this.props.routeMapper.rightContentForRoute(_this.props.navState.routeStack[index], _this.props.navigator);
      if (!rightContent) {
        _this._descriptors.right = _this._descriptors.right.set(route, null);
        return null;
      }
      var firstStyles = initStyle(index, navStatePresentedIndex(_this.props.navState));
      var rightButtonDescriptor = React.createElement(
        View,
        {
          key: 'right_' + index,
          ref: 'right_' + index,
          style: firstStyles.RightItem, __source: {
            fileName: _jsxFileName,
            lineNumber: 288
          }
        },
        rightContent
      );
      _this._descriptors.right = _this._descriptors.right.set(route, rightButtonDescriptor);
      return rightButtonDescriptor;
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(NavigatorBreadcrumbNavigationBar, [{
    key: '_updateIndexProgress',
    value: function _updateIndexProgress(progress, index, fromIndex, toIndex) {
      var amount = toIndex > fromIndex ? progress : 1 - progress;
      var oldDistToCenter = index - fromIndex;
      var newDistToCenter = index - toIndex;
      var interpolate;
      invariant(Interpolators[index], 'Cannot find breadcrumb interpolators for ' + index);
      if (oldDistToCenter > 0 && newDistToCenter === 0 || newDistToCenter > 0 && oldDistToCenter === 0) {
        interpolate = Interpolators[index].RightToCenter;
      } else if (oldDistToCenter < 0 && newDistToCenter === 0 || newDistToCenter < 0 && oldDistToCenter === 0) {
        interpolate = Interpolators[index].CenterToLeft;
      } else if (oldDistToCenter === newDistToCenter) {
        interpolate = Interpolators[index].RightToCenter;
      } else {
        interpolate = Interpolators[index].RightToLeft;
      }

      if (interpolate.Crumb(CRUMB_PROPS[index].style, amount)) {
        this._setPropsIfExists('crumb_' + index, CRUMB_PROPS[index]);
      }
      if (interpolate.Icon(ICON_PROPS[index].style, amount)) {
        this._setPropsIfExists('icon_' + index, ICON_PROPS[index]);
      }
      if (interpolate.Separator(SEPARATOR_PROPS[index].style, amount)) {
        this._setPropsIfExists('separator_' + index, SEPARATOR_PROPS[index]);
      }
      if (interpolate.Title(TITLE_PROPS[index].style, amount)) {
        this._setPropsIfExists('title_' + index, TITLE_PROPS[index]);
      }
      var right = this.refs['right_' + index];

      var rightButtonStyle = RIGHT_BUTTON_PROPS[index].style;
      if (right && interpolate.RightItem(rightButtonStyle, amount)) {
        right.setNativeProps({
          style: rightButtonStyle,
          pointerEvents: rightButtonStyle.opacity === 0 ? 'none' : 'auto'
        });
      }
    }
  }, {
    key: 'updateProgress',
    value: function updateProgress(progress, fromIndex, toIndex) {
      var max = Math.max(fromIndex, toIndex);
      var min = Math.min(fromIndex, toIndex);
      for (var index = min; index <= max; index++) {
        this._updateIndexProgress(progress, index, fromIndex, toIndex);
      }
    }
  }, {
    key: 'onAnimationStart',
    value: function onAnimationStart(fromIndex, toIndex) {
      var max = Math.max(fromIndex, toIndex);
      var min = Math.min(fromIndex, toIndex);
      for (var index = min; index <= max; index++) {
        this._setRenderViewsToHardwareTextureAndroid(index, true);
      }
    }
  }, {
    key: 'onAnimationEnd',
    value: function onAnimationEnd() {
      var max = this.props.navState.routeStack.length - 1;
      for (var index = 0; index <= max; index++) {
        this._setRenderViewsToHardwareTextureAndroid(index, false);
      }
    }
  }, {
    key: '_setRenderViewsToHardwareTextureAndroid',
    value: function _setRenderViewsToHardwareTextureAndroid(index, renderToHardwareTexture) {
      var props = {
        renderToHardwareTextureAndroid: renderToHardwareTexture
      };

      this._setPropsIfExists('icon_' + index, props);
      this._setPropsIfExists('separator_' + index, props);
      this._setPropsIfExists('title_' + index, props);
      this._setPropsIfExists('right_' + index, props);
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this._reset();
    }
  }, {
    key: 'render',
    value: function render() {
      var navState = this.props.navState;
      var icons = navState && navState.routeStack.map(this._getBreadcrumb);
      var titles = navState.routeStack.map(this._getTitle);
      var buttons = navState.routeStack.map(this._getRightButton);

      return React.createElement(
        View,
        {
          key: this._key,
          style: [styles.breadCrumbContainer, this.props.style], __source: {
            fileName: _jsxFileName,
            lineNumber: 196
          }
        },
        titles,
        icons,
        buttons
      );
    }
  }, {
    key: 'immediatelyRefresh',
    value: function immediatelyRefresh() {
      this._reset();
      this.forceUpdate();
    }
  }, {
    key: '_reset',
    value: function _reset() {
      this._key = guid();
      this._descriptors = {
        title: new Map(),
        right: new Map()
      };
    }
  }, {
    key: '_setPropsIfExists',
    value: function _setPropsIfExists(ref, props) {
      var ref = this.refs[ref];
      ref && ref.setNativeProps(props);
    }
  }]);
  return NavigatorBreadcrumbNavigationBar;
}(React.Component);

NavigatorBreadcrumbNavigationBar.propTypes = {
  navigator: PropTypes.shape({
    push: PropTypes.func,
    pop: PropTypes.func,
    replace: PropTypes.func,
    popToRoute: PropTypes.func,
    popToTop: PropTypes.func
  }),
  routeMapper: PropTypes.shape({
    rightContentForRoute: PropTypes.func,
    titleContentForRoute: PropTypes.func,
    iconForRoute: PropTypes.func
  }),
  navState: React.PropTypes.shape({
    routeStack: React.PropTypes.arrayOf(React.PropTypes.object),
    presentedIndex: React.PropTypes.number
  }),
  style: View.propTypes.style
};
NavigatorBreadcrumbNavigationBar.Styles = NavigatorBreadcrumbNavigationBarStyles;


var styles = StyleSheet.create({
  breadCrumbContainer: {
    overflow: 'hidden',
    position: 'absolute',
    height: NavigatorNavigationBarStyles.General.TotalNavHeight,
    top: 0,
    left: 0,
    right: 0
  }
});

module.exports = NavigatorBreadcrumbNavigationBar;