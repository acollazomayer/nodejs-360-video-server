Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var IDLE_CALLBACK_THRESHOLD = 1;
var Timing = function (_Module) {
  babelHelpers.inherits(Timing, _Module);

  function Timing(rnctx) {
    babelHelpers.classCallCheck(this, Timing);

    var _this = babelHelpers.possibleConstructorReturn(this, (Timing.__proto__ || Object.getPrototypeOf(Timing)).call(this, 'Timing'));

    _this._timers = {};
    _this._rnctx = rnctx;
    _this._sendIdleEvents = false;

    _this._targetFrameDuration = 1000.0 / (rnctx.isLowLatency ? 90.0 : 60.0);
    return _this;
  }

  babelHelpers.createClass(Timing, [{
    key: 'createTimer',
    value: function createTimer(callbackID, duration, jsSchedulingTime, repeats) {
      var currentTimeMillis = Date.now();
      var currentDateNowTimeMillis = jsSchedulingTime + 1000 / 60;
      var adjustedDuration = Math.max(0.0, jsSchedulingTime - currentDateNowTimeMillis + duration);
      var initialTargetTime = currentTimeMillis + adjustedDuration;
      this._timers[String(callbackID)] = {
        callbackID: callbackID,
        duration: duration,
        jsSchedulingTime: initialTargetTime,
        repeats: repeats
      };
    }
  }, {
    key: 'deleteTimer',
    value: function deleteTimer(callbackID) {
      delete this._timers[String(callbackID)];
    }
  }, {
    key: 'setSendIdleEvents',
    value: function setSendIdleEvents(sendIdle) {
      this._sendIdleEvents = sendIdle;
    }
  }, {
    key: 'frame',
    value: function frame(frameStart) {
      var toRemove = [];
      var timers = [];
      var time = Date.now();
      for (var timer in this._timers) {
        var t = this._timers[timer];
        if (t.jsSchedulingTime <= time) {
          timers.push(this._timers[timer].callbackID);
          if (t.repeats) {
            t.jsSchedulingTime += t.duration;
          } else {
            toRemove.push(timer);
          }
        }
      }

      if (timers.length) {
        this._rnctx.callFunction('JSTimersExecution', 'callTimers', [timers]);
      }

      for (var _iterator = toRemove, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _timer = _ref;

        delete this._timers[_timer];
      }
    }
  }, {
    key: 'idle',
    value: function idle(frameStart) {
      if (!this._sendIdleEvents) {
        return;
      }
      var now = window.performance ? performance.now() : Date.now();
      var frameElapsed = now - frameStart;
      if (this._targetFrameDuration - frameElapsed >= IDLE_CALLBACK_THRESHOLD) {
        this._rnctx.callFunction('JSTimersExecution', 'callIdleCallbacks', [Date.now() - frameElapsed]);
      }
    }
  }]);
  return Timing;
}(_Module3.default);

exports.default = Timing;