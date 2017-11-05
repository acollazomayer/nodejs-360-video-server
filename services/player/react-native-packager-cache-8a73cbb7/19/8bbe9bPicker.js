

'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Components/Picker/Picker.js',
    _class,
    _temp;

var ColorPropType = require('ColorPropType');
var PickerIOS = require('PickerIOS');
var PickerAndroid = require('PickerAndroid');
var Platform = require('Platform');
var React = require('React');
var StyleSheetPropType = require('StyleSheetPropType');
var TextStylePropTypes = require('TextStylePropTypes');
var UnimplementedView = require('UnimplementedView');
var View = require('View');
var ViewStylePropTypes = require('ViewStylePropTypes');

var itemStylePropType = StyleSheetPropType(TextStylePropTypes);

var pickerStyleType = StyleSheetPropType(babelHelpers.extends({}, ViewStylePropTypes, {
  color: ColorPropType
}));

var MODE_DIALOG = 'dialog';
var MODE_DROPDOWN = 'dropdown';

var Picker = function (_React$Component) {
  babelHelpers.inherits(Picker, _React$Component);

  function Picker() {
    babelHelpers.classCallCheck(this, Picker);
    return babelHelpers.possibleConstructorReturn(this, (Picker.__proto__ || Object.getPrototypeOf(Picker)).apply(this, arguments));
  }

  babelHelpers.createClass(Picker, [{
    key: 'render',
    value: function render() {
      if (Platform.OS === 'ios') {
        return React.createElement(
          PickerIOS,
          babelHelpers.extends({}, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 119
            }
          }),
          this.props.children
        );
      } else if (Platform.OS === 'android') {
        return React.createElement(
          PickerAndroid,
          babelHelpers.extends({}, this.props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 122
            }
          }),
          this.props.children
        );
      } else {
        return React.createElement(UnimplementedView, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 124
          }
        });
      }
    }
  }]);
  return Picker;
}(React.Component);

Picker.MODE_DIALOG = MODE_DIALOG;
Picker.MODE_DROPDOWN = MODE_DROPDOWN;
Picker.defaultProps = {
  mode: MODE_DIALOG
};
Picker.propTypes = babelHelpers.extends({}, View.propTypes, {
  style: pickerStyleType,

  selectedValue: React.PropTypes.any,

  onValueChange: React.PropTypes.func,

  enabled: React.PropTypes.bool,

  mode: React.PropTypes.oneOf(['dialog', 'dropdown']),

  itemStyle: itemStylePropType,

  prompt: React.PropTypes.string,

  testID: React.PropTypes.string
});

Picker.Item = (_temp = _class = function (_React$Component2) {
  babelHelpers.inherits(_class, _React$Component2);

  function _class() {
    babelHelpers.classCallCheck(this, _class);
    return babelHelpers.possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
  }

  babelHelpers.createClass(_class, [{
    key: 'render',
    value: function render() {
      throw null;
    }
  }]);
  return _class;
}(React.Component), _class.propTypes = {
  label: React.PropTypes.string.isRequired,

  value: React.PropTypes.any,

  color: ColorPropType,

  testID: React.PropTypes.string
}, _temp);

module.exports = Picker;