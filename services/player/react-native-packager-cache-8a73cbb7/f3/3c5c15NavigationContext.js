
'use strict';

var NavigationEvent = require('NavigationEvent');
var NavigationEventEmitter = require('NavigationEventEmitter');
var NavigationTreeNode = require('NavigationTreeNode');

var Set = require('Set');

var emptyFunction = require('fbjs/lib/emptyFunction');
var invariant = require('fbjs/lib/invariant');

var AT_TARGET = NavigationEvent.AT_TARGET,
    BUBBLING_PHASE = NavigationEvent.BUBBLING_PHASE,
    CAPTURING_PHASE = NavigationEvent.CAPTURING_PHASE;

var LegacyEventTypes = new Set(['willfocus', 'didfocus']);

var NavigationContext = function () {
  function NavigationContext() {
    babelHelpers.classCallCheck(this, NavigationContext);

    this._bubbleEventEmitter = new NavigationEventEmitter(this);
    this._captureEventEmitter = new NavigationEventEmitter(this);
    this._currentRoute = null;

    this.__node = new NavigationTreeNode(this);

    this._emitCounter = 0;
    this._emitQueue = [];

    this.addListener('willfocus', this._onFocus);
    this.addListener('didfocus', this._onFocus);
  }

  babelHelpers.createClass(NavigationContext, [{
    key: 'appendChild',
    value: function appendChild(childContext) {
      this.__node.appendChild(childContext.__node);
    }
  }, {
    key: 'addListener',
    value: function addListener(eventType, listener, useCapture) {
      if (LegacyEventTypes.has(eventType)) {
        useCapture = false;
      }

      var emitter = useCapture ? this._captureEventEmitter : this._bubbleEventEmitter;

      if (emitter) {
        return emitter.addListener(eventType, listener, this);
      } else {
        return { remove: emptyFunction };
      }
    }
  }, {
    key: 'emit',
    value: function emit(eventType, data, didEmitCallback) {
      var _this = this;

      if (this._emitCounter > 0) {
        var args = Array.prototype.slice.call(arguments);
        this._emitQueue.push(args);
        return;
      }

      this._emitCounter++;

      if (LegacyEventTypes.has(eventType)) {
        this.__emit(eventType, data, null, {
          defaultPrevented: false,
          eventPhase: AT_TARGET,
          propagationStopped: true,
          target: this
        });
      } else {
        var targets = [this];
        var parentTarget = this.parent;
        while (parentTarget) {
          targets.unshift(parentTarget);
          parentTarget = parentTarget.parent;
        }

        var propagationStopped = false;
        var defaultPrevented = false;
        var callback = function callback(event) {
          propagationStopped = propagationStopped || event.isPropagationStopped();
          defaultPrevented = defaultPrevented || event.defaultPrevented;
        };

        targets.some(function (currentTarget) {
          if (propagationStopped) {
            return true;
          }

          var extraInfo = {
            defaultPrevented: defaultPrevented,
            eventPhase: CAPTURING_PHASE,
            propagationStopped: propagationStopped,
            target: _this
          };

          currentTarget.__emit(eventType, data, callback, extraInfo);
        }, this);

        targets.reverse().some(function (currentTarget) {
          if (propagationStopped) {
            return true;
          }
          var extraInfo = {
            defaultPrevented: defaultPrevented,
            eventPhase: BUBBLING_PHASE,
            propagationStopped: propagationStopped,
            target: _this
          };
          currentTarget.__emit(eventType, data, callback, extraInfo);
        }, this);
      }

      if (didEmitCallback) {
        var event = NavigationEvent.pool(eventType, this, data);
        propagationStopped && event.stopPropagation();
        defaultPrevented && event.preventDefault();
        didEmitCallback.call(this, event);
        event.dispose();
      }

      this._emitCounter--;
      while (this._emitQueue.length) {
        var args = this._emitQueue.shift();
        this.emit.apply(this, args);
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._bubbleEventEmitter && this._bubbleEventEmitter.removeAllListeners();
      this._captureEventEmitter && this._captureEventEmitter.removeAllListeners();
      this._bubbleEventEmitter = null;
      this._captureEventEmitter = null;
      this._currentRoute = null;
    }
  }, {
    key: '__emit',
    value: function __emit(eventType, data, didEmitCallback, extraInfo) {
      var emitter;
      switch (extraInfo.eventPhase) {
        case CAPTURING_PHASE:
          emitter = this._captureEventEmitter;
          break;

        case AT_TARGET:
          emitter = this._bubbleEventEmitter;
          break;

        case BUBBLING_PHASE:
          emitter = this._bubbleEventEmitter;
          break;

        default:
          invariant(false, 'invalid event phase %s', extraInfo.eventPhase);
      }

      if (extraInfo.target === this) {
        extraInfo.eventPhase = AT_TARGET;
      }

      if (emitter) {
        emitter.emit(eventType, data, didEmitCallback, extraInfo);
      }
    }
  }, {
    key: '_onFocus',
    value: function _onFocus(event) {
      invariant(event.data && event.data.hasOwnProperty('route'), 'event type "%s" should provide route', event.type);

      this._currentRoute = event.data.route;
    }
  }, {
    key: 'parent',
    get: function get() {
      var parent = this.__node.getParent();
      return parent ? parent.getValue() : null;
    }
  }, {
    key: 'top',
    get: function get() {
      var result = null;
      var parentNode = this.__node.getParent();
      while (parentNode) {
        result = parentNode.getValue();
        parentNode = parentNode.getParent();
      }
      return result;
    }
  }, {
    key: 'currentRoute',
    get: function get() {
      return this._currentRoute;
    }
  }]);
  return NavigationContext;
}();

module.exports = NavigationContext;