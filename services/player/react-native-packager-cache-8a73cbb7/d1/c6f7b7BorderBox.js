
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/BorderBox.js';
var React = require('React');
var View = require('View');

var BorderBox = function (_React$Component) {
  babelHelpers.inherits(BorderBox, _React$Component);

  function BorderBox() {
    babelHelpers.classCallCheck(this, BorderBox);
    return babelHelpers.possibleConstructorReturn(this, (BorderBox.__proto__ || Object.getPrototypeOf(BorderBox)).apply(this, arguments));
  }

  babelHelpers.createClass(BorderBox, [{
    key: 'render',
    value: function render() {
      var box = this.props.box;
      if (!box) {
        return this.props.children;
      }
      var style = {
        borderTopWidth: box.top,
        borderBottomWidth: box.bottom,
        borderLeftWidth: box.left,
        borderRightWidth: box.right
      };
      return React.createElement(
        View,
        { style: [style, this.props.style], __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        this.props.children
      );
    }
  }]);
  return BorderBox;
}(React.Component);

module.exports = BorderBox;