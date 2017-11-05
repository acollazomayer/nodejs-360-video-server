
'use strict';

var NativeEventEmitter = require('NativeEventEmitter');
var RCTLocationObserver = require('NativeModules').LocationObserver;

var invariant = require('fbjs/lib/invariant');
var logError = require('logError');
var warning = require('fbjs/lib/warning');

var LocationEventEmitter = new NativeEventEmitter(RCTLocationObserver);

var subscriptions = [];
var updatesEnabled = false;

var Geolocation = {
  getCurrentPosition: function getCurrentPosition(geo_success, geo_error, geo_options) {
    invariant(typeof geo_success === 'function', 'Must provide a valid geo_success callback.');
    RCTLocationObserver.getCurrentPosition(geo_options || {}, geo_success, geo_error || logError);
  },

  watchPosition: function watchPosition(success, error, options) {
    if (!updatesEnabled) {
      RCTLocationObserver.startObserving(options || {});
      updatesEnabled = true;
    }
    var watchID = subscriptions.length;
    subscriptions.push([LocationEventEmitter.addListener('geolocationDidChange', success), error ? LocationEventEmitter.addListener('geolocationError', error) : null]);
    return watchID;
  },

  clearWatch: function clearWatch(watchID) {
    var sub = subscriptions[watchID];
    if (!sub) {
      return;
    }

    sub[0].remove();

    var sub1 = sub[1];sub1 && sub1.remove();
    subscriptions[watchID] = undefined;
    var noWatchers = true;
    for (var ii = 0; ii < subscriptions.length; ii++) {
      if (subscriptions[ii]) {
        noWatchers = false;
      }
    }
    if (noWatchers) {
      Geolocation.stopObserving();
    }
  },

  stopObserving: function stopObserving() {
    if (updatesEnabled) {
      RCTLocationObserver.stopObserving();
      updatesEnabled = false;
      for (var ii = 0; ii < subscriptions.length; ii++) {
        var sub = subscriptions[ii];
        if (sub) {
          warning('Called stopObserving with existing subscriptions.');
          sub[0].remove();

          var sub1 = sub[1];sub1 && sub1.remove();
        }
      }
      subscriptions = [];
    }
  }
};

module.exports = Geolocation;