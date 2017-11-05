

'use strict';

var history = [];

var ReactHostOperationHistoryHook = {
  onHostOperation: function onHostOperation(operation) {
    history.push(operation);
  },
  clearHistory: function clearHistory() {
    if (ReactHostOperationHistoryHook._preventClearing) {
      return;
    }

    history = [];
  },
  getHistory: function getHistory() {
    return history;
  }
};

module.exports = ReactHostOperationHistoryHook;