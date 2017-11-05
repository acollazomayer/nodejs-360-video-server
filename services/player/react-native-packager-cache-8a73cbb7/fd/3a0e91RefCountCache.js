Object.defineProperty(exports, "__esModule", {
  value: true
});

var RefCountCache = function () {
  function RefCountCache(cleanup) {
    babelHelpers.classCallCheck(this, RefCountCache);

    this._cleanup = cleanup;
    this._stateCache = {};
  }

  babelHelpers.createClass(RefCountCache, [{
    key: "has",
    value: function has(path) {
      return !!this._stateCache[path];
    }
  }, {
    key: "get",
    value: function get(path) {
      var entry = this._stateCache[path];
      if (!entry) {
        throw new Error("RefCountCache entry for " + path + " not found");
      }
      return entry.state;
    }
  }, {
    key: "addEntry",
    value: function addEntry(path, state) {
      var prev = this._stateCache[path];
      if (prev) {
        return;
      }
      this._stateCache[path] = {
        refs: 1,
        state: state
      };
    }
  }, {
    key: "addReference",
    value: function addReference(path) {
      var prev = this._stateCache[path];
      if (!prev) {
        return 0;
      }
      prev.refs++;
      return prev.refs;
    }
  }, {
    key: "removeReference",
    value: function removeReference(path) {
      var prev = this._stateCache[path];
      if (!prev) {
        return 0;
      }
      prev.refs--;
      if (prev.refs <= 0) {
        if (this._cleanup) {
          this._cleanup(path, prev.state);
        }
        delete this._stateCache[path];
      }
      return Math.max(0, prev.refs);
    }
  }]);
  return RefCountCache;
}();

exports.default = RefCountCache;