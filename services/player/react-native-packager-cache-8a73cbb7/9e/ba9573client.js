var _reactVrWeb = require('react-vr-web');

function init(bundle, parent, options) {
  var vr = new _reactVrWeb.VRInstance(bundle, 'VrVideoApp', parent, babelHelpers.extends({}, options));
  vr.render = function () {};

  vr.start();
  return vr;
}

window.ReactVR = { init: init };