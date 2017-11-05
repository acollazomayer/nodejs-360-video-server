
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var GuiSysEventType = exports.GuiSysEventType = {
  HIT_CHANGED: 'HIT_CHANGED',
  INPUT_EVENT: 'INPUT_EVENT'
};

var GuiSysEvent = exports.GuiSysEvent = function GuiSysEvent(eventType, args) {
  _classCallCheck(this, GuiSysEvent);

  this.type = 'GuiSysEvent';
  this.eventType = eventType;
  this.args = args;
};

var UIViewEventType = exports.UIViewEventType = {
  FOCUS_LOST: 'FOCUS_LOST',
  FOCUS_GAINED: 'FOCUS_GAINED'
};

var UIViewEvent = exports.UIViewEvent = function UIViewEvent(view, eventType, args) {
  _classCallCheck(this, UIViewEvent);

  this.type = 'UIViewEvent';
  this.view = view;
  this.eventType = eventType;
  this.args = args;
};