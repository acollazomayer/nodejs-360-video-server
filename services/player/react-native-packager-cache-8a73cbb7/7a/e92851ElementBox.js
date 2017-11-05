
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/ElementBox.js';
var React = require('React');
var View = require('View');
var StyleSheet = require('StyleSheet');
var BorderBox = require('BorderBox');
var resolveBoxStyle = require('resolveBoxStyle');

var flattenStyle = require('flattenStyle');

var ElementBox = function (_React$Component) {
  babelHelpers.inherits(ElementBox, _React$Component);

  function ElementBox() {
    babelHelpers.classCallCheck(this, ElementBox);
    return babelHelpers.possibleConstructorReturn(this, (ElementBox.__proto__ || Object.getPrototypeOf(ElementBox)).apply(this, arguments));
  }

  babelHelpers.createClass(ElementBox, [{
    key: 'render',
    value: function render() {
      var style = flattenStyle(this.props.style) || {};
      var margin = resolveBoxStyle('margin', style);
      var padding = resolveBoxStyle('padding', style);
      var frameStyle = this.props.frame;
      if (margin) {
        frameStyle = {
          top: frameStyle.top - margin.top,
          left: frameStyle.left - margin.left,
          height: frameStyle.height + margin.top + margin.bottom,
          width: frameStyle.width + margin.left + margin.right
        };
      }
      var contentStyle = {
        width: this.props.frame.width,
        height: this.props.frame.height
      };
      if (padding) {
        contentStyle = {
          width: contentStyle.width - padding.left - padding.right,
          height: contentStyle.height - padding.top - padding.bottom
        };
      }
      return React.createElement(
        View,
        { style: [styles.frame, frameStyle], pointerEvents: 'none', __source: {
            fileName: _jsxFileName,
            lineNumber: 47
          }
        },
        React.createElement(
          BorderBox,
          { box: margin, style: styles.margin, __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          },
          React.createElement(
            BorderBox,
            { box: padding, style: styles.padding, __source: {
                fileName: _jsxFileName,
                lineNumber: 49
              }
            },
            React.createElement(View, { style: [styles.content, contentStyle], __source: {
                fileName: _jsxFileName,
                lineNumber: 50
              }
            })
          )
        )
      );
    }
  }]);
  return ElementBox;
}(React.Component);

var styles = StyleSheet.create({
  frame: {
    position: 'absolute'
  },
  content: {
    backgroundColor: 'rgba(200, 230, 255, 0.8)'
  },
  padding: {
    borderColor: 'rgba(77, 255, 0, 0.3)'
  },
  margin: {
    borderColor: 'rgba(255, 132, 0, 0.3)'
  }
});

module.exports = ElementBox;