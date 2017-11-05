Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BaseView = require('./BaseView');

var _BaseView2 = babelHelpers.interopRequireDefault(_BaseView);

var _merge = require('../Utils/merge');

var _merge2 = babelHelpers.interopRequireDefault(_merge);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var ALIGN_MAP = {
  auto: 'left',
  left: 'left',
  right: 'right',
  center: 'center_line',
  justify: 'left'
};

var ALIGN_VERTICAL_MAP = {
  auto: 'top',
  top: 'top',
  bottom: 'bottom',
  center: 'center'
};

var NAMED_FONT_WEIGHT = {
  normal: 200,
  bold: 600
};

function snapUp(value, step) {
  var inv = 1.0 / step;
  return Math.ceil(value * inv) / inv;
}

var RCTText = function (_RCTBaseView) {
  babelHelpers.inherits(RCTText, _RCTBaseView);

  function RCTText(guiSys) {
    babelHelpers.classCallCheck(this, RCTText);

    var _this = babelHelpers.possibleConstructorReturn(this, (RCTText.__proto__ || Object.getPrototypeOf(RCTText)).call(this));

    _this.view = new OVRUI.UIView(guiSys);
    _this.view.clippingEnabled = true;
    _this.guiSys = guiSys;
    _this.isTextNode = true;
    _this._textDirty = true;
    _this._visualTextDirty = true;
    _this._fontBorderSize = 0;
    _this._fontWeight = 0;
    _this._isOnLayer = false;
    _this.textChildren = [];

    _this.YGNode.setMeasureFunc(function (width, widthMeasureMode, height, heightMeasureMode) {
      return _this.measure(width, widthMeasureMode, height, heightMeasureMode);
    });

    Object.defineProperty(_this.props, 'numberOfLines', {
      set: function set(value) {
        if (value === null) {
          value = 0;
        }
        _this.props._numberOfLines = value;
        _this._textDirty = true;
        _this.markTextDirty();
        _this.makeDirty();
      }
    });
    Object.defineProperty(_this.props, 'isOnLayer', {
      set: function set(value) {
        if (value === null) {
          value = false;
        }
        _this._isOnLayer = value;
        _this.view.clippingEnabled = value;
        _this._textDirty = true;
        _this.markTextDirty();
        _this.makeDirty();
      }
    });
    Object.defineProperty(_this.props, 'hitSlop', {
      set: function set(value) {
        if (value === null) {
          value = 0;
        }
        if (typeof value === 'number') {
          _this.view.setHitSlop(value, value, value, value);
        } else {
          _this.view.setHitSlop(value.left, value.top, value.right, value.bottom);
        }
      }
    });

    Object.defineProperty(_this.style, 'color', {
      set: function set(value) {
        if (value === null) {
          value = 0xffffffff;
        }
        _this.style._textColor = value;
        _this.markTextDirty();
        _this.makeDirty();
      }
    });
    Object.defineProperty(_this.style, 'fontSize', {
      set: function set(value) {
        if (value === null) {
          value = 0.1;
        }
        _this.view.setTextSize(value);
        _this._fontSize = value;
        _this._textDirty = true;
        _this.markTextDirty();
        _this.makeDirty();
      },
      get: function get() {
        return _this._fontSize;
      }
    });

    Object.defineProperty(_this.style, 'fontWeight', {
      set: function set(value) {
        if (value === null) {
          value = 'normal';
        }

        var namedWeight = NAMED_FONT_WEIGHT[value];
        var intValue = parseInt(namedWeight ? namedWeight : value, 10);
        _this._fontWeight = intValue;

        _this.view.setTextAlphaCenter(0.54 - _this._fontBorderSize - _this._fontWeight / 10000.0);
        _this.view.setTextColorCenter(0.54 - _this._fontWeight / 10000.0);
      }
    });
    Object.defineProperty(_this.style, 'textShadowRadius', {
      set: function set(value) {
        if (value === null) {
          value = 0;
        }
        _this._fontBorderSize = value;
        _this.view.setTextAlphaCenter(0.54 - _this._fontBorderSize - _this._fontWeight / 10000.0);
        _this.view.setTextColorCenter(0.54 - _this._fontWeight / 10000.0);
      }
    });
    Object.defineProperty(_this.style, 'textAlign', {
      set: function set(value) {
        if (value === null) {
          value = 'auto';
        }
        _this.markTextDirty();
        _this.view.setTextHAlign(ALIGN_MAP[value]);
      }
    });
    Object.defineProperty(_this.style, 'textAlignVertical', {
      set: function set(value) {
        if (value === null) {
          value = 'auto';
        }
        _this.markTextDirty();
        _this.view.setTextVAlign(ALIGN_VERTICAL_MAP[value]);
      }
    });

    _this.style.fontWeight = '200';
    _this.style.fontSize = 0.1;
    _this.style.textAlign = 'auto';
    _this.style.textAlignVertical = 'auto';
    _this.props.numberOfLines = 0;

    _this.style._textColor = undefined;
    return _this;
  }

  babelHelpers.createClass(RCTText, [{
    key: 'measure',
    value: function measure(width, widthMeasureMode, height, heightMeasureMode) {
      var text = this.getText(this.style._textColor || 0xffffffff);
      if (text) {
        if (widthMeasureMode !== Yoga.MEASURE_MODE_EXACTLY || heightMeasureMode !== Yoga.MEASURE_MODE_EXACTLY) {
          var wordWrapped = void 0;
          if (widthMeasureMode !== Yoga.MEASURE_MODE_UNDEFINED) {
            wordWrapped = OVRUI.wrapLines(this.guiSys.font, text, this._fontSize, width, undefined, this.props._numberOfLines);
          } else {
            wordWrapped = text;
          }
          var dim = OVRUI.measureText(this.guiSys.font, wordWrapped, this._fontSize);
          if (widthMeasureMode !== Yoga.MEASURE_MODE_EXACTLY) {
            width = dim.maxWidth;
          }
          if (heightMeasureMode !== Yoga.MEASURE_MODE_EXACTLY) {
            height = dim.maxHeight;
          }

          var snap = this._fontSize / 100;
          width = snapUp(width, snap);
          height = snapUp(height, snap);
        }
      } else {
        width = width || 0;
        height = height || 0;
      }
      return {
        width: width,
        height: height
      };
    }
  }, {
    key: 'addChild',
    value: function addChild(index, child) {
      this.makeDirty();
      this.textChildren.splice(index, 0, child);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(index) {
      this.makeDirty();
      this.textChildren.splice(index, 1);
    }
  }, {
    key: 'getText',
    value: function getText(parentTextColor) {
      if (!this._textDirty) {
        return this._text;
      }
      var textColor = this.style._textColor ? this.style._textColor : parentTextColor;
      var allText = '';
      for (var i = 0; i < this.textChildren.length; i++) {
        var child = this.textChildren[i];
        if (child.isRawText && child.props.text && child.props.text.length) {
          allText += String.fromCharCode(OVRUI.SDFFONT_MARKER_COLOR) + String.fromCharCode(textColor >> 16 & 0xff) + String.fromCharCode(textColor >> 8 & 0xff) + String.fromCharCode(textColor >> 0 & 0xff) + String.fromCharCode(textColor >> 24 & 0xff) + child.props.text;
        } else if (child.isTextNode) {
          allText += child.getText(textColor);
        }
      }
      this._text = allText;
      this._textDirty = false;

      this._visualTextDirty = true;
      return this._text;
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout() {
      babelHelpers.get(RCTText.prototype.__proto__ || Object.getPrototypeOf(RCTText.prototype), 'presentLayout', this).call(this, this);
      var val = this.YGNode.getBorder(Yoga.Left);
      this.view.setBorderWidth(Number.isNaN(val) ? 0 : val);
      if (this._textDirty || this._visualTextDirty || this.YGNode.getComputedWidth() !== this.previousWidth || this.YGNode.getComputedHeight() !== this.previousHeight) {
        var wordWrapped = OVRUI.wrapLines(this.guiSys.font, this.getText(this.style._textColor || 0xffffffff), this._fontSize, this.YGNode.getComputedWidth(), this.YGNode.getComputedHeight(), this.props._lineCount, this._isOnLayer);
        this.view.setText(wordWrapped);
        this._visualTextDirty = false;
        this.previousWidth = this.YGNode.getComputedWidth();
        this.previousHeight = this.YGNode.getComputedHeight();
      }
    }
  }, {
    key: 'markTextDirty',
    value: function markTextDirty() {
      this.YGNode.markDirty();
      this._textDirty = true;
    }
  }], [{
    key: 'describe',
    value: function describe() {
      return (0, _merge2.default)(babelHelpers.get(RCTText.__proto__ || Object.getPrototypeOf(RCTText), 'describe', this).call(this), {
        NativeProps: {
          numberOfLines: 'number',
          hitSlop: 'number',
          isOnLayer: 'number'
        }
      });
    }
  }]);
  return RCTText;
}(_BaseView2.default);

exports.default = RCTText;