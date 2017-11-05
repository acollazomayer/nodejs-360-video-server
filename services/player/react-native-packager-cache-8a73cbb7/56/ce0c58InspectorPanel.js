
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/InspectorPanel.js';
var ElementProperties = require('ElementProperties');
var NetworkOverlay = require('NetworkOverlay');
var PerformanceOverlay = require('PerformanceOverlay');
var React = require('React');
var ScrollView = require('ScrollView');
var StyleSheet = require('StyleSheet');
var Text = require('Text');
var TouchableHighlight = require('TouchableHighlight');
var View = require('View');

var PropTypes = React.PropTypes;

var InspectorPanel = function (_React$Component) {
  babelHelpers.inherits(InspectorPanel, _React$Component);

  function InspectorPanel() {
    babelHelpers.classCallCheck(this, InspectorPanel);
    return babelHelpers.possibleConstructorReturn(this, (InspectorPanel.__proto__ || Object.getPrototypeOf(InspectorPanel)).apply(this, arguments));
  }

  babelHelpers.createClass(InspectorPanel, [{
    key: 'renderWaiting',
    value: function renderWaiting() {
      if (this.props.inspecting) {
        return React.createElement(
          Text,
          { style: styles.waitingText, __source: {
              fileName: _jsxFileName,
              lineNumber: 30
            }
          },
          'Tap something to inspect it'
        );
      }
      return React.createElement(
        Text,
        { style: styles.waitingText, __source: {
            fileName: _jsxFileName,
            lineNumber: 35
          }
        },
        'Nothing is inspected'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var contents = void 0;
      if (this.props.inspected) {
        contents = React.createElement(
          ScrollView,
          { style: styles.properties, __source: {
              fileName: _jsxFileName,
              lineNumber: 42
            }
          },
          React.createElement(ElementProperties, {
            style: this.props.inspected.style,
            frame: this.props.inspected.frame,
            source: this.props.inspected.source,
            hierarchy: this.props.hierarchy,
            selection: this.props.selection,
            setSelection: this.props.setSelection,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 43
            }
          })
        );
      } else if (this.props.perfing) {
        contents = React.createElement(PerformanceOverlay, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          }
        });
      } else if (this.props.networking) {
        contents = React.createElement(NetworkOverlay, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 59
          }
        });
      } else {
        contents = React.createElement(
          View,
          { style: styles.waiting, __source: {
              fileName: _jsxFileName,
              lineNumber: 63
            }
          },
          this.renderWaiting()
        );
      }
      return React.createElement(
        View,
        { style: styles.container, __source: {
            fileName: _jsxFileName,
            lineNumber: 69
          }
        },
        !this.props.devtoolsIsOpen && contents,
        React.createElement(
          View,
          { style: styles.buttonRow, __source: {
              fileName: _jsxFileName,
              lineNumber: 71
            }
          },
          React.createElement(Button, {
            title: 'Inspect',
            pressed: this.props.inspecting,
            onClick: this.props.setInspecting,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 72
            }
          }),
          React.createElement(Button, { title: 'Perf',
            pressed: this.props.perfing,
            onClick: this.props.setPerfing,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 77
            }
          }),
          React.createElement(Button, { title: 'Network',
            pressed: this.props.networking,
            onClick: this.props.setNetworking,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 81
            }
          }),
          React.createElement(Button, { title: 'Touchables',
            pressed: this.props.touchTargetting,
            onClick: this.props.setTouchTargetting,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 85
            }
          })
        )
      );
    }
  }]);
  return InspectorPanel;
}(React.Component);

InspectorPanel.propTypes = {
  devtoolsIsOpen: PropTypes.bool,
  inspecting: PropTypes.bool,
  setInspecting: PropTypes.func,
  inspected: PropTypes.object,
  perfing: PropTypes.bool,
  setPerfing: PropTypes.func,
  touchTargetting: PropTypes.bool,
  setTouchTargetting: PropTypes.func,
  networking: PropTypes.bool,
  setNetworking: PropTypes.func
};

var Button = function (_React$Component2) {
  babelHelpers.inherits(Button, _React$Component2);

  function Button() {
    babelHelpers.classCallCheck(this, Button);
    return babelHelpers.possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
  }

  babelHelpers.createClass(Button, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        TouchableHighlight,
        { onPress: function onPress() {
            return _this3.props.onClick(!_this3.props.pressed);
          }, style: [styles.button, this.props.pressed && styles.buttonPressed], __source: {
            fileName: _jsxFileName,
            lineNumber: 111
          }
        },
        React.createElement(
          Text,
          { style: styles.buttonText, __source: {
              fileName: _jsxFileName,
              lineNumber: 115
            }
          },
          this.props.title
        )
      );
    }
  }]);
  return Button;
}(React.Component);

var styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row'
  },
  button: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    margin: 2,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)'
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    margin: 5
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  properties: {
    height: 200
  },
  waiting: {
    height: 100
  },
  waitingText: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    color: 'white'
  }
});

module.exports = InspectorPanel;