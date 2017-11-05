
'use strict';

var SamplingProfiler = {
  poke: function poke(token) {
    var error = null;
    var result = null;
    try {
      result = global.pokeSamplingProfiler();
      if (result === null) {
        console.log('The JSC Sampling Profiler has started');
      } else {
        console.log('The JSC Sampling Profiler has stopped');
      }
    } catch (e) {
      console.log('Error occured when restarting Sampling Profiler: ' + e.toString());
      error = e.toString();
    }
    require('NativeModules').JSCSamplingProfiler.operationComplete(token, result, error);
  }
};

module.exports = SamplingProfiler;