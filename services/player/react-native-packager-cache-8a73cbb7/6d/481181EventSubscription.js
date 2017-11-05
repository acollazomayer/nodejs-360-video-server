
'use strict';

var EventSubscription = function () {
  function EventSubscription(subscriber) {
    babelHelpers.classCallCheck(this, EventSubscription);

    this.subscriber = subscriber;
  }

  babelHelpers.createClass(EventSubscription, [{
    key: 'remove',
    value: function remove() {
      this.subscriber.removeSubscription(this);
    }
  }]);
  return EventSubscription;
}();

module.exports = EventSubscription;