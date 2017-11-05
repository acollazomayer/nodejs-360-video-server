

'use strict';

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM };

module.exports = ExecutionEnvironment;