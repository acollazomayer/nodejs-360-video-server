

var _inGuard = 0;

var _globalHandler = function onError(e) {
  throw e;
};

var ErrorUtils = {
  setGlobalHandler: function setGlobalHandler(fun) {
    _globalHandler = fun;
  },
  getGlobalHandler: function getGlobalHandler() {
    return _globalHandler;
  },
  reportError: function reportError(error) {
    _globalHandler && _globalHandler(error);
  },
  reportFatalError: function reportFatalError(error) {
    _globalHandler && _globalHandler(error, true);
  },
  applyWithGuard: function applyWithGuard(fun, context, args) {
    try {
      _inGuard++;
      return fun.apply(context, args);
    } catch (e) {
      ErrorUtils.reportError(e);
    } finally {
      _inGuard--;
    }
  },
  applyWithGuardIfNeeded: function applyWithGuardIfNeeded(fun, context, args) {
    if (ErrorUtils.inGuard()) {
      return fun.apply(context, args);
    } else {
      ErrorUtils.applyWithGuard(fun, context, args);
    }
  },
  inGuard: function inGuard() {
    return _inGuard;
  },
  guard: function guard(fun, name, context) {
    if (typeof fun !== 'function') {
      console.warn('A function must be passed to ErrorUtils.guard, got ', fun);
      return null;
    }
    name = name || fun.name || '<generated guard>';
    function guarded() {
      return ErrorUtils.applyWithGuard(fun, context || this, arguments, null, name);
    }

    return guarded;
  }
};

global.ErrorUtils = ErrorUtils;