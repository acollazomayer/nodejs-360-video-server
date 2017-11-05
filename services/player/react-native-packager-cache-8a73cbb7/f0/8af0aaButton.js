
'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Button.js';
var ColorPropType = require('ColorPropType');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var Text = require('Text');
var TouchableNativeFeedback = require('TouchableNativeFeedback');
var TouchableOpacity = require('TouchableOpacity');
var View = require('View');

var invariant = require('fbjs/lib/invariant');

var Button = function (_React$Component) {
  babelHelpers.inherits(Button, _React$Component);

  function Button() {
    babelHelpers.classCallCheck(this, Button);
    return babelHelpers.possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
  }

  babelHelpers.createClass(Button, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          accessibilityLabel = _props.accessibilityLabel,
          color = _props.color,
          onPress = _props.onPress,
          title = _props.title,
          disabled = _props.disabled,
          testID = _props.testID;

      var buttonStyles = [styles.button];
      var textStyles = [styles.text];
      var Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
      if (color && Platform.OS === 'ios') {
        textStyles.push({ color: color });
      } else if (color) {
        buttonStyles.push({ backgroundColor: color });
      }
      if (disabled) {
        buttonStyles.push(styles.buttonDisabled);
        textStyles.push(styles.textDisabled);
      }
      invariant(typeof title === 'string', 'The title prop of a Button must be a string');
      var formattedTitle = Platform.OS === 'android' ? title.toUpperCase() : title;
      return React.createElement(
        Touchable,
        {
          accessibilityComponentType: 'button',
          accessibilityLabel: accessibilityLabel,
          accessibilityTraits: ['button'],
          testID: testID,
          disabled: disabled,
          onPress: onPress, __source: {
            fileName: _jsxFileName,
            lineNumber: 115
          }
        },
        React.createElement(
          View,
          { style: buttonStyles, __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            }
          },
          React.createElement(
            Text,
            { style: textStyles, __source: {
                fileName: _jsxFileName,
                lineNumber: 123
              }
            },
            formattedTitle
          )
        )
      );
    }
  }]);
  return Button;
}(React.Component);

Button.propTypes = {
  title: React.PropTypes.string.isRequired,

  accessibilityLabel: React.PropTypes.string,

  color: ColorPropType,

  disabled: React.PropTypes.bool,

  onPress: React.PropTypes.func.isRequired,

  testID: React.PropTypes.string
};

var defaultBlue = '#2196F3';
if (Platform.OS === 'ios') {
  defaultBlue = '#0C42FD';
}

var styles = StyleSheet.create({
  button: Platform.select({
    ios: {},
    android: {
      elevation: 4,
      backgroundColor: defaultBlue,
      borderRadius: 2
    }
  }),
  text: Platform.select({
    ios: {
      color: defaultBlue,
      textAlign: 'center',
      padding: 8,
      fontSize: 18
    },
    android: {
      textAlign: 'center',
      color: 'white',
      padding: 8,
      fontWeight: '500'
    }
  }),
  buttonDisabled: Platform.select({
    ios: {},
    android: {
      elevation: 0,
      backgroundColor: '#dfdfdf'
    }
  }),
  textDisabled: Platform.select({
    ios: {
      color: '#cdcdcd'
    },
    android: {
      color: '#a1a1a1'
    }
  })
});

module.exports = Button;