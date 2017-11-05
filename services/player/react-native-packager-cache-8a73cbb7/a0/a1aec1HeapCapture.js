
'use strict';

var HeapCapture = {
  captureHeap: function captureHeap(path) {
    var error = null;
    try {
      global.nativeCaptureHeap(path);
      console.log('HeapCapture.captureHeap succeeded: ' + path);
    } catch (e) {
      console.log('HeapCapture.captureHeap error: ' + e.toString());
      error = e.toString();
    }
    require('NativeModules').JSCHeapCapture.captureComplete(path, error);
  }
};

module.exports = HeapCapture;