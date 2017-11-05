
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/InspectorOverlay.js';
var Dimensions = require('Dimensions');
var InspectorUtils = require('InspectorUtils');
var React = require('React');
var StyleSheet = require('StyleSheet');
var UIManager = require('UIManager');
var View = require('View');
var ElementBox = require('ElementBox');

var PropTypes = React.PropTypes;

var InspectorOverlay = function (_React$Component) {
  babelHelpers.inherits(InspectorOverlay, _React$Component);

  function InspectorOverlay() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, InspectorOverlay);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = InspectorOverlay.__proto__ || Object.getPrototypeOf(InspectorOverlay)).call.apply(_ref, [this].concat(args))), _this), _this.findViewForTouchEvent = function (e) {
      var _e$nativeEvent$touche = e.nativeEvent.touches[0],
          locationX = _e$nativeEvent$touche.locationX,
          locationY = _e$nativeEvent$touche.locationY;

      UIManager.findSubviewIn(_this.props.inspectedViewTag, [locationX, locationY], function (nativeViewTag, left, top, width, height) {
        var instance = InspectorUtils.findInstanceByNativeTag(nativeViewTag);
        if (!instance) {
          return;
        }
        _this.props.onTouchInstance(instance, { left: left, top: top, width: width, height: height }, locationY);
      });
    }, _this.shouldSetResponser = function (e) {
      _this.findViewForTouchEvent(e);
      return true;
    }, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(InspectorOverlay, [{
    key: 'render',
    value: function render() {
      var content = null;
      if (this.props.inspected) {
        content = React.createElement(ElementBox, { frame: this.props.inspected.frame, style: this.props.inspected.style, __source: {
            fileName: _jsxFileName,
            lineNumber: 70
          }
        });
      }

      return React.createElement(
        View,
        {
          onStartShouldSetResponder: this.shouldSetResponser,
          onResponderMove: this.findViewForTouchEvent,
          style: [styles.inspector, { height: Dimensions.get('window').height }], __source: {
            fileName: _jsxFileName,
            lineNumber: 74
          }
        },
        content
      );
    }
  }]);
  return InspectorOverlay;
}(React.Component);

InspectorOverlay.propTypes = {
  inspected: PropTypes.shape({
    frame: PropTypes.object,
    style: PropTypes.any
  }),
  inspectedViewTag: PropTypes.number,
  onTouchInstance: PropTypes.func.isRequired
};


var styles = StyleSheet.create({
  inspector: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0
  }
});

module.exports = InspectorOverlay;