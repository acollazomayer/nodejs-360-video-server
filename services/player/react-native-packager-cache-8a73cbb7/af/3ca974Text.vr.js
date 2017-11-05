
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-vr/Libraries/VRReactOverrides/Text.vr.js';
var ColorPropType = require('ColorPropType');
var EdgeInsetsPropType = require('EdgeInsetsPropType');
var NativeMethodsMixin = require('NativeMethodsMixin');
var Platform = require('Platform');
var React = require('React');
var ReactNativeViewAttributes = require('ReactNativeViewAttributes');
var StyleSheetPropType = require('StyleSheetPropType');
var TextStylePropTypes = require('TextStylePropTypes');
var Touchable = require('Touchable');

var processColor = require('processColor');
var createReactNativeComponentClass = require('createReactNativeComponentClass');
var mergeFast = require('mergeFast');

var PropTypes = React.PropTypes;


var stylePropType = StyleSheetPropType(TextStylePropTypes);

var viewConfig = {
  validAttributes: mergeFast(ReactNativeViewAttributes.UIView, {
    isHighlighted: true,
    numberOfLines: true,
    ellipsizeMode: true,
    allowFontScaling: true,
    selectable: true,
    selectionColor: true,
    adjustsFontSizeToFit: true,
    minimumFontScale: true,
    textBreakStrategy: true,
    isOnLayer: true
  }),
  uiViewClassName: 'RCTText'
};

var Text = React.createClass({
  displayName: 'Text',

  propTypes: {
    ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),

    numberOfLines: PropTypes.number,

    textBreakStrategy: PropTypes.oneOf(['simple', 'highQuality', 'balanced']),

    onLayout: PropTypes.func,

    onPress: PropTypes.func,

    onLongPress: PropTypes.func,

    pressRetentionOffset: EdgeInsetsPropType,

    selectable: PropTypes.bool,

    selectionColor: ColorPropType,

    suppressHighlighting: PropTypes.bool,
    style: stylePropType,

    testID: PropTypes.string,

    allowFontScaling: PropTypes.bool,

    accessible: PropTypes.bool,

    adjustsFontSizeToFit: PropTypes.bool,

    minimumFontScale: PropTypes.number,

    isOnLayer: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      accessible: true,
      allowFontScaling: true,
      ellipsizeMode: 'tail',
      isOnLayer: false
    };
  },

  getInitialState: function getInitialState() {
    return mergeFast(Touchable.Mixin.touchableGetInitialState(), {
      isHighlighted: false
    });
  },
  mixins: [NativeMethodsMixin],
  viewConfig: viewConfig,
  getChildContext: function getChildContext() {
    return { isInAParentText: true };
  },

  childContextTypes: {
    isInAParentText: PropTypes.bool
  },
  contextTypes: {
    isInAParentText: PropTypes.bool,
    isOnLayer: PropTypes.bool
  },

  _handlers: null,
  _hasPressHandler: function _hasPressHandler() {
    return !!this.props.onPress || !!this.props.onLongPress;
  },

  touchableHandleActivePressIn: null,
  touchableHandleActivePressOut: null,
  touchableHandlePress: null,
  touchableHandleLongPress: null,
  touchableGetPressRectOffset: null,
  render: function render() {
    var _this = this;

    var newProps = this.props;
    if (this.props.onStartShouldSetResponder || this._hasPressHandler()) {
      if (!this._handlers) {
        this._handlers = {
          onStartShouldSetResponder: function onStartShouldSetResponder() {
            var shouldSetFromProps = _this.props.onStartShouldSetResponder && _this.props.onStartShouldSetResponder();
            var setResponder = shouldSetFromProps || _this._hasPressHandler();
            if (setResponder && !_this.touchableHandleActivePressIn) {
              for (var key in Touchable.Mixin) {
                if (typeof Touchable.Mixin[key] === 'function') {
                  _this[key] = Touchable.Mixin[key].bind(_this);
                }
              }
              _this.touchableHandleActivePressIn = function () {
                if (_this.props.suppressHighlighting || !_this._hasPressHandler()) {
                  return;
                }
                _this.setState({
                  isHighlighted: true
                });
              };

              _this.touchableHandleActivePressOut = function () {
                if (_this.props.suppressHighlighting || !_this._hasPressHandler()) {
                  return;
                }
                _this.setState({
                  isHighlighted: false
                });
              };

              _this.touchableHandlePress = function (e) {
                _this.props.onPress && _this.props.onPress(e);
              };

              _this.touchableHandleLongPress = function (e) {
                _this.props.onLongPress && _this.props.onLongPress(e);
              };

              _this.touchableGetPressRectOffset = function () {
                return this.props.pressRetentionOffset || PRESS_RECT_OFFSET;
              };
            }
            return setResponder;
          },
          onResponderGrant: function (e, dispatchID) {
            this.touchableHandleResponderGrant(e, dispatchID);
            this.props.onResponderGrant && this.props.onResponderGrant.apply(this, arguments);
          }.bind(this),
          onResponderMove: function (e) {
            this.touchableHandleResponderMove(e);
            this.props.onResponderMove && this.props.onResponderMove.apply(this, arguments);
          }.bind(this),
          onResponderRelease: function (e) {
            this.touchableHandleResponderRelease(e);
            this.props.onResponderRelease && this.props.onResponderRelease.apply(this, arguments);
          }.bind(this),
          onResponderTerminate: function (e) {
            this.touchableHandleResponderTerminate(e);
            this.props.onResponderTerminate && this.props.onResponderTerminate.apply(this, arguments);
          }.bind(this),
          onResponderTerminationRequest: function () {
            var allowTermination = this.touchableHandleResponderTerminationRequest();
            if (allowTermination && this.props.onResponderTerminationRequest) {
              allowTermination = this.props.onResponderTerminationRequest.apply(this, arguments);
            }
            return allowTermination;
          }.bind(this)
        };
      }
      newProps = babelHelpers.extends({}, this.props, this._handlers, {
        isHighlighted: this.state.isHighlighted
      });
    }
    if (newProps.selectionColor != null) {
      newProps = babelHelpers.extends({}, newProps, {
        selectionColor: processColor(newProps.selectionColor)
      });
    }
    if (Touchable.TOUCH_TARGET_DEBUG && newProps.onPress) {
      newProps = babelHelpers.extends({}, newProps, {
        style: [this.props.style, { color: 'magenta' }]
      });
    }
    if (newProps.style && newProps.style['renderGroup'] === undefined && newProps.style.transform) {
      newProps.style.renderGroup = true;
    }
    if (this.context.isInAParentText) {
      return React.createElement(RCTVirtualText, babelHelpers.extends({}, newProps, { isOnLayer: !!this.context.isOnLayer, __source: {
          fileName: _jsxFileName,
          lineNumber: 350
        }
      }));
    } else {
      return React.createElement(RCTText, babelHelpers.extends({}, newProps, { isOnLayer: !!this.context.isOnLayer, __source: {
          fileName: _jsxFileName,
          lineNumber: 352
        }
      }));
    }
  }
});

var PRESS_RECT_OFFSET = { top: 20, left: 20, right: 20, bottom: 30 };

var RCTText = createReactNativeComponentClass(viewConfig);
var RCTVirtualText = RCTText;

if (Platform.OS === 'android') {
  RCTVirtualText = createReactNativeComponentClass({
    validAttributes: mergeFast(ReactNativeViewAttributes.UIView, {
      isHighlighted: true
    }),
    uiViewClassName: 'RCTVirtualText'
  });
}

module.exports = Text;