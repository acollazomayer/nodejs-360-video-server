
'use strict';

var NativeEventEmitter = require('NativeEventEmitter');
var NativeModules = require('NativeModules');
var RCTAppState = NativeModules.AppState;

var logError = require('logError');
var invariant = require('fbjs/lib/invariant');

var AppState = function (_NativeEventEmitter) {
  babelHelpers.inherits(AppState, _NativeEventEmitter);

  function AppState() {
    babelHelpers.classCallCheck(this, AppState);

    var _this = babelHelpers.possibleConstructorReturn(this, (AppState.__proto__ || Object.getPrototypeOf(AppState)).call(this, RCTAppState));

    _this._eventHandlers = {
      change: new Map(),
      memoryWarning: new Map()
    };

    _this.currentState = RCTAppState.initialAppState || 'active';

    _this.addListener('appStateDidChange', function (appStateData) {
      _this.currentState = appStateData.app_state;
    });

    RCTAppState.getCurrentAppState(function (appStateData) {
      _this.currentState = appStateData.app_state;
    }, logError);
    return _this;
  }

  babelHelpers.createClass(AppState, [{
    key: 'addEventListener',
    value: function addEventListener(type, handler) {
      invariant(['change', 'memoryWarning'].indexOf(type) !== -1, 'Trying to subscribe to unknown event: "%s"', type);
      if (type === 'change') {
        this._eventHandlers[type].set(handler, this.addListener('appStateDidChange', function (appStateData) {
          handler(appStateData.app_state);
        }));
      } else if (type === 'memoryWarning') {
        this._eventHandlers[type].set(handler, this.addListener('memoryWarning', handler));
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, handler) {
      invariant(['change', 'memoryWarning'].indexOf(type) !== -1, 'Trying to remove listener for unknown event: "%s"', type);
      if (!this._eventHandlers[type].has(handler)) {
        return;
      }
      this._eventHandlers[type].get(handler).remove();
      this._eventHandlers[type].delete(handler);
    }
  }]);
  return AppState;
}(NativeEventEmitter);

AppState = new AppState();

module.exports = AppState;