
'use strict';

var _require = require('React'),
    PropTypes = _require.PropTypes;

var UIManager = require('UIManager');

var createStrictShapeTypeChecker = require('createStrictShapeTypeChecker');
var keyMirror = require('fbjs/lib/keyMirror');

var TypesEnum = {
  spring: true,
  linear: true,
  easeInEaseOut: true,
  easeIn: true,
  easeOut: true,
  keyboard: true
};
var Types = keyMirror(TypesEnum);

var PropertiesEnum = {
  opacity: true,
  scaleXY: true
};
var Properties = keyMirror(PropertiesEnum);

var animChecker = createStrictShapeTypeChecker({
  duration: PropTypes.number,
  delay: PropTypes.number,
  springDamping: PropTypes.number,
  initialVelocity: PropTypes.number,
  type: PropTypes.oneOf(Object.keys(Types)).isRequired,
  property: PropTypes.oneOf(Object.keys(Properties))
});

var configChecker = createStrictShapeTypeChecker({
  duration: PropTypes.number.isRequired,
  create: animChecker,
  update: animChecker,
  delete: animChecker
});

function configureNext(config, onAnimationDidEnd) {
  configChecker({ config: config }, 'config', 'LayoutAnimation.configureNext');
  UIManager.configureNextLayoutAnimation(config, onAnimationDidEnd || function () {}, function () {});
}

function create(duration, type, creationProp) {
  return {
    duration: duration,
    create: {
      type: type,
      property: creationProp
    },
    update: {
      type: type
    },
    delete: {
      type: type,
      property: creationProp
    }
  };
}

var Presets = {
  easeInEaseOut: create(300, Types.easeInEaseOut, Properties.opacity),
  linear: create(500, Types.linear, Properties.opacity),
  spring: {
    duration: 700,
    create: {
      type: Types.linear,
      property: Properties.opacity
    },
    update: {
      type: Types.spring,
      springDamping: 0.4
    },
    delete: {
      type: Types.linear,
      property: Properties.opacity
    }
  }
};

var LayoutAnimation = {
  configureNext: configureNext,

  create: create,
  Types: Types,
  Properties: Properties,
  configChecker: configChecker,
  Presets: Presets,
  easeInEaseOut: configureNext.bind(null, Presets.easeInEaseOut),
  linear: configureNext.bind(null, Presets.linear),
  spring: configureNext.bind(null, Presets.spring)
};

module.exports = LayoutAnimation;