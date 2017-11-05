Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RCTInputControls = RCTInputControls;

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);
function RCTInputControls(rnctx, guiSys) {
  this._rnctx = rnctx;
  this._guiSys = guiSys;

  guiSys.eventDispatcher.addEventListener('GuiSysEvent', this._onInputEvent.bind(this));
}

RCTInputControls.prototype = babelHelpers.extends(Object.create(Object.prototype), {
  constructor: RCTInputControls,

  _onInputEvent: function _onInputEvent(event) {
    if (event.eventType !== OVRUI.GuiSysEventType.INPUT_EVENT) {
      return;
    }

    var target = this._rnctx.lastHit ? this._rnctx.getHitTag(this._rnctx.lastHit) : null;
    if (target) {
      var source = this._rnctx.lastSource;

      this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [target, 'topInput', {
        inputEvent: event.args.inputEvent,
        target: target,
        source: source
      }]);

      if (this.isConfirmEvent(event.args.inputEvent)) {
        this._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [target, 'topChange', []]);
      }
    }

    this._rnctx.callFunction('RCTDeviceEventEmitter', 'emit', ['onReceivedInputEvent', event.args.inputEvent, target]);
  },

  isConfirmEvent: function isConfirmEvent(event) {
    return event.type === 'GamepadInputEvent' && event.button === 0 && event.eventType === 'keyup' || event.type === 'KeyboardInputEvent' && event.code === 'Space' && event.eventType === 'keyup';
  }
});