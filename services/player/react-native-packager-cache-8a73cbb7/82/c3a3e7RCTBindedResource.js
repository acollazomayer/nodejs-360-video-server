Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RCTBindedResource = RCTBindedResource;
function RCTBindedResource(resourceManager) {
  this.resourceManager = resourceManager;
  this.url = undefined;
  this.callback = undefined;
}

RCTBindedResource.prototype = babelHelpers.extends(Object.create(Object.prototype), {
  constructor: RCTBindedResource,

  load: function load(url, onLoadOrChange) {
    this.unregister();

    if (this.resourceManager.isValidUrl(url)) {
      var self = this;
      var requestUrl = url;
      var requestCallback = function requestCallback(url) {
        if (self.url === requestUrl) {
          var parsed = self.resourceManager.parseUrl(url);
          onLoadOrChange(self.resourceManager.getResource(parsed.protocol, parsed.handle));
        }
      };

      this.resourceManager.addListener(url, requestCallback);
      this.callback = requestCallback;
      this.url = requestUrl;

      requestCallback(url);
    } else {
      console.warn("RCTBindedResource.load: requesting a not valid local resource " + url + ".");
    }
  },

  isValidUrl: function isValidUrl(url) {
    return this.resourceManager.isValidUrl(url);
  },

  unregister: function unregister() {
    if (this.resourceManager.isValidUrl(this.url)) {
      this.resourceManager.removeListener(this.url, this.callback);
    }
    this.url = undefined;
    this.callback = undefined;
  },

  dispose: function dispose() {
    this.unregister();
  }
});