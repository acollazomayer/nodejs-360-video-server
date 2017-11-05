
'use strict';

var Platform = require('Platform');
var UIManager = require('UIManager');
var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

var invariant = require('fbjs/lib/invariant');

var dimensions = {};

var Dimensions = function () {
  function Dimensions() {
    babelHelpers.classCallCheck(this, Dimensions);
  }

  babelHelpers.createClass(Dimensions, null, [{
    key: 'set',
    value: function set(dims) {
      if (dims && dims.windowPhysicalPixels) {
        dims = JSON.parse(JSON.stringify(dims));

        var windowPhysicalPixels = dims.windowPhysicalPixels;
        dims.window = {
          width: windowPhysicalPixels.width / windowPhysicalPixels.scale,
          height: windowPhysicalPixels.height / windowPhysicalPixels.scale,
          scale: windowPhysicalPixels.scale,
          fontScale: windowPhysicalPixels.fontScale
        };
        if (Platform.OS === 'android') {
          var screenPhysicalPixels = dims.screenPhysicalPixels;
          dims.screen = {
            width: screenPhysicalPixels.width / screenPhysicalPixels.scale,
            height: screenPhysicalPixels.height / screenPhysicalPixels.scale,
            scale: screenPhysicalPixels.scale,
            fontScale: screenPhysicalPixels.fontScale
          };

          delete dims.screenPhysicalPixels;
        } else {
          dims.screen = dims.window;
        }

        delete dims.windowPhysicalPixels;
      }

      babelHelpers.extends(dimensions, dims);
    }
  }, {
    key: 'get',
    value: function get(dim) {
      invariant(dimensions[dim], 'No dimension set for key ' + dim);
      return dimensions[dim];
    }
  }]);
  return Dimensions;
}();

Dimensions.set(UIManager.Dimensions);
RCTDeviceEventEmitter.addListener('didUpdateDimensions', function (update) {
  Dimensions.set(update);
});

module.exports = Dimensions;