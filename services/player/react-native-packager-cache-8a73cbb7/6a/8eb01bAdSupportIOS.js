
'use strict';

var AdSupport = require('NativeModules').AdSupport;

module.exports = {
  getAdvertisingId: function getAdvertisingId(onSuccess, onFailure) {
    AdSupport.getAdvertisingId(onSuccess, onFailure);
  },

  getAdvertisingTrackingEnabled: function getAdvertisingTrackingEnabled(onSuccess, onFailure) {
    AdSupport.getAdvertisingTrackingEnabled(onSuccess, onFailure);
  }
};