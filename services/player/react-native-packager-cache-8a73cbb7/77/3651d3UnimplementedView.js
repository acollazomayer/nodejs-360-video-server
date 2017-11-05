

'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/UnimplementedViews/UnimplementedView.js';
var React = require('React');
var StyleSheet = require('StyleSheet');

var UnimplementedView = function (_React$Component) {
  babelHelpers.inherits(UnimplementedView, _React$Component);

  function UnimplementedView() {
    var _ref;

    var _temp, _this, _ret;

    babelHelpers.classCallCheck(this, UnimplementedView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = babelHelpers.possibleConstructorReturn(this, (_ref = UnimplementedView.__proto__ || Object.getPrototypeOf(UnimplementedView)).call.apply(_ref, [this].concat(args))), _this), _this.setNativeProps = function () {}, _temp), babelHelpers.possibleConstructorReturn(_this, _ret);
  }

  babelHelpers.createClass(UnimplementedView, [{
    key: 'render',
    value: function render() {
      var View = require('View');
      return React.createElement(
        View,
        { style: [styles.unimplementedView, this.props.style], __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        },
        this.props.children
      );
    }
  }]);
  return UnimplementedView;
}(React.Component);

var styles = StyleSheet.create({
  unimplementedView: {
    borderWidth: 1,
    borderColor: 'red',
    alignSelf: 'flex-start'
  }
});

module.exports = UnimplementedView;