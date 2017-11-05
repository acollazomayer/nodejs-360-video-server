Object.defineProperty(exports, "__esModule", {
  value: true
});

var Module = function () {
  function Module(name) {
    babelHelpers.classCallCheck(this, Module);

    if (name.startsWith('RCT')) {
      name = name.substr(3);
    }
    this.name = name;
    this._functionMap = [];
  }

  babelHelpers.createClass(Module, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }, {
    key: '_describe',
    value: function _describe() {
      var constants = {};
      var functions = [];
      var promiseFunctions = [];
      var syncFunctions = [];

      var methodID = 0;

      var proto = Object.getPrototypeOf(this);
      var protoMembers = Object.getOwnPropertyNames(proto);
      for (var _iterator = protoMembers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator']();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var attr = _ref;

        var member = proto[attr];

        if (attr[0] === '_' || attr === 'constructor' || typeof member !== 'function') {
          continue;
        }
        var name = attr;

        if (name[0] === '$') {
          name = name.substring(1);
          promiseFunctions.push(methodID);
        }

        this._functionMap[methodID] = member;
        functions.push(name);
        methodID++;
      }

      for (var _attr in this) {
        var member = this[_attr];
        if (_attr[0] === '_' || typeof member === 'function') {
          continue;
        }
        constants[_attr] = member;
      }

      return [this.name, constants, functions, promiseFunctions, syncFunctions];
    }
  }]);
  return Module;
}();

exports.default = Module;