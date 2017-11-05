

'use strict';

var WebSocketEvent = function WebSocketEvent(type, eventInitDict) {
  babelHelpers.classCallCheck(this, WebSocketEvent);

  this.type = type.toString();
  babelHelpers.extends(this, eventInitDict);
};

module.exports = WebSocketEvent;