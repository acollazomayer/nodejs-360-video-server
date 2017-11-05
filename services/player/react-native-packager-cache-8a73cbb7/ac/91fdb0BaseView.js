Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isPositive = require('../Utils/isPositive');

var _isPositive2 = babelHelpers.interopRequireDefault(_isPositive);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var _UIManager = require('../Modules/UIManager');

var _UIManager2 = babelHelpers.interopRequireDefault(_UIManager);

var INTERACTION_CALLBACKS = ['onEnter', 'onExit', 'onInput', 'onChange', 'onHeadPose', 'onChangeCaptured', 'onInputCaptured', 'onHeadPoseCaptured', 'onMove'];

var IS_MOUSE_INTERACTION_CALLBACKS = {
  onEnter: true,
  onExit: true,
  onInput: true,
  onChange: true,
  onHeadPose: true,
  onChangeCaptured: true,
  onInputCaptured: true,
  onHeadPoseCaptured: true,
  onMove: true
};

var MAP_CSS_WRAP = {
  nowrap: Yoga.WRAP_NO_WRAP,
  wrap: Yoga.WRAP_WRAP
};

var MAP_CSS_FLEX_DIRECTION = {
  column: Yoga.FLEX_DIRECTION_COLUMN,
  'column-reverse': Yoga.FLEX_DIRECTION_COLUMN_REVERSE,
  row: Yoga.FLEX_DIRECTION_ROW,
  'row-reverse': Yoga.FLEX_DIRECTION_ROW_REVERSE
};

var MAP_CSS_JUSTIFY = {
  'flex-start': Yoga.JUSTIFY_FLEX_START,
  center: Yoga.JUSTIFY_CENTER,
  'flex-end': Yoga.JUSTIFY_FLEX_END,
  'space-between': Yoga.JUSTIFY_SPACE_BETWEEN,
  'space-around': Yoga.JUSTIFY_SPACE_AROUND
};

var MAP_CSS_ALIGN = {
  auto: Yoga.ALIGN_AUTO,
  'flex-start': Yoga.ALIGN_FLEX_START,
  center: Yoga.ALIGN_CENTER,
  'flex-end': Yoga.ALIGN_FLEX_END,
  stretch: Yoga.ALIGN_STRETCH,
  baseline: Yoga.ALIGN_BASELINE
};

var MAP_CSS_POSITION = {
  relative: Yoga.POSITION_TYPE_RELATIVE,
  absolute: Yoga.POSITION_TYPE_ABSOLUTE
};

var MAP_CSS_OVERFLOW = {
  visible: Yoga.OVERFLOW_VISIBLE,
  hidden: Yoga.OVERFLOW_HIDDEN,
  scroll: Yoga.OVERFLOW_SCROLL
};

var MAP_CSS_DISPLAY = {
  flex: Yoga.DISPLAY_FLEX,
  none: Yoga.DISPLAY_NONE
};

var COMMAND_SET_IMMEDIATE_ON_TOUCH_END = -1;

function _isPercent(value) {
  if (typeof value === 'string') {
    return true;
  }
  return undefined;
}

var RCTBaseView = function () {
  function RCTBaseView() {
    var _this = this;

    babelHelpers.classCallCheck(this, RCTBaseView);

    this._borderRadius = null;
    this._borderTopLeftRadius = null;
    this._borderTopRightRadius = null;
    this._borderBottomLeftRadius = null;
    this._borderBottomRightRadius = null;
    this._borderRadiusDirty = false;
    this.YGNode = Yoga.Node.create();

    this.UIManager = null;
    this.tag = 0;
    this.rootTag = 0;
    this.children = [];
    this.parent = null;
    this.props = {};
    this.style = {
      layoutOrigin: [0, 0]
    };
    this.interactableCount = 0;
    this.mouseInteractableCount = 0;
    this.isDirty = true;
    this.receivesMoveEvent = false;

    Object.defineProperty(this.style, 'backgroundColor', {
      set: function set(value) {
        if (value == null) {
          value = 0;
        }
        _this.view.setBackgroundColor(value);
      }
    });
    Object.defineProperty(this.style, 'opacity', {
      configurable: true,
      set: function set(value) {
        if (value == null) {
          value = 1.0;
        }
        _this.view.setOpacity(value);
      }
    });
    Object.defineProperty(this.style, 'borderColor', {
      set: function set(value) {
        if (value == null) {
          value = 0xff000000;
        }
        _this.view.setBorderColor(value);
      }
    });
    Object.defineProperty(this.style, 'borderRadius', {
      set: function set(value) {
        if (value == null) {
          value = 0.0;
        }
        _this._borderRadius = value;
        _this._borderRadiusDirty = true;
      }
    });
    Object.defineProperty(this.style, 'borderTopLeftRadius', {
      set: function set(value) {
        if (value == null) {
          value = 0.0;
        }
        _this._borderTopLeftRadius = value;
        _this._borderRadiusDirty = true;
      }
    });
    Object.defineProperty(this.style, 'borderTopRightRadius', {
      set: function set(value) {
        if (value == null) {
          value = 0.0;
        }
        _this._borderTopRightRadius = value;
        _this._borderRadiusDirty = true;
      }
    });
    Object.defineProperty(this.style, 'borderBottomLeftRadius', {
      set: function set(value) {
        if (value == null) {
          value = 0.0;
        }
        _this._borderBottomLeftRadius = value;
        _this._borderRadiusDirty = true;
      }
    });
    Object.defineProperty(this.style, 'borderBottomRightRadius', {
      set: function set(value) {
        if (value == null) {
          value = 0.0;
        }
        _this._borderBottomRightRadius = value;
        _this._borderRadiusDirty = true;
      }
    });
    Object.defineProperty(this.style, 'renderGroup', {
      set: function set(value) {
        if (value == null) {
          value = false;
        }
        _this.view && (_this.view.renderGroup = value);
      }
    });
    INTERACTION_CALLBACKS.forEach(function (element) {
      Object.defineProperty(_this.props, element.toString(), {
        set: function set(value) {
          if (_this.props['_' + element] !== value) {
            _this.interactableCount += value ? 1 : -1;
            if (IS_MOUSE_INTERACTION_CALLBACKS[element]) {
              _this.mouseInteractableCount += value ? 1 : -1;
              _this.view && _this.view.setIsMouseInteractable(_this.mouseInteractableCount > 0);
            }
            if (element === 'onMove') {
              _this.receivesMoveEvent = !!value;
            }
            _this.view && _this.view.setIsInteractable(_this.interactableCount > 0);
            _this.view && _this.view.forceRaycastTest(_this.interactableCount > 0);
            _this.props['_' + element] = value;
          }
        }
      });
    });
    this.view = null;
  }

  babelHelpers.createClass(RCTBaseView, [{
    key: 'getTag',
    value: function getTag() {
      return this.tag;
    }
  }, {
    key: 'getIndexOf',
    value: function getIndexOf(child) {
      return this.children.indexOf(child);
    }
  }, {
    key: 'getParent',
    value: function getParent() {
      return this.parent;
    }
  }, {
    key: 'addChild',
    value: function addChild(index, child) {
      this.children.splice(index, 0, child);
      this.YGNode.insertChild(child.YGNode, index);
      this.view.add(child.view);
    }
  }, {
    key: 'setParent',
    value: function setParent(parent) {
      this.parent = parent;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(index) {
      this.view.remove(this.children[index].view);
      this.YGNode.removeChild(this.YGNode.getChild(index));
      this.children.splice(index, 1);
    }
  }, {
    key: 'getChild',
    value: function getChild(index) {
      return this.children[index];
    }
  }, {
    key: 'getChildCount',
    value: function getChildCount() {
      return this.children.length;
    }
  }, {
    key: 'makeDirty',
    value: function makeDirty() {
      var view = this;
      while (view) {
        view.isDirty = true;
        view = view.getParent();
      }
    }
  }, {
    key: 'receiveCommand',
    value: function receiveCommand(commandId, commandArgs) {
      var _this2 = this;

      switch (commandId) {
        case COMMAND_SET_IMMEDIATE_ON_TOUCH_END:
          var cancel = commandArgs.length < 4;
          if (cancel) {
            this.view && this.view.setImmediateListener(null);
          } else {
            var immediateEventType = commandArgs[0];
            var immediateTag = commandArgs[1];
            var immediateCommandId = commandArgs[2];
            var immediateCommandArgs = commandArgs[3];
            this.view && this.view.setImmediateListener({
              eventType: immediateEventType,
              callback: function callback() {
                return _this2.UIManager.dispatchViewManagerCommand(immediateTag, immediateCommandId, immediateCommandArgs);
              }
            });
          }
          break;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      RCTBaseView.disposeThreeJSObject(this.view);
      Yoga.Node.destroy(this.YGNode);
      this.view = null;
    }
  }, {
    key: 'frame',
    value: function frame() {
      if (this.style.opacity !== undefined) {
        this.view.setOpacity(this.style.opacity);
      }
    }
  }, {
    key: '_left',
    value: function _left(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPositionPercent(Yoga.EDGE_LEFT, parseFloat(value));
      } else {
        this.YGNode.setPosition(Yoga.EDGE_LEFT, value);
      }
    }
  }, {
    key: '_top',
    value: function _top(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPositionPercent(Yoga.EDGE_TOP, parseFloat(value));
      } else {
        this.YGNode.setPosition(Yoga.EDGE_TOP, value);
      }
    }
  }, {
    key: '_right',
    value: function _right(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPositionPercent(Yoga.EDGE_RIGHT, parseFloat(value));
      } else {
        this.YGNode.setPosition(Yoga.EDGE_RIGHT, value);
      }
    }
  }, {
    key: '_bottom',
    value: function _bottom(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPositionPercent(Yoga.EDGE_BOTTOM, parseFloat(value));
      } else {
        this.YGNode.setPosition(Yoga.EDGE_BOTTOM, value);
      }
    }
  }, {
    key: '_margin',
    value: function _margin(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_ALL, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_ALL, value);
      }
    }
  }, {
    key: '_marginVertical',
    value: function _marginVertical(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_VERTICAL, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_VERTICAL, value);
      }
    }
  }, {
    key: '_marginHorizontal',
    value: function _marginHorizontal(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_HORIZONTAL, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_HORIZONTAL, value);
      }
    }
  }, {
    key: '_marginTop',
    value: function _marginTop(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_TOP, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_TOP, value);
      }
    }
  }, {
    key: '_marginBottom',
    value: function _marginBottom(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_BOTTOM, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_BOTTOM, value);
      }
    }
  }, {
    key: '_marginLeft',
    value: function _marginLeft(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_LEFT, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_LEFT, value);
      }
    }
  }, {
    key: '_marginRight',
    value: function _marginRight(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMarginPercent(Yoga.EDGE_RIGHT, parseFloat(value));
      } else {
        this.YGNode.setMargin(Yoga.EDGE_RIGHT, value);
      }
    }
  }, {
    key: '_padding',
    value: function _padding(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_ALL, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_ALL, value);
      }
    }
  }, {
    key: '_paddingVertical',
    value: function _paddingVertical(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_VERTICAL, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_VERTICAL, value);
      }
    }
  }, {
    key: '_paddingHorizontal',
    value: function _paddingHorizontal(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_HORIZONTAL, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_HORIZONTAL, value);
      }
    }
  }, {
    key: '_paddingTop',
    value: function _paddingTop(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_TOP, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_TOP, value);
      }
    }
  }, {
    key: '_paddingBottom',
    value: function _paddingBottom(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_BOTTOM, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_BOTTOM, value);
      }
    }
  }, {
    key: '_paddingLeft',
    value: function _paddingLeft(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_LEFT, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_LEFT, value);
      }
    }
  }, {
    key: '_paddingRight',
    value: function _paddingRight(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setPaddingPercent(Yoga.EDGE_RIGHT, parseFloat(value));
      } else {
        this.YGNode.setPadding(Yoga.EDGE_RIGHT, value);
      }
    }
  }, {
    key: '_borderWidth',
    value: function _borderWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setBorder(Yoga.EDGE_ALL, value);
    }
  }, {
    key: '_borderTopWidth',
    value: function _borderTopWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setBorder(Yoga.EDGE_TOP, value);
    }
  }, {
    key: '_borderRightWidth',
    value: function _borderRightWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setBorder(Yoga.EDGE_RIGHT, value);
    }
  }, {
    key: '_borderBottomWidth',
    value: function _borderBottomWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setBorder(Yoga.EDGE_BOTTOM, value);
    }
  }, {
    key: '_borderLeftWidth',
    value: function _borderLeftWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setBorder(Yoga.EDGE_LEFT, value);
    }
  }, {
    key: '_position',
    value: function _position(value) {
      this.YGNode.setPositionType(value !== null ? MAP_CSS_POSITION[value] : 0);
    }
  }, {
    key: '_alignContent',
    value: function _alignContent(value) {
      this.YGNode.setAlignContent(value !== null ? MAP_CSS_ALIGN[value] : 0);
    }
  }, {
    key: '_alignItems',
    value: function _alignItems(value) {
      this.YGNode.setAlignItems(value !== null ? MAP_CSS_ALIGN[value] : 0);
    }
  }, {
    key: '_alignSelf',
    value: function _alignSelf(value) {
      this.YGNode.setAlignSelf(value !== null ? MAP_CSS_ALIGN[value] : 0);
    }
  }, {
    key: '_flexDirection',
    value: function _flexDirection(value) {
      this.YGNode.setFlexDirection(value !== null ? MAP_CSS_FLEX_DIRECTION[value] : Yoga.UNDEFINED);
    }
  }, {
    key: '_flexWrap',
    value: function _flexWrap(value) {
      this.YGNode.setFlexWrap(value !== null ? MAP_CSS_WRAP[value] : Yoga.UNDEFINED);
    }
  }, {
    key: '_justifyContent',
    value: function _justifyContent(value) {
      this.YGNode.setJustifyContent(value !== null ? MAP_CSS_JUSTIFY[value] : 0);
    }
  }, {
    key: '_overflow',
    value: function _overflow(value) {
      this.view.clippingEnabled = value === Yoga.OVERFLOW_HIDDEN;
      this.YGNode.setOverflow(value !== null ? MAP_CSS_OVERFLOW[value] : 0);
    }
  }, {
    key: '_display',
    value: function _display(value) {
      this.YGNode.setDisplay(value !== null ? MAP_CSS_DISPLAY[value] : 0);
    }
  }, {
    key: '_flex',
    value: function _flex(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setFlex(value);
    }
  }, {
    key: '_flexBasis',
    value: function _flexBasis(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setFlexBasisPercent(parseFloat(value));
      } else {
        this.YGNode.setFlexBasis(value);
      }
    }
  }, {
    key: '_flexGrow',
    value: function _flexGrow(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setFlexGrow(value);
    }
  }, {
    key: '_flexShrink',
    value: function _flexShrink(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setFlexShrink(value);
    }
  }, {
    key: '_width',
    value: function _width(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setWidthPercent(parseFloat(value));
      } else {
        this.YGNode.setWidth(value);
      }
    }
  }, {
    key: '_height',
    value: function _height(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setHeightPercent(parseFloat(value));
      } else {
        this.YGNode.setHeight(value);
      }
    }
  }, {
    key: '_minWidth',
    value: function _minWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMinWidthPercent(parseFloat(value));
      } else {
        this.YGNode.setMinWidth(value);
      }
    }
  }, {
    key: '_minHeight',
    value: function _minHeight(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMinHeightPercent(parseFloat(value));
      } else {
        this.YGNode.setMinHeight(value);
      }
    }
  }, {
    key: '_maxWidth',
    value: function _maxWidth(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMaxWidthPercent(parseFloat(value));
      } else {
        this.YGNode.setMaxWidth(value);
      }
    }
  }, {
    key: '_maxHeight',
    value: function _maxHeight(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      if (_isPercent(value)) {
        this.YGNode.setMaxHeightPercent(parseFloat(value));
      } else {
        this.YGNode.setMaxHeight(value);
      }
    }
  }, {
    key: '_aspectRatio',
    value: function _aspectRatio(value) {
      if (value === null) {
        value = Yoga.UNDEFINED;
      }
      this.YGNode.setAspectRatio(value);
    }
  }, {
    key: '_getBorderValue',
    value: function _getBorderValue(edge) {
      var value = this.YGNode.getBorder(edge);
      var allValue = this.YGNode.getBorder(Yoga.EDGE_ALL);
      return Number.isNaN(value) ? Number.isNaN(allValue) ? 0 : allValue : value;
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      var left = this.YGNode.getComputedLeft();
      var top = this.YGNode.getComputedTop();
      var width = this.YGNode.getComputedWidth();
      var height = this.YGNode.getComputedHeight();
      var x = -this.style.layoutOrigin[0] * width;
      var y = -this.style.layoutOrigin[1] * height;

      if (this.props.onLayout) {
        this.UIManager._rnctx.callFunction('RCTEventEmitter', 'receiveEvent', [this.getTag(), 'topLayout', {
          x: x + left,
          y: y + top,
          width: width,
          height: height
        }]);
      }

      if (this.style.transform) {
        this.view.setLocalTransform && this.view.setLocalTransform(this.style.transform);
      }
      this.view.visible = this.YGNode.getDisplay() !== Yoga.DISPLAY_NONE;
      this.view.setBorderWidth([this._getBorderValue(Yoga.EDGE_LEFT), this._getBorderValue(Yoga.EDGE_TOP), this._getBorderValue(Yoga.EDGE_RIGHT), this._getBorderValue(Yoga.EDGE_BOTTOM)]);
      this.view.setFrame && this.view.setFrame(x + left, -(y + top), width, height, this.UIManager._layoutAnimation);
      this.view.owner = this;
      if (this._borderRadiusDirty) {
        var borderRadius = (0, _isPositive2.default)(this._borderRadius) ? this._borderRadius : 0;
        this.view.setBorderRadius([(0, _isPositive2.default)(this._borderTopRightRadius) ? this._borderTopRightRadius : borderRadius, (0, _isPositive2.default)(this._borderTopLeftRadius) ? this._borderTopLeftRadius : borderRadius, (0, _isPositive2.default)(this._borderBottomLeftRadius) ? this._borderBottomLeftRadius : borderRadius, (0, _isPositive2.default)(this._borderBottomRightRadius) ? this._borderBottomRightRadius : borderRadius]);
        this._borderRadiusDirty = false;
      }
    }
  }], [{
    key: 'disposeThreeJSObject',
    value: function disposeThreeJSObject(node) {
      if (!node) {
        return;
      }
      if (node.geometry) {
        node.geometry.dispose();
        node.geometry = null;
      }

      if (node.material) {
        if (node.material.type === 'MultiMaterial') {
          for (var i in node.material.materials) {
            var mtr = node.material.materials[i];
            if (mtr.map) {
              mtr.map.dispose();
              mtr.map = null;
            }
            mtr.dispose();
          }
          node.material.materials = null;
        } else {
          if (node.material.map) {
            node.material.map.dispose();
            node.material.map = null;
          }
          node.material.dispose();
        }
      }
      for (var _i in node.children) {
        RCTBaseView.disposeThreeJSObject(node.children[_i]);
      }
      node.parent = null;
      node.children = [];
    }
  }, {
    key: 'describe',
    value: function describe() {
      return {
        NativeProps: {
          onLayout: 'function',
          onEnter: 'function',
          onExit: 'function',
          onInput: 'function',
          onChange: 'function',
          onHeadPose: 'function',
          onChangeCaptured: 'function',
          onInputCaptured: 'function',
          onHeadPoseCaptured: 'function',
          onMove: 'function'
        },
        Commands: {
          setImmediateOnTouchEnd: COMMAND_SET_IMMEDIATE_ON_TOUCH_END
        }
      };
    }
  }]);
  return RCTBaseView;
}();

exports.default = RCTBaseView;