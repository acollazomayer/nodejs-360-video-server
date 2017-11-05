
'use strict';

var EventSubscription = require('EventSubscription');

var EmitterSubscription = function (_EventSubscription) {
  babelHelpers.inherits(EmitterSubscription, _EventSubscription);

  function EmitterSubscription(emitter, subscriber, listener, context) {
    babelHelpers.classCallCheck(this, EmitterSubscription);

    var _this = babelHelpers.possibleConstructorReturn(this, (EmitterSubscription.__proto__ || Object.getPrototypeOf(EmitterSubscription)).call(this, subscriber));

    _this.emitter = emitter;
    _this.listener = listener;
    _this.context = context;
    return _this;
  }

  babelHelpers.createClass(EmitterSubscription, [{
    key: 'remove',
    value: function remove() {
      this.emitter.removeSubscription(this);
    }
  }]);
  return EmitterSubscription;
}(EventSubscription);

module.exports = EmitterSubscription;