
'use strict';

var HMRLoadingView = function () {
  function HMRLoadingView() {
    babelHelpers.classCallCheck(this, HMRLoadingView);
  }

  babelHelpers.createClass(HMRLoadingView, null, [{
    key: 'showMessage',
    value: function showMessage(message) {
      if (HMRLoadingView._showing) {
        return;
      }
      console.log('HMR Start');
      console.log(message);
      HMRLoadingView._showing = true;
      setTimeout(function () {
        HMRLoadingView._showing = false;
        console.log('HMR End');
      }, 2000);
    }
  }, {
    key: 'hide',
    value: function hide() {}
  }]);
  return HMRLoadingView;
}();

module.exports = HMRLoadingView;