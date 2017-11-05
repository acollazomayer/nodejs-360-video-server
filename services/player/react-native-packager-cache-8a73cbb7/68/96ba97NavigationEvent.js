
'use strict';

var invariant = require('fbjs/lib/invariant');

var NavigationEventPool = function () {
  function NavigationEventPool() {
    babelHelpers.classCallCheck(this, NavigationEventPool);

    this._list = [];
  }

  babelHelpers.createClass(NavigationEventPool, [{
    key: 'get',
    value: function get(type, currentTarget, data) {
      var event = void 0;
      if (this._list.length > 0) {
        event = this._list.pop();
        event.constructor.call(event, type, currentTarget, data);
      } else {
        event = new NavigationEvent(type, currentTarget, data);
      }
      return event;
    }
  }, {
    key: 'put',
    value: function put(event) {
      this._list.push(event);
    }
  }]);
  return NavigationEventPool;
}();

var _navigationEventPool = new NavigationEventPool();

var NavigationEvent = function () {
  babelHelpers.createClass(NavigationEvent, null, [{
    key: 'pool',
    value: function pool(type, currentTarget, data) {
      return _navigationEventPool.get(type, currentTarget, data);
    }
  }]);

  function NavigationEvent(type, currentTarget, data) {
    babelHelpers.classCallCheck(this, NavigationEvent);

    this.target = currentTarget;
    this.eventPhase = NavigationEvent.NONE;

    this._type = type;
    this._currentTarget = currentTarget;
    this._data = data;
    this._defaultPrevented = false;
    this._disposed = false;
    this._propagationStopped = false;
  }

  babelHelpers.createClass(NavigationEvent, [{
    key: 'preventDefault',
    value: function preventDefault() {
      this._defaultPrevented = true;
    }
  }, {
    key: 'stopPropagation',
    value: function stopPropagation() {
      this._propagationStopped = true;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.preventDefault();
      this.stopPropagation();
    }
  }, {
    key: 'isPropagationStopped',
    value: function isPropagationStopped() {
      return this._propagationStopped;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      invariant(!this._disposed, 'NavigationEvent is already disposed');
      this._disposed = true;

      this.target = null;
      this.eventPhase = NavigationEvent.NONE;
      this._type = '';
      this._currentTarget = null;
      this._data = null;
      this._defaultPrevented = false;

      _navigationEventPool.put(this);
    }
  }, {
    key: 'type',
    get: function get() {
      return this._type;
    }
  }, {
    key: 'currentTarget',
    get: function get() {
      return this._currentTarget;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }, {
    key: 'defaultPrevented',
    get: function get() {
      return this._defaultPrevented;
    }
  }]);
  return NavigationEvent;
}();

NavigationEvent.NONE = 0;

NavigationEvent.CAPTURING_PHASE = 1;

NavigationEvent.AT_TARGET = 2;

NavigationEvent.BUBBLING_PHASE = 3;

module.exports = NavigationEvent;