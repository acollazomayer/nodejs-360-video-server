
'use strict';

var Settings = {
  get: function get(key) {
    console.warn('Settings is not yet supported on React VR');
    return null;
  },
  set: function set(settings) {
    console.warn('Settings is not yet supported on React VR');
  },
  watchKeys: function watchKeys(keys, callback) {
    console.warn('Settings is not yet supported on React VR');
    return -1;
  },
  clearWatch: function clearWatch(watchId) {
    console.warn('Settings is not yet supported on React VR');
  }
};

module.exports = Settings;