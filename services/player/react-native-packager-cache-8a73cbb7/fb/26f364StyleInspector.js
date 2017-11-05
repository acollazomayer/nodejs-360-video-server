
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/StyleInspector.js';
var React = require('React');
var StyleSheet = require('StyleSheet');
var Text = require('Text');
var View = require('View');

var StyleInspector = function (_React$Component) {
  babelHelpers.inherits(StyleInspector, _React$Component);

  function StyleInspector() {
    babelHelpers.classCallCheck(this, StyleInspector);
    return babelHelpers.possibleConstructorReturn(this, (StyleInspector.__proto__ || Object.getPrototypeOf(StyleInspector)).apply(this, arguments));
  }

  babelHelpers.createClass(StyleInspector, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.style) {
        return React.createElement(
          Text,
          { style: styles.noStyle, __source: {
              fileName: _jsxFileName,
              lineNumber: 22
            }
          },
          'No style'
        );
      }
      var names = Object.keys(this.props.style);
      return React.createElement(
        View,
        { style: styles.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        },
        React.createElement(
          View,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 27
            }
          },
          names.map(function (name) {
            return React.createElement(
              Text,
              { key: name, style: styles.attr, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 28
                }
              },
              name,
              ':'
            );
          })
        ),
        React.createElement(
          View,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 31
            }
          },
          names.map(function (name) {
            var value = typeof _this2.props.style[name] === 'object' ? JSON.stringify(_this2.props.style[name]) : _this2.props.style[name];
            return React.createElement(
              Text,
              { key: name, style: styles.value, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 34
                }
              },
              value
            );
          })
        )
      );
    }
  }]);
  return StyleInspector;
}(React.Component);

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  attr: {
    fontSize: 10,
    color: '#ccc'
  },
  value: {
    fontSize: 10,
    color: 'white',
    marginLeft: 10
  },
  noStyle: {
    color: 'white',
    fontSize: 10
  }
});

module.exports = StyleInspector;