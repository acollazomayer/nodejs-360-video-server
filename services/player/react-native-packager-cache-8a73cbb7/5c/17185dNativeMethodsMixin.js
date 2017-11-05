
'use strict';

var ReactNativeAttributePayload = require('ReactNativeAttributePayload');
var TextInputState = require('TextInputState');
var UIManager = require('UIManager');

var findNodeHandle = require('findNodeHandle');
var invariant = require('fbjs/lib/invariant');

function warnForStyleProps(props, validAttributes) {
  for (var key in validAttributes.style) {
    if (!(validAttributes[key] || props[key] === undefined)) {
      console.error('You are setting the style `{ ' + key + ': ... }` as a prop. You ' + 'should nest it in a style object. ' + 'E.g. `{ style: { ' + key + ': ... } }`');
    }
  }
}

var NativeMethodsMixin = {
  measure: function measure(callback) {
    UIManager.measure(findNodeHandle(this), mountSafeCallback(this, callback));
  },

  measureInWindow: function measureInWindow(callback) {
    UIManager.measureInWindow(findNodeHandle(this), mountSafeCallback(this, callback));
  },

  measureLayout: function measureLayout(relativeToNativeNode, onSuccess, onFail) {
    UIManager.measureLayout(findNodeHandle(this), relativeToNativeNode, mountSafeCallback(this, onFail), mountSafeCallback(this, onSuccess));
  },

  setNativeProps: function setNativeProps(nativeProps) {
    if (!this.viewConfig) {
      var ctor = this.constructor;
      var componentName = ctor.displayName || ctor.name || '<Unknown Component>';
      invariant(false, componentName + ' "viewConfig" is not defined.');
    }

    if (__DEV__) {
      warnForStyleProps(nativeProps, this.viewConfig.validAttributes);
    }

    var updatePayload = ReactNativeAttributePayload.create(nativeProps, this.viewConfig.validAttributes);

    UIManager.updateView(findNodeHandle(this), this.viewConfig.uiViewClassName, updatePayload);
  },

  focus: function focus() {
    TextInputState.focusTextInput(findNodeHandle(this));
  },

  blur: function blur() {
    TextInputState.blurTextInput(findNodeHandle(this));
  }
};

function throwOnStylesProp(component, props) {
  if (props.styles !== undefined) {
    var owner = component._owner || null;
    var name = component.constructor.displayName;
    var msg = '`styles` is not a supported property of `' + name + '`, did ' + 'you mean `style` (singular)?';
    if (owner && owner.constructor && owner.constructor.displayName) {
      msg += '\n\nCheck the `' + owner.constructor.displayName + '` parent ' + ' component.';
    }
    throw new Error(msg);
  }
}
if (__DEV__) {
  var NativeMethodsMixin_DEV = NativeMethodsMixin;
  invariant(!NativeMethodsMixin_DEV.componentWillMount && !NativeMethodsMixin_DEV.componentWillReceiveProps, 'Do not override existing functions.');
  NativeMethodsMixin_DEV.componentWillMount = function () {
    throwOnStylesProp(this, this.props);
  };
  NativeMethodsMixin_DEV.componentWillReceiveProps = function (newProps) {
    throwOnStylesProp(this, newProps);
  };
}

function mountSafeCallback(context, callback) {
  return function () {
    if (!callback || context.isMounted && !context.isMounted()) {
      return undefined;
    }
    return callback.apply(context, arguments);
  };
}

module.exports = NativeMethodsMixin;