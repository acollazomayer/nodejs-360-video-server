
'use strict';

var NativeEventEmitter = require('NativeEventEmitter');
var NativeModules = require('NativeModules');
var Platform = require('Platform');

var invariant = require('fbjs/lib/invariant');

var LinkingManager = Platform.OS === 'android' ? NativeModules.IntentAndroid : NativeModules.LinkingManager;

var Linking = function (_NativeEventEmitter) {
  babelHelpers.inherits(Linking, _NativeEventEmitter);

  function Linking() {
    babelHelpers.classCallCheck(this, Linking);
    return babelHelpers.possibleConstructorReturn(this, (Linking.__proto__ || Object.getPrototypeOf(Linking)).call(this, LinkingManager));
  }

  babelHelpers.createClass(Linking, [{
    key: 'addEventListener',
    value: function addEventListener(type, handler) {
      this.addListener(type, handler);
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, handler) {
      this.removeListener(type, handler);
    }
  }, {
    key: 'openURL',
    value: function openURL(url) {
      this._validateURL(url);
      return LinkingManager.openURL(url);
    }
  }, {
    key: 'canOpenURL',
    value: function canOpenURL(url) {
      this._validateURL(url);
      return LinkingManager.canOpenURL(url);
    }
  }, {
    key: 'getInitialURL',
    value: function getInitialURL() {
      return LinkingManager.getInitialURL();
    }
  }, {
    key: '_validateURL',
    value: function _validateURL(url) {
      invariant(typeof url === 'string', 'Invalid URL: should be a string. Was: ' + url);
      invariant(url, 'Invalid URL: cannot be empty');
    }
  }]);
  return Linking;
}(NativeEventEmitter);

module.exports = new Linking();