
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Switch/Switch.js';
var ColorPropType = require('ColorPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var View = require('View');

var requireNativeComponent = require('requireNativeComponent');

var PropTypes = React.PropTypes;

var Switch = React.createClass({
  displayName: 'Switch',

  propTypes: babelHelpers.extends({}, View.propTypes, {
    value: PropTypes.bool,

    disabled: PropTypes.bool,

    onValueChange: PropTypes.func,

    testID: PropTypes.string,

    tintColor: ColorPropType,

    onTintColor: ColorPropType,

    thumbTintColor: ColorPropType
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      value: false,
      disabled: false
    };
  },

  mixins: [NativeMethodsMixin],

  _rctSwitch: {},
  _onChange: function _onChange(event) {
    if (Platform.OS === 'android') {
      this._rctSwitch.setNativeProps({ on: this.props.value });
    } else {
      this._rctSwitch.setNativeProps({ value: this.props.value });
    }

    this.props.onChange && this.props.onChange(event);
    this.props.onValueChange && this.props.onValueChange(event.nativeEvent.value);
  },

  render: function render() {
    var _this = this;

    var props = babelHelpers.extends({}, this.props);
    props.onStartShouldSetResponder = function () {
      return true;
    };
    props.onResponderTerminationRequest = function () {
      return false;
    };
    if (Platform.OS === 'android') {
      props.enabled = !this.props.disabled;
      props.on = this.props.value;
      props.style = this.props.style;
      props.trackTintColor = this.props.value ? this.props.onTintColor : this.props.tintColor;
    } else if (Platform.OS === 'ios') {
      props.style = [styles.rctSwitchIOS, this.props.style];
    }
    return React.createElement(RCTSwitch, babelHelpers.extends({}, props, {
      ref: function ref(_ref) {
        _this._rctSwitch = _ref;
      },
      onChange: this._onChange,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111
      }
    }));
  }
});

var styles = StyleSheet.create({
  rctSwitchIOS: {
    height: 31,
    width: 51
  }
});

if (Platform.OS === 'android') {
  var RCTSwitch = requireNativeComponent('AndroidSwitch', Switch, {
    nativeOnly: {
      onChange: true,
      on: true,
      enabled: true,
      trackTintColor: true
    }
  });
} else {
  var RCTSwitch = requireNativeComponent('RCTSwitch', Switch, {
    nativeOnly: {
      onChange: true
    }
  });
}

module.exports = Switch;