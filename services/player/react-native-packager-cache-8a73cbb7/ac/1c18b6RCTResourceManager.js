Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RCTResourceManager = RCTResourceManager;
function RCTResourceManager() {
  this._resourceDictionaries = {};
  this._resourceListener = {};
  for (var protocol in this._validProtocols) {
    this._resourceDictionaries[protocol] = {};
  }
}

RCTResourceManager.prototype = babelHelpers.extends(Object.create(Object.prototype), {
  constructor: RCTResourceManager,

  _validProtocols: {
    MonoTexture: 'MonoTexture'
  },

  isValidProtocol: function isValidProtocol(protocol) {
    return this._validProtocols[protocol] === protocol;
  },

  isValidUrl: function isValidUrl(url) {
    var parsed = this.parseUrl(url);
    return parsed.protocol && parsed.handle && this.isValidProtocol(parsed.protocol);
  },

  parseUrl: function parseUrl(url) {
    var protocol = undefined;
    var handle = undefined;
    if (url) {
      var spiltPos = url.indexOf('://');
      if (spiltPos > -1) {
        protocol = url.slice(0, spiltPos);
        handle = url.slice(spiltPos + 3);
      }
    }
    return {
      protocol: protocol,
      handle: handle
    };
  },

  genUrl: function genUrl(protocol, handle) {
    return protocol + '://' + handle;
  },

  addListener: function addListener(url, listener) {
    if (listener) {
      if (this._resourceListener[url] === undefined) {
        this._resourceListener[url] = [];
      }
      if (this._resourceListener[url].indexOf(listener) === -1) {
        this._resourceListener[url].push(listener);
      }
    }
  },

  removeListener: function removeListener(url, listener) {
    var listenerArray = this._resourceListener[url];

    if (listenerArray !== undefined && listener !== undefined) {
      var index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  },

  _dispatchUpdate: function _dispatchUpdate(protocol, handle) {
    var url = this.genUrl(protocol, handle);
    if (this._resourceListener[url]) {
      for (var i = 0; i < this._resourceListener[url].length; i++) {
        var listener = this._resourceListener[url][i];
        listener(url);
      }
    }
  },

  addResource: function addResource(protocol, handle, resource) {
    if (!this.isValidProtocol()) {
      return;
    }
    this._resourceDictionaries[protocol][handle] = resource;
    this._dispatchUpdate(protocol, handle);
  },

  getResource: function getResource(protocol, handle) {
    if (!this.isValidProtocol()) {
      return undefined;
    }
    if (this._resourceDictionaries[protocol]) {
      return this._resourceDictionaries[protocol][handle];
    } else {
      return undefined;
    }
  },

  removeResource: function removeResource(protocol, handle) {
    if (!this.isValidProtocol()) {
      return;
    }
    if (this._resourceDictionaries[protocol]) {
      delete this._resourceDictionaries[protocol][handle];
      this._dispatchUpdate(protocol, handle);
    }
  }
});