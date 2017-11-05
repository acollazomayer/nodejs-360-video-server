
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/PerformanceOverlay.js';
var PerformanceLogger = require('PerformanceLogger');
var React = require('React');
var StyleSheet = require('StyleSheet');
var Text = require('Text');
var View = require('View');

var PerformanceOverlay = function (_React$Component) {
  babelHelpers.inherits(PerformanceOverlay, _React$Component);

  function PerformanceOverlay() {
    babelHelpers.classCallCheck(this, PerformanceOverlay);
    return babelHelpers.possibleConstructorReturn(this, (PerformanceOverlay.__proto__ || Object.getPrototypeOf(PerformanceOverlay)).apply(this, arguments));
  }

  babelHelpers.createClass(PerformanceOverlay, [{
    key: 'render',
    value: function render() {
      var perfLogs = PerformanceLogger.getTimespans();
      var items = [];

      for (var key in perfLogs) {
        if (perfLogs[key].totalTime) {
          var unit = key === 'BundleSize' ? 'b' : 'ms';
          items.push(React.createElement(
            View,
            { style: styles.row, key: key, __source: {
                fileName: _jsxFileName,
                lineNumber: 29
              }
            },
            React.createElement(
              Text,
              { style: [styles.text, styles.label], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 30
                }
              },
              key
            ),
            React.createElement(
              Text,
              { style: [styles.text, styles.totalTime], __source: {
                  fileName: _jsxFileName,
                  lineNumber: 31
                }
              },
              perfLogs[key].totalTime + unit
            )
          ));
        }
      }

      return React.createElement(
        View,
        { style: styles.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 40
          }
        },
        items
      );
    }
  }]);
  return PerformanceOverlay;
}(React.Component);

var styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 10
  },
  label: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  text: {
    color: 'white',
    fontSize: 12
  },
  totalTime: {
    paddingRight: 100
  }
});

module.exports = PerformanceOverlay;