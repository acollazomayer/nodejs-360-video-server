
'use strict';

var Dimensions = require('Dimensions');
var I18nManager = require('I18nManager');
var PixelRatio = require('PixelRatio');

var buildStyleInterpolator = require('buildStyleInterpolator');

var IS_RTL = I18nManager.isRTL;

var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var PIXEL_RATIO = PixelRatio.get();

var ToTheLeftIOS = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -SCREEN_WIDTH * 0.3, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  opacity: {
    value: 1.0,
    type: 'constant'
  }
};

var ToTheRightIOS = babelHelpers.extends({}, ToTheLeftIOS, {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: SCREEN_WIDTH * 0.3, y: 0, z: 0 }
  }
});

var FadeToTheLeft = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -Math.round(SCREEN_WIDTH * 0.3), y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },

  transformScale: {
    from: { x: 1, y: 1, z: 1 },
    to: { x: 0.95, y: 0.95, z: 1 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  opacity: {
    from: 1,
    to: 0.3,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  },
  translateX: {
    from: 0,
    to: -Math.round(SCREEN_WIDTH * 0.3),
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  scaleX: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  scaleY: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  }
};

var FadeToTheRight = babelHelpers.extends({}, FadeToTheLeft, {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: Math.round(SCREEN_WIDTH * 0.3), y: 0, z: 0 }
  },
  translateX: {
    from: 0,
    to: Math.round(SCREEN_WIDTH * 0.3)
  }
});

var FadeIn = {
  opacity: {
    from: 0,
    to: 1,
    min: 0.5,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var FadeOut = {
  opacity: {
    from: 1,
    to: 0,
    min: 0,
    max: 0.5,
    type: 'linear',
    extrapolate: false,
    round: 100
  }
};

var ToTheLeft = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: -SCREEN_WIDTH, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  opacity: {
    value: 1.0,
    type: 'constant'
  },

  translateX: {
    from: 0,
    to: -SCREEN_WIDTH,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
};

var ToTheRight = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: SCREEN_WIDTH, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  opacity: {
    value: 1.0,
    type: 'constant'
  },

  translateX: {
    from: 0,
    to: SCREEN_WIDTH,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
};

var ToTheUp = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: -SCREEN_HEIGHT, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  opacity: {
    value: 1.0,
    type: 'constant'
  },
  translateY: {
    from: 0,
    to: -SCREEN_HEIGHT,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
};

var ToTheDown = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: SCREEN_HEIGHT, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  opacity: {
    value: 1.0,
    type: 'constant'
  },
  translateY: {
    from: 0,
    to: SCREEN_HEIGHT,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
};

var FromTheRight = {
  opacity: {
    value: 1.0,
    type: 'constant'
  },

  transformTranslate: {
    from: { x: SCREEN_WIDTH, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },

  translateX: {
    from: SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },

  scaleX: {
    value: 1,
    type: 'constant'
  },
  scaleY: {
    value: 1,
    type: 'constant'
  }
};

var FromTheLeft = babelHelpers.extends({}, FromTheRight, {
  transformTranslate: {
    from: { x: -SCREEN_WIDTH, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  translateX: {
    from: -SCREEN_WIDTH,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
});

var FromTheDown = babelHelpers.extends({}, FromTheRight, {
  transformTranslate: {
    from: { y: SCREEN_HEIGHT, x: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  translateY: {
    from: SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
});

var FromTheTop = babelHelpers.extends({}, FromTheRight, {
  transformTranslate: {
    from: { y: -SCREEN_HEIGHT, x: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  translateY: {
    from: -SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
});

var ToTheBack = {
  transformTranslate: {
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  transformScale: {
    from: { x: 1, y: 1, z: 1 },
    to: { x: 0.95, y: 0.95, z: 1 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  opacity: {
    from: 1,
    to: 0.3,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  },
  scaleX: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  },
  scaleY: {
    from: 1,
    to: 0.95,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true
  }
};

var FromTheFront = {
  opacity: {
    value: 1.0,
    type: 'constant'
  },

  transformTranslate: {
    from: { x: 0, y: SCREEN_HEIGHT, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  translateY: {
    from: SCREEN_HEIGHT,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  scaleX: {
    value: 1,
    type: 'constant'
  },
  scaleY: {
    value: 1,
    type: 'constant'
  }
};

var ToTheBackAndroid = {
  opacity: {
    value: 1,
    type: 'constant'
  }
};

var FromTheFrontAndroid = {
  opacity: {
    from: 0,
    to: 1,
    min: 0.5,
    max: 1,
    type: 'linear',
    extrapolate: false,
    round: 100
  },
  transformTranslate: {
    from: { x: 0, y: 100, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  },
  translateY: {
    from: 100,
    to: 0,
    min: 0,
    max: 1,
    type: 'linear',
    extrapolate: true,
    round: PIXEL_RATIO
  }
};

var BaseOverswipeConfig = {
  frictionConstant: 1,
  frictionByDistance: 1.5
};

var BaseLeftToRightGesture = {
  isDetachable: false,

  gestureDetectMovement: 2,

  notMoving: 0.3,

  directionRatio: 0.66,

  snapVelocity: 2,

  edgeHitWidth: 30,

  stillCompletionRatio: 3 / 5,

  fullDistance: SCREEN_WIDTH,

  direction: 'left-to-right'

};

var BaseRightToLeftGesture = babelHelpers.extends({}, BaseLeftToRightGesture, {
  direction: 'right-to-left'
});

var BaseDownUpGesture = babelHelpers.extends({}, BaseLeftToRightGesture, {
  fullDistance: SCREEN_HEIGHT,
  direction: 'bottom-to-top'
});

var BaseUpDownGesture = babelHelpers.extends({}, BaseLeftToRightGesture, {
  fullDistance: SCREEN_HEIGHT,
  direction: 'top-to-bottom'
});

var directionMapping = {
  ToTheStartIOS: ToTheLeftIOS,
  ToTheEndIOS: ToTheRightIOS,
  FadeToTheStart: FadeToTheLeft,
  FadeToTheEnd: FadeToTheRight,
  ToTheStart: ToTheLeft,
  ToTheEnd: ToTheRight,
  FromTheStart: FromTheLeft,
  FromTheEnd: FromTheRight,
  BaseStartToEndGesture: BaseLeftToRightGesture,
  BaseEndToStartGesture: BaseRightToLeftGesture
};

if (IS_RTL) {
  directionMapping = {
    ToTheStartIOS: ToTheRightIOS,
    ToTheEndIOS: ToTheLeftIOS,
    FadeToTheStart: FadeToTheRight,
    FadeToTheEnd: FadeToTheLeft,
    ToTheStart: ToTheRight,
    ToTheEnd: ToTheLeft,
    FromTheStart: FromTheRight,
    FromTheEnd: FromTheLeft,
    BaseStartToEndGesture: BaseRightToLeftGesture,
    BaseEndToStartGesture: BaseLeftToRightGesture
  };
}

var BaseConfig = {
  gestures: {
    pop: directionMapping.BaseStartToEndGesture
  },

  springFriction: 26,
  springTension: 200,

  defaultTransitionVelocity: 1.5,

  animationInterpolators: {
    into: buildStyleInterpolator(directionMapping.FromTheEnd),
    out: buildStyleInterpolator(directionMapping.FadeToTheStart)
  }
};

var NavigatorSceneConfigs = {
  PushFromRight: babelHelpers.extends({}, BaseConfig, {
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheEnd),
      out: buildStyleInterpolator(directionMapping.ToTheStartIOS)
    }
  }),
  PushFromLeft: babelHelpers.extends({}, BaseConfig, {
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEndIOS)
    }
  }),
  FloatFromRight: babelHelpers.extends({}, BaseConfig),
  FloatFromLeft: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      pop: directionMapping.BaseEndToStartGesture
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.FadeToTheEnd)
    }
  }),
  FloatFromBottom: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      pop: babelHelpers.extends({}, directionMapping.BaseStartToEndGesture, {
        edgeHitWidth: 150,
        direction: 'top-to-bottom',
        fullDistance: SCREEN_HEIGHT
      })
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheFront),
      out: buildStyleInterpolator(ToTheBack)
    }
  }),
  FloatFromBottomAndroid: babelHelpers.extends({}, BaseConfig, {
    gestures: null,
    defaultTransitionVelocity: 3,
    springFriction: 20,
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheFrontAndroid),
      out: buildStyleInterpolator(ToTheBackAndroid)
    }
  }),
  FadeAndroid: babelHelpers.extends({}, BaseConfig, {
    gestures: null,
    animationInterpolators: {
      into: buildStyleInterpolator(FadeIn),
      out: buildStyleInterpolator(FadeOut)
    }
  }),
  SwipeFromLeft: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      })
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEnd)
    }
  }),
  HorizontalSwipeJump: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      })
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheEnd),
      out: buildStyleInterpolator(directionMapping.ToTheStart)
    }
  }),
  HorizontalSwipeJumpFromRight: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      pop: directionMapping.BaseEndToStartGesture
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.FadeToTheEnd)
    }
  }),
  HorizontalSwipeJumpFromLeft: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, directionMapping.BaseEndToStartGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, directionMapping.BaseStartToEndGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      pop: directionMapping.BaseEndToStartGesture
    },
    animationInterpolators: {
      into: buildStyleInterpolator(directionMapping.FromTheStart),
      out: buildStyleInterpolator(directionMapping.ToTheEnd)
    }
  }),
  VerticalUpSwipeJump: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, BaseUpDownGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, BaseDownUpGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      })
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheDown),
      out: buildStyleInterpolator(ToTheUp)
    }
  }),
  VerticalDownSwipeJump: babelHelpers.extends({}, BaseConfig, {
    gestures: {
      jumpBack: babelHelpers.extends({}, BaseDownUpGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      }),
      jumpForward: babelHelpers.extends({}, BaseUpDownGesture, {
        overswipe: BaseOverswipeConfig,
        edgeHitWidth: null,
        isDetachable: true
      })
    },
    animationInterpolators: {
      into: buildStyleInterpolator(FromTheTop),
      out: buildStyleInterpolator(ToTheDown)
    }
  })
};

module.exports = NavigatorSceneConfigs;