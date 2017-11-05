
'use strict';

var ReactDebugTool = require('ReactDebugTool');
var ReactPerf = require('ReactPerf');

var invariant = require('fbjs/lib/invariant');
var performanceNow = require('fbjs/lib/performanceNow');

var perfModules = [];
var enabled = false;
var lastRenderStartTime = 0;
var totalRenderDuration = 0;

var RCTRenderingPerfDevtool = {
  onBeginLifeCycleTimer: function onBeginLifeCycleTimer(debugID, timerType) {
    if (timerType === 'render') {
      lastRenderStartTime = performanceNow();
    }
  },
  onEndLifeCycleTimer: function onEndLifeCycleTimer(debugID, timerType) {
    if (timerType === 'render') {
      var lastRenderDuration = performanceNow() - lastRenderStartTime;
      totalRenderDuration += lastRenderDuration;
    }
  }
};

var RCTRenderingPerf = {
  toggle: function toggle() {
    console.log('Render perfomance measurements enabled');
    enabled = true;
  },

  start: function start() {
    if (!enabled) {
      return;
    }

    ReactPerf.start();
    ReactDebugTool.addHook(RCTRenderingPerfDevtool);
    perfModules.forEach(function (module) {
      return module.start();
    });
  },

  stop: function stop() {
    if (!enabled) {
      return;
    }

    ReactPerf.stop();
    ReactPerf.printInclusive();
    ReactPerf.printWasted();
    ReactDebugTool.removeHook(RCTRenderingPerfDevtool);

    console.log('Total time spent in render(): ' + totalRenderDuration.toFixed(2) + ' ms');
    lastRenderStartTime = 0;
    totalRenderDuration = 0;

    perfModules.forEach(function (module) {
      return module.stop();
    });
  },

  register: function register(module) {
    invariant(typeof module.start === 'function', 'Perf module should have start() function');
    invariant(typeof module.stop === 'function', 'Perf module should have stop() function');
    perfModules.push(module);
  }
};

module.exports = RCTRenderingPerf;