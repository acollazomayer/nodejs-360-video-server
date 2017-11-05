
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var KEYBOARD_EVENTS = ['keydown', 'keypress', 'keyup'];

var KeyboardEventInput = function (_EventInput) {
  _inherits(KeyboardEventInput, _EventInput);

  function KeyboardEventInput() {
    _classCallCheck(this, KeyboardEventInput);

    var _this = _possibleConstructorReturn(this, (KeyboardEventInput.__proto__ || Object.getPrototypeOf(KeyboardEventInput)).call(this, 'KeyboardInputEvent'));

    _this._batchedEvents = [];
    _this._onKeyboardEvent = _this._onKeyboardEvent.bind(_this);

    _this._addEventListeners();
    return _this;
  }

  _createClass(KeyboardEventInput, [{
    key: '_addEventListeners',
    value: function _addEventListeners() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = KEYBOARD_EVENTS[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var type = _step.value;

          window.addEventListener(type, this._onKeyboardEvent, true);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_removeEventListeners',
    value: function _removeEventListeners() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = KEYBOARD_EVENTS[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var type = _step2.value;

          window.removeEventListener(type, this._onKeyboardEvent, true);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: '_onKeyboardEvent',
    value: function _onKeyboardEvent(e) {
      this._batchedEvents.push({
        type: this.getEventType(),
        eventType: e.type,
        altKey: e.altKey,
        code: e.code,
        ctrlKey: e.ctrlKey,
        key: e.key,
        keyCode: e.keyCode,
        metaKey: e.metaKey,
        repeat: e.repeat,
        shiftKey: e.shiftKey
      });
    }
  }, {
    key: 'getEvents',
    value: function getEvents() {
      var events = this._batchedEvents;
      if (events.length < 1) {
        return null;
      }
      this._batchedEvents = [];
      return events;
    }
  }]);

  return KeyboardEventInput;
}(_EventInput3.default);

exports.default = KeyboardEventInput;