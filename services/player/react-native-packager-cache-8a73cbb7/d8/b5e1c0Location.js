Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var Location = function (_Module) {
  babelHelpers.inherits(Location, _Module);

  function Location(rnctx) {
    babelHelpers.classCallCheck(this, Location);

    var _this = babelHelpers.possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, 'Location'));

    _this._rnctx = rnctx;

    var location = window.location;
    _this.href = location.href;
    _this.protocol = location.protocol;
    _this.host = location.host;
    _this.hostname = location.hostname;
    _this.port = location.port;
    _this.search = location.search;
    _this.hash = location.hash;
    _this.username = location.username;
    _this.password = location.password;
    return _this;
  }

  babelHelpers.createClass(Location, [{
    key: 'reload',
    value: function reload(forceReload) {
      window.location.reload(forceReload);
    }
  }, {
    key: 'replace',
    value: function replace(url) {
      window.location.replace(url);
    }
  }]);
  return Location;
}(_Module3.default);

exports.default = Location;