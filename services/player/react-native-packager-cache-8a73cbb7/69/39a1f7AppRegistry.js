
'use strict';

var BatchedBridge = require('BatchedBridge');
var BugReporting = require('BugReporting');
var ReactNative = require('ReactNative');

var infoLog = require('infoLog');
var invariant = require('fbjs/lib/invariant');
var renderApplication = require('renderApplication');

var _require = require('NativeModules'),
    HeadlessJsTaskSupport = _require.HeadlessJsTaskSupport;

if (__DEV__) {
  require('RCTRenderingPerf');
}

var runnables = {};
var runCount = 1;
var tasks = new Map();

var AppRegistry = {
  registerConfig: function registerConfig(config) {
    for (var i = 0; i < config.length; ++i) {
      var appConfig = config[i];
      if (appConfig.run) {
        AppRegistry.registerRunnable(appConfig.appKey, appConfig.run);
      } else {
        invariant(appConfig.component, 'No component provider passed in');
        AppRegistry.registerComponent(appConfig.appKey, appConfig.component);
      }
    }
  },

  registerComponent: function registerComponent(appKey, getComponentFunc) {
    runnables[appKey] = {
      run: function run(appParameters) {
        return renderApplication(getComponentFunc(), appParameters.initialProps, appParameters.rootTag);
      }
    };
    return appKey;
  },

  registerRunnable: function registerRunnable(appKey, func) {
    runnables[appKey] = { run: func };
    return appKey;
  },

  getAppKeys: function getAppKeys() {
    return Object.keys(runnables);
  },

  runApplication: function runApplication(appKey, appParameters) {
    var msg = 'Running application "' + appKey + '" with appParams: ' + JSON.stringify(appParameters) + '. ' + '__DEV__ === ' + String(__DEV__) + ', development-level warning are ' + (__DEV__ ? 'ON' : 'OFF') + ', performance optimizations are ' + (__DEV__ ? 'OFF' : 'ON');
    infoLog(msg);
    BugReporting.addSource('AppRegistry.runApplication' + runCount++, function () {
      return msg;
    });
    invariant(runnables[appKey] && runnables[appKey].run, 'Application ' + appKey + ' has not been registered. This ' + 'is either due to a require() error during initialization ' + 'or failure to call AppRegistry.registerComponent.');
    runnables[appKey].run(appParameters);
  },

  unmountApplicationComponentAtRootTag: function unmountApplicationComponentAtRootTag(rootTag) {
    ReactNative.unmountComponentAtNodeAndRemoveContainer(rootTag);
  },

  registerHeadlessTask: function registerHeadlessTask(taskKey, task) {
    if (tasks.has(taskKey)) {
      console.warn('registerHeadlessTask called multiple times for same key \'' + taskKey + '\'');
    }
    tasks.set(taskKey, task);
  },

  startHeadlessTask: function startHeadlessTask(taskId, taskKey, data) {
    var taskProvider = tasks.get(taskKey);
    if (!taskProvider) {
      throw new Error('No task registered for key ' + taskKey);
    }
    taskProvider()(data).then(function () {
      return HeadlessJsTaskSupport.notifyTaskFinished(taskId);
    }).catch(function (reason) {
      console.error(reason);
      HeadlessJsTaskSupport.notifyTaskFinished(taskId);
    });
  }

};

BatchedBridge.registerCallableModule('AppRegistry', AppRegistry);

module.exports = AppRegistry;