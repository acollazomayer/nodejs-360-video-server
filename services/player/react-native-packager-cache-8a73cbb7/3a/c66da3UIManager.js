
'use strict';

var NativeModules = require('NativeModules');
var Platform = require('Platform');

var defineLazyObjectProperty = require('defineLazyObjectProperty');
var findNodeHandle = require('findNodeHandle');
var invariant = require('fbjs/lib/invariant');

var UIManager = NativeModules.UIManager;


invariant(UIManager, 'UIManager is undefined. The native module config is probably incorrect.');

var _takeSnapshot = UIManager.takeSnapshot;

UIManager.takeSnapshot = function _callee(view, options) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (_takeSnapshot) {
            _context.next = 3;
            break;
          }

          console.warn('UIManager.takeSnapshot is not available on this platform');
          return _context.abrupt('return');

        case 3:
          if (typeof view !== 'number' && view !== 'window') {
            view = findNodeHandle(view) || 'window';
          }
          return _context.abrupt('return', _takeSnapshot(view, options));

        case 5:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};

if (Platform.OS === 'ios') {
  Object.keys(UIManager).forEach(function (viewName) {
    var viewConfig = UIManager[viewName];
    if (viewConfig.Manager) {
      defineLazyObjectProperty(viewConfig, 'Constants', {
        get: function get() {
          var viewManager = NativeModules[viewConfig.Manager];
          var constants = {};
          viewManager && Object.keys(viewManager).forEach(function (key) {
            var value = viewManager[key];
            if (typeof value !== 'function') {
              constants[key] = value;
            }
          });
          return constants;
        }
      });
      defineLazyObjectProperty(viewConfig, 'Commands', {
        get: function get() {
          var viewManager = NativeModules[viewConfig.Manager];
          var commands = {};
          var index = 0;
          viewManager && Object.keys(viewManager).forEach(function (key) {
            var value = viewManager[key];
            if (typeof value === 'function') {
              commands[key] = index++;
            }
          });
          return commands;
        }
      });
    }
  });
} else if (Platform.OS === 'android' && UIManager.AndroidLazyViewManagersEnabled) {
  UIManager.ViewManagerNames.forEach(function (viewManagerName) {
    defineLazyObjectProperty(UIManager, viewManagerName, {
      get: function get() {
        return NativeModules[viewManagerName.replace(/^(RCT|RK)/, '')];
      }
    });
  });
}

module.exports = UIManager;