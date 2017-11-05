
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

var MOUSE_EVENTS = ['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'mouseenter', 'mouseleave', 'wheel'];

function getDocumentBounds() {
  return {
    top: 0,
    left: 0,
    width: document.body ? document.body.clientWidth : 0,
    height: document.body ? document.body.clientHeight : 0
  };
}

var MouseEventInput = function (_EventInput) {
  _inherits(MouseEventInput, _EventInput);

  function MouseEventInput(target) {
    _classCallCheck(this, MouseEventInput);

    var _this = _possibleConstructorReturn(this, (MouseEventInput.__proto__ || Object.getPrototypeOf(MouseEventInput)).call(this, 'MouseInputEvent'));

    _this._batchedEvents = [];
    _this._target = target || document;
    _this._onMouseEvent = _this._onMouseEvent.bind(_this);

    _this._addEventListeners();
    return _this;
  }

  _createClass(MouseEventInput, [{
    key: 'getTarget',
    value: function getTarget() {
      return this._target;
    }
  }, {
    key: 'setTarget',
    value: function setTarget(target) {
      if (this._target) {
        this._removeEventListeners();
      }
      this._target = target;
      this._addEventListeners();
    }
  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = MOUSE_EVENTS[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var type = _step.value;

          this._target.addEventListener(type, this._onMouseEvent, true);
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
        for (var _iterator2 = MOUSE_EVENTS[typeof Symbol === "function" ? Symbol.iterator : "@@iterator"](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var type = _step2.value;

          this._target.removeEventListener(type, this._onMouseEvent, true);
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
    key: '_onMouseEvent',
    value: function _onMouseEvent(e) {
      var target = e.currentTarget;
      if (target && target === this._target) {
        var viewport = typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : getDocumentBounds();
        var _viewportX = (e.clientX - viewport.left) / viewport.width * 2 - 1;
        var _viewportY = -((e.clientY - viewport.top) / viewport.height) * 2 + 1;
        this._batchedEvents.push({
          type: this.getEventType(),
          eventType: e.type,
          altKey: e.altKey,
          button: e.button,
          buttons: e.buttons,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          shiftKey: e.shiftKey,
          viewportX: _viewportX,
          viewportY: _viewportY
        });
      }
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

  return MouseEventInput;
}(_EventInput3.default);

exports.default = MouseEventInput;