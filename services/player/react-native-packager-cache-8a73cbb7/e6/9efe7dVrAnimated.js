
'use strict';

var AnimatedImplementation = require('AnimatedImplementation');
var processColor = require('processColor');
var Pano = require('Pano');

var AnimatedValueArray = function (_AnimatedImplementati) {
  babelHelpers.inherits(AnimatedValueArray, _AnimatedImplementati);

  function AnimatedValueArray(valueArray) {
    babelHelpers.classCallCheck(this, AnimatedValueArray);

    var _this = babelHelpers.possibleConstructorReturn(this, (AnimatedValueArray.__proto__ || Object.getPrototypeOf(AnimatedValueArray)).call(this));

    _this._array = valueArray;
    return _this;
  }

  babelHelpers.createClass(AnimatedValueArray, [{
    key: 'getArrayElement',
    value: function getArrayElement(index) {
      return this._array[index];
    }
  }, {
    key: '__getValue',
    value: function __getValue() {
      return this._array.map(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          return value.__getValue();
        } else {
          return value;
        }
      });
    }
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      return this._array.map(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          return value.__getAnimatedValue();
        } else {
          return value;
        }
      });
    }
  }, {
    key: '__attach',
    value: function __attach() {
      var _this2 = this;

      this._array.forEach(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          value.__addChild(_this2);
        }
      });
    }
  }, {
    key: '__detach',
    value: function __detach() {
      var _this3 = this;

      this._array.forEach(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          value.__removeChild(_this3);
        }
      });
    }
  }]);
  return AnimatedValueArray;
}(AnimatedImplementation.ValueComposite);

var ColorArrayFromHexARGB = function ColorArrayFromHexARGB(hex) {
  hex = Math.floor(hex);
  return [(hex >> 24 & 255) / 255, (hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (hex & 255) / 255];
};

var ColorArrayToHexRGBA = function ColorArrayToHexRGBA(color) {
  return (color[1] * 255 << 24 ^ color[2] * 255 << 16 ^ color[3] * 255 << 8 ^ color[0] * 255 << 0) >>> 0;
};

var AnimatedValueColor = function (_AnimatedImplementati2) {
  babelHelpers.inherits(AnimatedValueColor, _AnimatedImplementati2);

  function AnimatedValueColor(color) {
    babelHelpers.classCallCheck(this, AnimatedValueColor);

    var _this4 = babelHelpers.possibleConstructorReturn(this, (AnimatedValueColor.__proto__ || Object.getPrototypeOf(AnimatedValueColor)).call(this));

    var colorArray = ColorArrayFromHexARGB(processColor(color));
    _this4._color = colorArray.map(function (value) {
      return new AnimatedImplementation.Value(value);
    });
    return _this4;
  }

  babelHelpers.createClass(AnimatedValueColor, [{
    key: 'setValue',
    value: function setValue(color) {
      var colorArray = ColorArrayFromHexARGB(processColor(color));
      for (var i = 0; i < colorArray.length; i++) {
        this._color[i].setValue(colorArray[i]);
      }
    }
  }, {
    key: 'getColor',
    value: function getColor(index) {
      return this._color;
    }
  }, {
    key: '__getValue',
    value: function __getValue() {
      var colorArray = this._color.map(function (value) {
        return value.__getValue();
      });
      return ColorArrayToHexRGBA(colorArray);
    }
  }, {
    key: '__getAnimatedValue',
    value: function __getAnimatedValue() {
      var colorArray = this._color.map(function (value) {
        return value.__getAnimatedValue();
      });
      return ColorArrayToHexRGBA(colorArray);
    }
  }, {
    key: '__attach',
    value: function __attach() {
      var _this5 = this;

      this._color.forEach(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          value.__addChild(_this5);
        }
      });
    }
  }, {
    key: '__detach',
    value: function __detach() {
      var _this6 = this;

      this._color.forEach(function (value) {
        if (value instanceof AnimatedImplementation.ValueBase) {
          value.__removeChild(_this6);
        }
      });
    }
  }]);
  return AnimatedValueColor;
}(AnimatedImplementation.ValueComposite);

var colorAnim = function colorAnim(value, config, anim) {
  var toValueArray = config.toValue ? ColorArrayFromHexARGB(processColor(config.toValue)) : undefined;
  var color = value.getColor();
  var ainmArray = [];
  for (var i = 0; i < color.length; i++) {
    var colorConfig = babelHelpers.extends({}, config);
    if (toValueArray) {
      colorConfig.toValue = toValueArray[i];
    }
    ainmArray.push(anim(color[i], colorConfig));
  }
  return AnimatedImplementation.parallel(ainmArray, { stopTogether: false });
};

var colorSpring = function colorSpring(value, config) {
  return colorAnim(value, config, AnimatedImplementation.spring);
};

var colorTiming = function colorTiming(value, config) {
  return colorAnim(value, config, AnimatedImplementation.timing);
};

var colorDecay = function colorDecay(value, config) {
  return colorAnim(value, config, AnimatedImplementation.decay);
};

module.exports = {
  Pano: AnimatedImplementation.createAnimatedComponent(Pano),

  ValueArray: AnimatedValueArray,
  ValueColor: AnimatedValueColor,

  colorSpring: colorSpring,
  colorTiming: colorTiming,
  colorDecay: colorDecay
};