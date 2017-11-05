
'use strict';

var RCTImageEditingManager = require('NativeModules').ImageEditingManager;

var ImageEditor = function () {
  function ImageEditor() {
    babelHelpers.classCallCheck(this, ImageEditor);
  }

  babelHelpers.createClass(ImageEditor, null, [{
    key: 'cropImage',
    value: function cropImage(uri, cropData, success, failure) {
      RCTImageEditingManager.cropImage(uri, cropData, success, failure);
    }
  }]);
  return ImageEditor;
}();

module.exports = ImageEditor;