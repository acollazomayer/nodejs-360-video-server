

'use strict';

var _jsxFileName = '/usr/src/app/node_modules/react-native/Libraries/Inspector/Inspector.js';
var Dimensions = require('Dimensions');
var InspectorOverlay = require('InspectorOverlay');
var InspectorPanel = require('InspectorPanel');
var InspectorUtils = require('InspectorUtils');
var Platform = require('Platform');
var React = require('React');
var StyleSheet = require('StyleSheet');
var Touchable = require('Touchable');
var UIManager = require('UIManager');
var View = require('View');

if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.resolveRNStyle = require('flattenStyle');
}

var Inspector = function (_React$Component) {
  babelHelpers.inherits(Inspector, _React$Component);

  function Inspector(props) {
    babelHelpers.classCallCheck(this, Inspector);

    var _this = babelHelpers.possibleConstructorReturn(this, (Inspector.__proto__ || Object.getPrototypeOf(Inspector)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      devtoolsAgent: null,
      hierarchy: null,
      panelPos: 'bottom',
      inspecting: true,
      perfing: false,
      inspected: null,
      selection: null,
      inspectedViewTag: _this.props.inspectedViewTag,
      networking: false
    };
    return _this;
  }

  babelHelpers.createClass(Inspector, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        this.attachToDevtools = this.attachToDevtools.bind(this);
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', this.attachToDevtools);

        if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent) {
          this.attachToDevtools(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.reactDevtoolsAgent);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this._subs) {
        this._subs.map(function (fn) {
          return fn();
        });
      }
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.off('react-devtools', this.attachToDevtools);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.setState({ inspectedViewTag: newProps.inspectedViewTag });
    }
  }, {
    key: 'setSelection',
    value: function setSelection(i) {
      var _this2 = this;

      var instance = this.state.hierarchy[i];

      var publicInstance = instance['_instance'] || {};
      var source = instance['_currentElement'] && instance['_currentElement']['_source'];
      UIManager.measure(instance.getHostNode(), function (x, y, width, height, left, top) {
        _this2.setState({
          inspected: {
            frame: { left: left, top: top, width: width, height: height },
            style: publicInstance.props ? publicInstance.props.style : {},
            source: source
          },
          selection: i
        });
      });
    }
  }, {
    key: 'onTouchInstance',
    value: function onTouchInstance(touched, frame, pointerY) {
      var hierarchy = InspectorUtils.getOwnerHierarchy(touched);
      var instance = InspectorUtils.lastNotNativeInstance(hierarchy);

      if (this.state.devtoolsAgent) {
        this.state.devtoolsAgent.selectFromReactInstance(instance, true);
      }

      var publicInstance = instance['_instance'] || {};
      var props = publicInstance.props || {};
      var source = instance['_currentElement'] && instance['_currentElement']['_source'];
      this.setState({
        panelPos: pointerY > Dimensions.get('window').height / 2 ? 'top' : 'bottom',
        selection: hierarchy.indexOf(instance),
        hierarchy: hierarchy,
        inspected: {
          style: props.style || {},
          frame: frame,
          source: source
        }
      });
    }
  }, {
    key: 'setPerfing',
    value: function setPerfing(val) {
      this.setState({
        perfing: val,
        inspecting: false,
        inspected: null,
        networking: false
      });
    }
  }, {
    key: 'setInspecting',
    value: function setInspecting(val) {
      this.setState({
        inspecting: val,
        inspected: null
      });
    }
  }, {
    key: 'setTouchTargetting',
    value: function setTouchTargetting(val) {
      var _this3 = this;

      Touchable.TOUCH_TARGET_DEBUG = val;
      this.props.onRequestRerenderApp(function (inspectedViewTag) {
        _this3.setState({ inspectedViewTag: inspectedViewTag });
      });
    }
  }, {
    key: 'setNetworking',
    value: function setNetworking(val) {
      this.setState({
        networking: val,
        perfing: false,
        inspecting: false,
        inspected: null
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var panelContainerStyle = this.state.panelPos === 'bottom' ? { bottom: 0 } : { top: Platform.OS === 'ios' ? 20 : 0 };
      return React.createElement(
        View,
        { style: styles.container, pointerEvents: 'box-none', __source: {
            fileName: _jsxFileName,
            lineNumber: 212
          }
        },
        this.state.inspecting && React.createElement(InspectorOverlay, {
          inspected: this.state.inspected,
          inspectedViewTag: this.state.inspectedViewTag,
          onTouchInstance: this.onTouchInstance.bind(this),
          __source: {
            fileName: _jsxFileName,
            lineNumber: 214
          }
        }),
        React.createElement(
          View,
          { style: [styles.panelContainer, panelContainerStyle], __source: {
              fileName: _jsxFileName,
              lineNumber: 219
            }
          },
          React.createElement(InspectorPanel, {
            devtoolsIsOpen: !!this.state.devtoolsAgent,
            inspecting: this.state.inspecting,
            perfing: this.state.perfing,
            setPerfing: this.setPerfing.bind(this),
            setInspecting: this.setInspecting.bind(this),
            inspected: this.state.inspected,
            hierarchy: this.state.hierarchy,
            selection: this.state.selection,
            setSelection: this.setSelection.bind(this),
            touchTargetting: Touchable.TOUCH_TARGET_DEBUG,
            setTouchTargetting: this.setTouchTargetting.bind(this),
            networking: this.state.networking,
            setNetworking: this.setNetworking.bind(this),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 220
            }
          })
        )
      );
    }
  }]);
  return Inspector;
}(React.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.attachToDevtools = function (agent) {
    var _hideWait = null;
    var hlSub = agent.sub('highlight', function (_ref) {
      var node = _ref.node,
          name = _ref.name,
          props = _ref.props;

      clearTimeout(_hideWait);
      UIManager.measure(node, function (x, y, width, height, left, top) {
        _this4.setState({
          hierarchy: [],
          inspected: {
            frame: { left: left, top: top, width: width, height: height },
            style: props ? props.style : {}
          }
        });
      });
    });
    var hideSub = agent.sub('hideHighlight', function () {
      if (_this4.state.inspected === null) {
        return;
      }

      _hideWait = setTimeout(function () {
        _this4.setState({
          inspected: null
        });
      }, 100);
    });
    _this4._subs = [hlSub, hideSub];

    agent.on('shutdown', function () {
      _this4.setState({ devtoolsAgent: null });
      _this4._subs = null;
    });
    _this4.setState({
      devtoolsAgent: agent
    });
  };
};

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  panelContainer: {
    position: 'absolute',
    left: 0,
    right: 0
  }
});

module.exports = Inspector;