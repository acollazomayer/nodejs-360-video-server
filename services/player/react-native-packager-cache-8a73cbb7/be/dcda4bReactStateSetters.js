

'use strict';

var ReactStateSetters = {
  createStateSetter: function createStateSetter(component, funcReturningState) {
    return function (a, b, c, d, e, f) {
      var partialState = funcReturningState.call(component, a, b, c, d, e, f);
      if (partialState) {
        component.setState(partialState);
      }
    };
  },

  createStateKeySetter: function createStateKeySetter(component, key) {
    var cache = component.__keySetters || (component.__keySetters = {});
    return cache[key] || (cache[key] = _createStateKeySetter(component, key));
  }
};

function _createStateKeySetter(component, key) {
  var partialState = {};
  return function stateKeySetter(value) {
    partialState[key] = value;
    component.setState(partialState);
  };
}

ReactStateSetters.Mixin = {
  createStateSetter: function createStateSetter(funcReturningState) {
    return ReactStateSetters.createStateSetter(this, funcReturningState);
  },

  createStateKeySetter: function createStateKeySetter(key) {
    return ReactStateSetters.createStateKeySetter(this, key);
  }
};

module.exports = ReactStateSetters;