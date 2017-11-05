
'use strict';

var BatchedBridge = require('BatchedBridge');
var performanceNow = global.nativePerformanceNow || require('fbjs/lib/performanceNow');

var timespans = {};
var extras = {};

var PerformanceLogger = {
  addTimespan: function addTimespan(key, lengthInMs, description) {
    if (timespans[key]) {
      if (__DEV__) {
        console.log('PerformanceLogger: Attempting to add a timespan that already exists ', key);
      }
      return;
    }

    timespans[key] = {
      description: description,
      totalTime: lengthInMs
    };
  },
  startTimespan: function startTimespan(key, description) {
    if (timespans[key]) {
      if (__DEV__) {
        console.log('PerformanceLogger: Attempting to start a timespan that already exists ', key);
      }
      return;
    }

    timespans[key] = {
      description: description,
      startTime: performanceNow()
    };
  },
  stopTimespan: function stopTimespan(key) {
    if (!timespans[key] || !timespans[key].startTime) {
      if (__DEV__) {
        console.log('PerformanceLogger: Attempting to end a timespan that has not started ', key);
      }
      return;
    }
    if (timespans[key].endTime) {
      if (__DEV__) {
        console.log('PerformanceLogger: Attempting to end a timespan that has already ended ', key);
      }
      return;
    }

    timespans[key].endTime = performanceNow();
    timespans[key].totalTime = timespans[key].endTime - timespans[key].startTime;
  },
  clear: function clear() {
    timespans = {};
    extras = {};
  },
  clearExceptTimespans: function clearExceptTimespans(keys) {
    timespans = Object.keys(timespans).reduce(function (previous, key) {
      if (keys.indexOf(key) !== -1) {
        previous[key] = timespans[key];
      }
      return previous;
    }, {});
    extras = {};
  },
  getTimespans: function getTimespans() {
    return timespans;
  },
  hasTimespan: function hasTimespan(key) {
    return !!timespans[key];
  },
  logTimespans: function logTimespans() {
    for (var key in timespans) {
      if (timespans[key].totalTime) {
        console.log(key + ': ' + timespans[key].totalTime + 'ms');
      }
    }
  },
  addTimespans: function addTimespans(newTimespans, labels) {
    for (var i = 0, l = newTimespans.length; i < l; i += 2) {
      var label = labels[i / 2];
      PerformanceLogger.addTimespan(label, newTimespans[i + 1] - newTimespans[i], label);
    }
  },
  setExtra: function setExtra(key, value) {
    if (extras[key]) {
      if (__DEV__) {
        console.log('PerformanceLogger: Attempting to set an extra that already exists ', key);
      }
      return;
    }
    extras[key] = value;
  },
  getExtras: function getExtras() {
    return extras;
  }
};

BatchedBridge.registerCallableModule('PerformanceLogger', PerformanceLogger);

module.exports = PerformanceLogger;