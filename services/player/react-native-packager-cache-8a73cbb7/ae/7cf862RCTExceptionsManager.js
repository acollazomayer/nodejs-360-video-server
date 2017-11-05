Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var RCTExceptionsManager = function (_Module) {
  babelHelpers.inherits(RCTExceptionsManager, _Module);

  function RCTExceptionsManager() {
    babelHelpers.classCallCheck(this, RCTExceptionsManager);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTExceptionsManager.__proto__ || Object.getPrototypeOf(RCTExceptionsManager)).call(this, 'RCTExceptionsManager'));

    _this.hadFatal = undefined;
    return _this;
  }

  babelHelpers.createClass(RCTExceptionsManager, [{
    key: 'displayStackAndMessage',
    value: function displayStackAndMessage(stack, message) {
      var output = '\n';
      if (message.indexOf('has not been registered') === -1 || message.indexOf('AppRegistry.registerComponent') === -1) {
        output += '-----\n';
        for (var i = 0; i < stack.length; i++) {
          var _file = stack[i].file || '[unknown]';
          var _methodName = stack[i].methodName || '[unknown]';
          var _lineNumber = stack[i].lineNumber || 0;
          var _column = stack[i].column || 0;
          output += '> ' + _methodName + '@' + _file + ' ' + _lineNumber + ':' + _column + '\n';
        }
        output += '-----\n';
      }
      output += message || '';
      console.error(output);
    }
  }, {
    key: 'reportSoftException',
    value: function reportSoftException(message, stack, exceptionId) {
      if (this.hadFatal) {
        return;
      }
      var reverseStack = stack.slice();
      reverseStack.reverse();
      this.displayStackAndMessage(reverseStack, message);
    }
  }, {
    key: 'reportFatalException',
    value: function reportFatalException(message, stack, exceptionId) {
      if (this.hadFatal) {
        return;
      }
      var reverseStack = stack.slice();
      reverseStack.reverse();
      this.displayStackAndMessage(reverseStack, message);
      this.hadFatal = exceptionId;
    }
  }, {
    key: 'updateExceptionMessage',
    value: function updateExceptionMessage(message, stack, exceptionId) {
      if (this.hadFatal && this.hadFatal !== exceptionId) {
        return;
      }
      var reverseStack = stack.slice();
      reverseStack.reverse();

      for (var i = 0; i < reverseStack.length; i++) {
        if (reverseStack[i].file && reverseStack[i].file.indexOf(':') <= 2) {
          reverseStack[i].file = 'file:///' + reverseStack[i].file;
        }
      }
      this.displayStackAndMessage(reverseStack, message);
    }
  }, {
    key: 'reportUnhandledException',
    value: function reportUnhandledException(message, stack) {
      if (this.hadFatal) {
        return;
      }
      var reverseStack = stack.slice();
      reverseStack.reverse();
      this.displayStackAndMessage(reverseStack, message);
    }
  }]);
  return RCTExceptionsManager;
}(_Module3.default);

exports.default = RCTExceptionsManager;