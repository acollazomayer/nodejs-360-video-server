

'use strict';

var ReactCurrentOwner = require('react/lib/ReactCurrentOwner');
var ReactInstanceMap = require('ReactInstanceMap');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function findNodeHandle(componentOrHandle) {
  if (__DEV__) {
    var owner = ReactCurrentOwner.current;
    if (owner !== null) {
      warning(owner._warnedAboutRefsInRender, '%s is accessing findNodeHandle inside its render(). ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', owner.getName() || 'A component');
      owner._warnedAboutRefsInRender = true;
    }
  }
  if (componentOrHandle == null) {
    return null;
  }
  if (typeof componentOrHandle === 'number') {
    return componentOrHandle;
  }

  var component = componentOrHandle;

  var internalInstance = ReactInstanceMap.get(component);
  if (internalInstance) {
    return internalInstance.getHostNode();
  } else {
    var rootNodeID = component._rootNodeID;
    if (rootNodeID) {
      return rootNodeID;
    } else {
      invariant(typeof component === 'object' && '_rootNodeID' in component || component.render != null && typeof component.render === 'function', 'findNodeHandle(...): Argument is not a component ' + '(type: %s, keys: %s)', typeof component, Object.keys(component));
      invariant(false, 'findNodeHandle(...): Unable to find node handle for unmounted ' + 'component.');
    }
  }
}

module.exports = findNodeHandle;