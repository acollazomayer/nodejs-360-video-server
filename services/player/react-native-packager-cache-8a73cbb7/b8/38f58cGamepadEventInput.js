
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof (typeof Symbol === "function" ? Symbol.iterator : "@@iterator") === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== (typeof Symbol === "function" ? Symbol.prototype : "@@prototype") ? "symbol" : typeof obj;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _EventInput2 = require('./EventInput');

var _EventInput3 = _interopRequireDefault(_EventInput2);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var getGamepads = (navigator.getGamepads ? navigator.getGamepads : navigator.webkitGetGamepads ? navigator.webkitGetGamepads : function () {
  return [];
}).bind(navigator);

var LONG_PRESS_TIME = 500;
var AXIS_EPSILON = 0.001;

var GamepadEventInput = function (_EventInput) {
  _inherits(GamepadEventInput, _EventInput);

  function GamepadEventInput() {
    _classCallCheck(this, GamepadEventInput);

    var _this = _possibleConstructorReturn(this, (GamepadEventInput.__proto__ || Object.getPrototypeOf(GamepadEventInput)).call(this, 'GamepadInputEvent'));

    _this._previousState = [];
    return _this;
  }

  _createClass(GamepadEventInput, [{
    key: 'getEvents',
    value: function getEvents() {
      var now = Date.now();
      var gamepads = getGamepads();
      var events = [];
      for (var id = 0; id < gamepads.length; id++) {
        if (gamepads[id]) {
          if (!this._previousState[id]) {
            this._previousState[id] = {
              buttons: [],
              axes: []
            };
          }
          var state = this._previousState[id];
          var _buttons = gamepads[id].buttons;
          for (var btn = 0; btn < _buttons.length; btn++) {
            var buttonState = state.buttons[btn];
            if (!buttonState) {
              buttonState = {
                pressed: false,
                startTime: -1
              };
              state.buttons[btn] = buttonState;
            }
            var _pressed = _typeof(_buttons[btn]) === 'object' ? _buttons[btn].pressed : _buttons[btn] === 1.0;
            if (buttonState.pressed !== _pressed) {
              if (_pressed) {
                buttonState.pressed = true;
                buttonState.startTime = now;
                events.push({
                  type: this.getEventType(),
                  eventType: 'keydown',
                  button: btn,
                  gamepad: id,
                  repeat: false
                });
              } else {
                buttonState.pressed = false;
                events.push({
                  type: this.getEventType(),
                  eventType: 'keyup',
                  button: btn,
                  gamepad: id
                });
              }
            } else if (_pressed && now - buttonState.startTime > LONG_PRESS_TIME) {
              events.push({
                type: this.getEventType(),
                eventType: 'keydown',
                button: btn,
                gamepad: id,
                repeat: true
              });
            }
          }

          var _axes = gamepads[id].axes;
          if (_axes) {
            for (var _axis = 0; _axis < _axes.length; _axis++) {
              var oldValue = state.axes[_axis];
              var newValue = _axes[_axis];
              if (typeof oldValue !== 'number') {
                state.axes[_axis] = newValue;
                continue;
              }
              if (Math.abs(newValue - oldValue) > AXIS_EPSILON) {
                events.push({
                  type: this.getEventType(),
                  eventType: 'axismove',
                  axis: _axis,
                  gamepad: id,
                  value: newValue
                });
              }
              state.axes[_axis] = newValue;
            }
          }
        } else {
          if (this._previousState[id]) {
            delete this._previousState[id];
          }
        }
      }
      return events;
    }
  }]);

  return GamepadEventInput;
}(_EventInput3.default);

exports.default = GamepadEventInput;