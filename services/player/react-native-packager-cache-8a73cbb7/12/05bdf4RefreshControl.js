
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/RefreshControl/RefreshControl.js';
var ColorPropType = require('ColorPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var Platform = require('Platform');
var React = require('React');
var View = require('View');

var requireNativeComponent = require('requireNativeComponent');

if (Platform.OS === 'android') {
  var RefreshLayoutConsts = require('UIManager').AndroidSwipeRefreshLayout.Constants;
} else {
  var RefreshLayoutConsts = { SIZE: {} };
}

var RefreshControl = React.createClass({
  displayName: 'RefreshControl',

  statics: {
    SIZE: RefreshLayoutConsts.SIZE
  },

  mixins: [NativeMethodsMixin],

  propTypes: babelHelpers.extends({}, View.propTypes, {
    onRefresh: React.PropTypes.func,

    refreshing: React.PropTypes.bool.isRequired,

    tintColor: ColorPropType,

    titleColor: ColorPropType,

    title: React.PropTypes.string,

    enabled: React.PropTypes.bool,

    colors: React.PropTypes.arrayOf(ColorPropType),

    progressBackgroundColor: ColorPropType,

    size: React.PropTypes.oneOf([RefreshLayoutConsts.SIZE.DEFAULT, RefreshLayoutConsts.SIZE.LARGE]),

    progressViewOffset: React.PropTypes.number
  }),

  _nativeRef: null,
  _lastNativeRefreshing: false,

  componentDidMount: function componentDidMount() {
    this._lastNativeRefreshing = this.props.refreshing;
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.refreshing !== prevProps.refreshing) {
      this._lastNativeRefreshing = this.props.refreshing;
    } else if (this.props.refreshing !== this._lastNativeRefreshing) {
      this._nativeRef.setNativeProps({ refreshing: this.props.refreshing });
      this._lastNativeRefreshing = this.props.refreshing;
    }
  },
  render: function render() {
    var _this = this;

    return React.createElement(NativeRefreshControl, babelHelpers.extends({}, this.props, {
      ref: function ref(_ref) {
        _this._nativeRef = _ref;
      },
      onRefresh: this._onRefresh,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 153
      }
    }));
  },
  _onRefresh: function _onRefresh() {
    this._lastNativeRefreshing = true;

    this.props.onRefresh && this.props.onRefresh();

    this.forceUpdate();
  }
});

if (Platform.OS === 'ios') {
  var NativeRefreshControl = requireNativeComponent('RCTRefreshControl', RefreshControl);
} else if (Platform.OS === 'android') {
  var NativeRefreshControl = requireNativeComponent('AndroidSwipeRefreshLayout', RefreshControl);
}

module.exports = RefreshControl;