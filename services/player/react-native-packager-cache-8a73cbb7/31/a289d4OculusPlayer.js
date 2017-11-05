
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attemptOculusPlayer = attemptOculusPlayer;

var isChrome = !!window.chrome;
var isFirefox = !!window.sidebar;
var isEdge = !!navigator.msLaunchUri;

var visibilityEvent = 'hidden' in document ? 'visibilitychange' : 'webkitvisibilitychange';

function attemptOculusPlayer() {
  var url = 'ovrweb:' + window.location.toString();
  return new Promise(function (resolve, reject) {
    if (isEdge && typeof navigator.msLaunchUri === 'function') {
      navigator.msLaunchUri(url, function () {
        resolve();
      }, function () {
        reject();
      });
    } else if (isFirefox) {
      var iframe = document.createElement('iframe');
      iframe.src = 'about:blank';
      iframe.style.display = 'none';
      if (document.body) {
        document.body.appendChild(iframe);
      }
      var success = false;
      try {
        iframe.contentWindow.location = url;
        success = true;
      } catch (e) {
        reject();
      }
      if (success) {
        resolve();
      }
    } else if (isChrome) {
      var topNode = window;

      while (topNode !== topNode.parent) {
        topNode = topNode.parent;
      }
      var timeout = setTimeout(function () {
        topNode.removeEventListener('blur', blurHandler);
        document.removeEventListener(visibilityEvent, blurHandler);
        reject();
      }, 2000);
      var blurHandler = function blurHandler(e) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        topNode.removeEventListener('blur', blurHandler);
        document.removeEventListener(visibilityEvent, blurHandler);
        resolve();
      };

      topNode.addEventListener('blur', blurHandler);
      document.addEventListener(visibilityEvent, blurHandler);
      window.location = url;
    } else {
      reject();
    }
  });
}