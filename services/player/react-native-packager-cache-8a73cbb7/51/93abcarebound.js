

(function () {
  var rebound = {};
  var util = rebound.util = {};
  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  util.bind = function bind(func, context) {
    var args = slice.call(arguments, 2);
    return function () {
      func.apply(context, concat.call(args, slice.call(arguments)));
    };
  };

  util.extend = function extend(target, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  };

  var SpringSystem = rebound.SpringSystem = function SpringSystem(looper) {
    this._springRegistry = {};
    this._activeSprings = [];
    this.listeners = [];
    this._idleSpringIndices = [];
    this.looper = looper || new AnimationLooper();
    this.looper.springSystem = this;
  };

  util.extend(SpringSystem.prototype, {

    _springRegistry: null,

    _isIdle: true,

    _lastTimeMillis: -1,

    _activeSprings: null,

    listeners: null,

    _idleSpringIndices: null,

    setLooper: function setLooper(looper) {
      this.looper = looper;
      looper.springSystem = this;
    },

    createSpring: function createSpring(tension, friction) {
      var springConfig;
      if (tension === undefined || friction === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromOrigamiTensionAndFriction(tension, friction);
      }
      return this.createSpringWithConfig(springConfig);
    },

    createSpringWithBouncinessAndSpeed: function createSpringWithBouncinessAndSpeed(bounciness, speed) {
      var springConfig;
      if (bounciness === undefined || speed === undefined) {
        springConfig = SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG;
      } else {
        springConfig = SpringConfig.fromBouncinessAndSpeed(bounciness, speed);
      }
      return this.createSpringWithConfig(springConfig);
    },

    createSpringWithConfig: function createSpringWithConfig(springConfig) {
      var spring = new Spring(this);
      this.registerSpring(spring);
      spring.setSpringConfig(springConfig);
      return spring;
    },

    getIsIdle: function getIsIdle() {
      return this._isIdle;
    },

    getSpringById: function getSpringById(id) {
      return this._springRegistry[id];
    },

    getAllSprings: function getAllSprings() {
      var vals = [];
      for (var id in this._springRegistry) {
        if (this._springRegistry.hasOwnProperty(id)) {
          vals.push(this._springRegistry[id]);
        }
      }
      return vals;
    },

    registerSpring: function registerSpring(spring) {
      this._springRegistry[spring.getId()] = spring;
    },

    deregisterSpring: function deregisterSpring(spring) {
      removeFirst(this._activeSprings, spring);
      delete this._springRegistry[spring.getId()];
    },

    advance: function advance(time, deltaTime) {
      while (this._idleSpringIndices.length > 0) {
        this._idleSpringIndices.pop();
      }for (var i = 0, len = this._activeSprings.length; i < len; i++) {
        var spring = this._activeSprings[i];
        if (spring.systemShouldAdvance()) {
          spring.advance(time / 1000.0, deltaTime / 1000.0);
        } else {
          this._idleSpringIndices.push(this._activeSprings.indexOf(spring));
        }
      }
      while (this._idleSpringIndices.length > 0) {
        var idx = this._idleSpringIndices.pop();
        idx >= 0 && this._activeSprings.splice(idx, 1);
      }
    },

    loop: function loop(currentTimeMillis) {
      var listener;
      if (this._lastTimeMillis === -1) {
        this._lastTimeMillis = currentTimeMillis - 1;
      }
      var ellapsedMillis = currentTimeMillis - this._lastTimeMillis;
      this._lastTimeMillis = currentTimeMillis;

      var i = 0,
          len = this.listeners.length;
      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onBeforeIntegrate && listener.onBeforeIntegrate(this);
      }

      this.advance(currentTimeMillis, ellapsedMillis);
      if (this._activeSprings.length === 0) {
        this._isIdle = true;
        this._lastTimeMillis = -1;
      }

      for (i = 0; i < len; i++) {
        listener = this.listeners[i];
        listener.onAfterIntegrate && listener.onAfterIntegrate(this);
      }

      if (!this._isIdle) {
        this.looper.run();
      }
    },

    activateSpring: function activateSpring(springId) {
      var spring = this._springRegistry[springId];
      if (this._activeSprings.indexOf(spring) == -1) {
        this._activeSprings.push(spring);
      }
      if (this.getIsIdle()) {
        this._isIdle = false;
        this.looper.run();
      }
    },

    addListener: function addListener(listener) {
      this.listeners.push(listener);
    },

    removeListener: function removeListener(listener) {
      removeFirst(this.listeners, listener);
    },

    removeAllListeners: function removeAllListeners() {
      this.listeners = [];
    }

  });

  var Spring = rebound.Spring = function Spring(springSystem) {
    this._id = 's' + Spring._ID++;
    this._springSystem = springSystem;
    this.listeners = [];
    this._currentState = new PhysicsState();
    this._previousState = new PhysicsState();
    this._tempState = new PhysicsState();
  };

  util.extend(Spring, {
    _ID: 0,

    MAX_DELTA_TIME_SEC: 0.064,

    SOLVER_TIMESTEP_SEC: 0.001

  });

  util.extend(Spring.prototype, {

    _id: 0,

    _springConfig: null,

    _overshootClampingEnabled: false,

    _currentState: null,

    _previousState: null,

    _tempState: null,

    _startValue: 0,

    _endValue: 0,

    _wasAtRest: true,

    _restSpeedThreshold: 0.001,

    _displacementFromRestThreshold: 0.001,

    listeners: null,

    _timeAccumulator: 0,

    _springSystem: null,

    destroy: function destroy() {
      this.listeners = [];
      this.frames = [];
      this._springSystem.deregisterSpring(this);
    },

    getId: function getId() {
      return this._id;
    },

    setSpringConfig: function setSpringConfig(springConfig) {
      this._springConfig = springConfig;
      return this;
    },

    getSpringConfig: function getSpringConfig() {
      return this._springConfig;
    },

    setCurrentValue: function setCurrentValue(currentValue, skipSetAtRest) {
      this._startValue = currentValue;
      this._currentState.position = currentValue;
      if (!skipSetAtRest) {
        this.setAtRest();
      }
      this.notifyPositionUpdated(false, false);
      return this;
    },

    getStartValue: function getStartValue() {
      return this._startValue;
    },

    getCurrentValue: function getCurrentValue() {
      return this._currentState.position;
    },

    getCurrentDisplacementDistance: function getCurrentDisplacementDistance() {
      return this.getDisplacementDistanceForState(this._currentState);
    },

    getDisplacementDistanceForState: function getDisplacementDistanceForState(state) {
      return Math.abs(this._endValue - state.position);
    },

    setEndValue: function setEndValue(endValue) {
      if (this._endValue == endValue && this.isAtRest()) {
        return this;
      }
      this._startValue = this.getCurrentValue();
      this._endValue = endValue;
      this._springSystem.activateSpring(this.getId());
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        var onChange = listener.onSpringEndStateChange;
        onChange && onChange(this);
      }
      return this;
    },

    getEndValue: function getEndValue() {
      return this._endValue;
    },

    setVelocity: function setVelocity(velocity) {
      if (velocity === this._currentState.velocity) {
        return this;
      }
      this._currentState.velocity = velocity;
      this._springSystem.activateSpring(this.getId());
      return this;
    },

    getVelocity: function getVelocity() {
      return this._currentState.velocity;
    },

    setRestSpeedThreshold: function setRestSpeedThreshold(restSpeedThreshold) {
      this._restSpeedThreshold = restSpeedThreshold;
      return this;
    },

    getRestSpeedThreshold: function getRestSpeedThreshold() {
      return this._restSpeedThreshold;
    },

    setRestDisplacementThreshold: function setRestDisplacementThreshold(displacementFromRestThreshold) {
      this._displacementFromRestThreshold = displacementFromRestThreshold;
    },

    getRestDisplacementThreshold: function getRestDisplacementThreshold() {
      return this._displacementFromRestThreshold;
    },

    setOvershootClampingEnabled: function setOvershootClampingEnabled(enabled) {
      this._overshootClampingEnabled = enabled;
      return this;
    },

    isOvershootClampingEnabled: function isOvershootClampingEnabled() {
      return this._overshootClampingEnabled;
    },

    isOvershooting: function isOvershooting() {
      var start = this._startValue;
      var end = this._endValue;
      return this._springConfig.tension > 0 && (start < end && this.getCurrentValue() > end || start > end && this.getCurrentValue() < end);
    },

    advance: function advance(time, realDeltaTime) {
      var isAtRest = this.isAtRest();

      if (isAtRest && this._wasAtRest) {
        return;
      }

      var adjustedDeltaTime = realDeltaTime;
      if (realDeltaTime > Spring.MAX_DELTA_TIME_SEC) {
        adjustedDeltaTime = Spring.MAX_DELTA_TIME_SEC;
      }

      this._timeAccumulator += adjustedDeltaTime;

      var tension = this._springConfig.tension,
          friction = this._springConfig.friction,
          position = this._currentState.position,
          velocity = this._currentState.velocity,
          tempPosition = this._tempState.position,
          tempVelocity = this._tempState.velocity,
          aVelocity,
          aAcceleration,
          bVelocity,
          bAcceleration,
          cVelocity,
          cAcceleration,
          dVelocity,
          dAcceleration,
          dxdt,
          dvdt;

      while (this._timeAccumulator >= Spring.SOLVER_TIMESTEP_SEC) {

        this._timeAccumulator -= Spring.SOLVER_TIMESTEP_SEC;

        if (this._timeAccumulator < Spring.SOLVER_TIMESTEP_SEC) {
          this._previousState.position = position;
          this._previousState.velocity = velocity;
        }

        aVelocity = velocity;
        aAcceleration = tension * (this._endValue - tempPosition) - friction * velocity;

        tempPosition = position + aVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + aAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        bVelocity = tempVelocity;
        bAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;

        tempPosition = position + bVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + bAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        cVelocity = tempVelocity;
        cAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;

        tempPosition = position + cVelocity * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        tempVelocity = velocity + cAcceleration * Spring.SOLVER_TIMESTEP_SEC * 0.5;
        dVelocity = tempVelocity;
        dAcceleration = tension * (this._endValue - tempPosition) - friction * tempVelocity;

        dxdt = 1.0 / 6.0 * (aVelocity + 2.0 * (bVelocity + cVelocity) + dVelocity);
        dvdt = 1.0 / 6.0 * (aAcceleration + 2.0 * (bAcceleration + cAcceleration) + dAcceleration);

        position += dxdt * Spring.SOLVER_TIMESTEP_SEC;
        velocity += dvdt * Spring.SOLVER_TIMESTEP_SEC;
      }

      this._tempState.position = tempPosition;
      this._tempState.velocity = tempVelocity;

      this._currentState.position = position;
      this._currentState.velocity = velocity;

      if (this._timeAccumulator > 0) {
        this._interpolate(this._timeAccumulator / Spring.SOLVER_TIMESTEP_SEC);
      }

      if (this.isAtRest() || this._overshootClampingEnabled && this.isOvershooting()) {

        if (this._springConfig.tension > 0) {
          this._startValue = this._endValue;
          this._currentState.position = this._endValue;
        } else {
          this._endValue = this._currentState.position;
          this._startValue = this._endValue;
        }
        this.setVelocity(0);
        isAtRest = true;
      }

      var notifyActivate = false;
      if (this._wasAtRest) {
        this._wasAtRest = false;
        notifyActivate = true;
      }

      var notifyAtRest = false;
      if (isAtRest) {
        this._wasAtRest = true;
        notifyAtRest = true;
      }

      this.notifyPositionUpdated(notifyActivate, notifyAtRest);
    },

    notifyPositionUpdated: function notifyPositionUpdated(notifyActivate, notifyAtRest) {
      for (var i = 0, len = this.listeners.length; i < len; i++) {
        var listener = this.listeners[i];
        if (notifyActivate && listener.onSpringActivate) {
          listener.onSpringActivate(this);
        }

        if (listener.onSpringUpdate) {
          listener.onSpringUpdate(this);
        }

        if (notifyAtRest && listener.onSpringAtRest) {
          listener.onSpringAtRest(this);
        }
      }
    },

    systemShouldAdvance: function systemShouldAdvance() {
      return !this.isAtRest() || !this.wasAtRest();
    },

    wasAtRest: function wasAtRest() {
      return this._wasAtRest;
    },

    isAtRest: function isAtRest() {
      return Math.abs(this._currentState.velocity) < this._restSpeedThreshold && (this.getDisplacementDistanceForState(this._currentState) <= this._displacementFromRestThreshold || this._springConfig.tension === 0);
    },

    setAtRest: function setAtRest() {
      this._endValue = this._currentState.position;
      this._tempState.position = this._currentState.position;
      this._currentState.velocity = 0;
      return this;
    },

    _interpolate: function _interpolate(alpha) {
      this._currentState.position = this._currentState.position * alpha + this._previousState.position * (1 - alpha);
      this._currentState.velocity = this._currentState.velocity * alpha + this._previousState.velocity * (1 - alpha);
    },

    getListeners: function getListeners() {
      return this.listeners;
    },

    addListener: function addListener(newListener) {
      this.listeners.push(newListener);
      return this;
    },

    removeListener: function removeListener(listenerToRemove) {
      removeFirst(this.listeners, listenerToRemove);
      return this;
    },

    removeAllListeners: function removeAllListeners() {
      this.listeners = [];
      return this;
    },

    currentValueIsApproximately: function currentValueIsApproximately(value) {
      return Math.abs(this.getCurrentValue() - value) <= this.getRestDisplacementThreshold();
    }

  });

  var PhysicsState = function PhysicsState() {};

  util.extend(PhysicsState.prototype, {
    position: 0,
    velocity: 0
  });

  var SpringConfig = rebound.SpringConfig = function SpringConfig(tension, friction) {
    this.tension = tension;
    this.friction = friction;
  };

  var AnimationLooper = rebound.AnimationLooper = function AnimationLooper() {
    this.springSystem = null;
    var _this = this;
    var _run = function _run() {
      _this.springSystem.loop(Date.now());
    };

    this.run = function () {
      util.onFrame(_run);
    };
  };

  rebound.SimulationLooper = function SimulationLooper(timestep) {
    this.springSystem = null;
    var time = 0;
    var running = false;
    timestep = timestep || 16.667;

    this.run = function () {
      if (running) {
        return;
      }
      running = true;
      while (!this.springSystem.getIsIdle()) {
        this.springSystem.loop(time += timestep);
      }
      running = false;
    };
  };

  rebound.SteppingSimulationLooper = function (timestep) {
    this.springSystem = null;
    var time = 0;

    this.run = function () {};

    this.step = function (timestep) {
      this.springSystem.loop(time += timestep);
    };
  };

  var OrigamiValueConverter = rebound.OrigamiValueConverter = {
    tensionFromOrigamiValue: function tensionFromOrigamiValue(oValue) {
      return (oValue - 30.0) * 3.62 + 194.0;
    },

    origamiValueFromTension: function origamiValueFromTension(tension) {
      return (tension - 194.0) / 3.62 + 30.0;
    },

    frictionFromOrigamiValue: function frictionFromOrigamiValue(oValue) {
      return (oValue - 8.0) * 3.0 + 25.0;
    },

    origamiFromFriction: function origamiFromFriction(friction) {
      return (friction - 25.0) / 3.0 + 8.0;
    }
  };

  var BouncyConversion = rebound.BouncyConversion = function (bounciness, speed) {
    this.bounciness = bounciness;
    this.speed = speed;
    var b = this.normalize(bounciness / 1.7, 0, 20.0);
    b = this.projectNormal(b, 0.0, 0.8);
    var s = this.normalize(speed / 1.7, 0, 20.0);
    this.bouncyTension = this.projectNormal(s, 0.5, 200);
    this.bouncyFriction = this.quadraticOutInterpolation(b, this.b3Nobounce(this.bouncyTension), 0.01);
  };

  util.extend(BouncyConversion.prototype, {

    normalize: function normalize(value, startValue, endValue) {
      return (value - startValue) / (endValue - startValue);
    },

    projectNormal: function projectNormal(n, start, end) {
      return start + n * (end - start);
    },

    linearInterpolation: function linearInterpolation(t, start, end) {
      return t * end + (1.0 - t) * start;
    },

    quadraticOutInterpolation: function quadraticOutInterpolation(t, start, end) {
      return this.linearInterpolation(2 * t - t * t, start, end);
    },

    b3Friction1: function b3Friction1(x) {
      return 0.0007 * Math.pow(x, 3) - 0.031 * Math.pow(x, 2) + 0.64 * x + 1.28;
    },

    b3Friction2: function b3Friction2(x) {
      return 0.000044 * Math.pow(x, 3) - 0.006 * Math.pow(x, 2) + 0.36 * x + 2.;
    },

    b3Friction3: function b3Friction3(x) {
      return 0.00000045 * Math.pow(x, 3) - 0.000332 * Math.pow(x, 2) + 0.1078 * x + 5.84;
    },

    b3Nobounce: function b3Nobounce(tension) {
      var friction = 0;
      if (tension <= 18) {
        friction = this.b3Friction1(tension);
      } else if (tension > 18 && tension <= 44) {
        friction = this.b3Friction2(tension);
      } else {
        friction = this.b3Friction3(tension);
      }
      return friction;
    }
  });

  util.extend(SpringConfig, {
    fromOrigamiTensionAndFriction: function fromOrigamiTensionAndFriction(tension, friction) {
      return new SpringConfig(OrigamiValueConverter.tensionFromOrigamiValue(tension), OrigamiValueConverter.frictionFromOrigamiValue(friction));
    },

    fromBouncinessAndSpeed: function fromBouncinessAndSpeed(bounciness, speed) {
      var bouncyConversion = new rebound.BouncyConversion(bounciness, speed);
      return this.fromOrigamiTensionAndFriction(bouncyConversion.bouncyTension, bouncyConversion.bouncyFriction);
    },

    coastingConfigWithOrigamiFriction: function coastingConfigWithOrigamiFriction(friction) {
      return new SpringConfig(0, OrigamiValueConverter.frictionFromOrigamiValue(friction));
    }
  });

  SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG = SpringConfig.fromOrigamiTensionAndFriction(40, 7);

  util.extend(SpringConfig.prototype, { friction: 0, tension: 0 });

  var colorCache = {};
  util.hexToRGB = function (color) {
    if (colorCache[color]) {
      return colorCache[color];
    }
    color = color.replace('#', '');
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    var parts = color.match(/.{2}/g);

    var ret = {
      r: parseInt(parts[0], 16),
      g: parseInt(parts[1], 16),
      b: parseInt(parts[2], 16)
    };

    colorCache[color] = ret;
    return ret;
  };

  util.rgbToHex = function (r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    r = r.length < 2 ? '0' + r : r;
    g = g.length < 2 ? '0' + g : g;
    b = b.length < 2 ? '0' + b : b;
    return '#' + r + g + b;
  };

  var MathUtil = rebound.MathUtil = {
    mapValueInRange: function mapValueInRange(value, fromLow, fromHigh, toLow, toHigh) {
      var fromRangeSize = fromHigh - fromLow;
      var toRangeSize = toHigh - toLow;
      var valueScale = (value - fromLow) / fromRangeSize;
      return toLow + valueScale * toRangeSize;
    },

    interpolateColor: function interpolateColor(val, startColor, endColor, fromLow, fromHigh, asRGB) {
      fromLow = fromLow === undefined ? 0 : fromLow;
      fromHigh = fromHigh === undefined ? 1 : fromHigh;
      startColor = util.hexToRGB(startColor);
      endColor = util.hexToRGB(endColor);
      var r = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.r, endColor.r));
      var g = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.g, endColor.g));
      var b = Math.floor(util.mapValueInRange(val, fromLow, fromHigh, startColor.b, endColor.b));
      if (asRGB) {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
      } else {
        return util.rgbToHex(r, g, b);
      }
    },

    degreesToRadians: function degreesToRadians(deg) {
      return deg * Math.PI / 180;
    },

    radiansToDegrees: function radiansToDegrees(rad) {
      return rad * 180 / Math.PI;
    }

  };

  util.extend(util, MathUtil);

  function removeFirst(array, item) {
    var idx = array.indexOf(item);
    idx != -1 && array.splice(idx, 1);
  }

  var _onFrame;
  if (typeof window !== 'undefined') {
    _onFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  }
  if (!_onFrame && typeof process !== 'undefined' && process.title === 'node') {
    _onFrame = setImmediate;
  }

  util.onFrame = function onFrame(func) {
    return _onFrame(func);
  };

  if (typeof exports != 'undefined') {
    util.extend(exports, rebound);
  } else if (typeof window != 'undefined') {
    window.rebound = rebound;
  }
})();