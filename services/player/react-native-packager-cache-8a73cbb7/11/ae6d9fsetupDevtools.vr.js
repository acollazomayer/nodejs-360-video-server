
'use strict';

var NativeModules = require('NativeModules');
var UIManager = NativeModules.UIManager;

var logged = false;

function setupDevtools() {
  if (!self.__DEVTOOLS__) {
    return;
  }
  var port = window.__REACT_DEVTOOLS_PORT__ || 8097;
  if (!logged) {
    console.log('Attempting to connect to React Inspector on :' + port);
    logged = true;
  }
  var messageListeners = [];
  var closeListeners = [];
  var hostname = 'localhost';
  var ws = new window.WebSocket('ws://' + hostname + ':' + port + '/devtools');

  var FOR_BACKEND = {
    resolveRNStyle: require('flattenStyle'),
    wall: {
      listen: function listen(fn) {
        messageListeners.push(fn);
      },
      onClose: function onClose(fn) {
        closeListeners.push(fn);
      },
      send: function send(data) {
        ws.send(JSON.stringify(data));
      }
    }
  };
  ws.onclose = handleClose;
  ws.onerror = handleClose;
  ws.onopen = function () {
    tryToConnect();
  };

  var hasClosed = false;
  function handleClose() {
    if (!hasClosed) {
      hasClosed = true;
      setTimeout(setupDevtools, 2000);
      closeListeners.forEach(function (fn) {
        return fn();
      });
    }
  }

  function tryToConnect() {
    ws.send('attach:agent');
    var _interval = setInterval(function () {
      return ws.send('attach:agent');
    }, 500);
    ws.onmessage = function (evt) {
      if (evt.data.indexOf('eval:') === 0) {
        clearInterval(_interval);
        initialize(evt.data.slice('eval:'.length));
      }
    };
  }

  function initialize(text) {
    try {
      eval(text);
    } catch (e) {
      console.error('Failed to eval: ' + e.message);
      return;
    }
    var ReactNativeComponentTree = require('ReactNativeComponentTree');
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
      ComponentTree: {
        getClosestInstanceFromNode: function getClosestInstanceFromNode(node) {
          return ReactNativeComponentTree.getClosestInstanceFromNode(node);
        },
        getNodeFromInstance: function getNodeFromInstance(inst) {
          while (inst._renderedComponent) {
            inst = inst._renderedComponent;
          }
          if (inst) {
            return ReactNativeComponentTree.getNodeFromInstance(inst);
          } else {
            return null;
          }
        }
      },
      Mount: require('ReactNativeMount'),
      Reconciler: require('ReactReconciler')
    });
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', attachToDevtools);
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) {
      attachToDevtools(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent);
    }
    ws.onmessage = handleMessage;
  }

  var currentHighlight = null;

  function attachToDevtools(agent) {
    agent.sub('highlight', function (_ref) {
      var node = _ref.node,
          name = _ref.name,
          props = _ref.props;

      currentHighlight = node;
      UIManager.setBoundingBoxVisible(node, true);
    });
    agent.sub('hideHighlight', function () {
      if (currentHighlight) {
        UIManager.setBoundingBoxVisible(currentHighlight, false);
        currentHighlight = null;
      }
    });
  }

  function handleMessage(evt) {
    var data = void 0;
    try {
      data = JSON.parse(evt.data);
    } catch (e) {
      return console.error('failed to parse json: ' + evt.data);
    }

    if (data.$close || data.$error) {
      closeListeners.forEach(function (fn) {
        return fn();
      });
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__.emit('shutdown');
      tryToConnect();
      return;
    }
    if (data.$open) {
      return;
    }
    messageListeners.forEach(function (fn) {
      try {
        fn(data);
      } catch (e) {
        console.log(data);
        throw e;
      }
    });
  }
}

module.exports = setupDevtools;