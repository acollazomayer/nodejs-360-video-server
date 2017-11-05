
'use strict';

var EventEmitter = require('EventEmitter');
var NavigationEvent = require('NavigationEvent');

var NavigationEventEmitter = function (_EventEmitter) {
  babelHelpers.inherits(NavigationEventEmitter, _EventEmitter);

  function NavigationEventEmitter(target) {
    babelHelpers.classCallCheck(this, NavigationEventEmitter);

    var _this = babelHelpers.possibleConstructorReturn(this, (NavigationEventEmitter.__proto__ || Object.getPrototypeOf(NavigationEventEmitter)).call(this));

    _this._emitting = false;
    _this._emitQueue = [];
    _this._target = target;
    return _this;
  }

  babelHelpers.createClass(NavigationEventEmitter, [{
    key: 'emit',
    value: function emit(eventType, data, didEmitCallback, extraInfo) {
      if (this._emitting) {
        var args = Array.prototype.slice.call(arguments);
        this._emitQueue.push(args);
        return;
      }

      this._emitting = true;

      var event = NavigationEvent.pool(eventType, this._target, data);

      if (extraInfo) {
        if (extraInfo.target) {
          event.target = extraInfo.target;
        }

        if (extraInfo.eventPhase) {
          event.eventPhase = extraInfo.eventPhase;
        }

        if (extraInfo.defaultPrevented) {
          event.preventDefault();
        }

        if (extraInfo.propagationStopped) {
          event.stopPropagation();
        }
      }

      babelHelpers.get(NavigationEventEmitter.prototype.__proto__ || Object.getPrototypeOf(NavigationEventEmitter.prototype), 'emit', this).call(this, String(eventType), event);

      if (typeof didEmitCallback === 'function') {
        didEmitCallback.call(this._target, event);
      }
      event.dispose();

      this._emitting = false;

      while (this._emitQueue.length) {
        var args = this._emitQueue.shift();
        this.emit.apply(this, args);
      }
    }
  }]);
  return NavigationEventEmitter;
}(EventEmitter);

module.exports = NavigationEventEmitter;