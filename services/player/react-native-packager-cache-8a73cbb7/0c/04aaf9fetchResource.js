Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetchResource;
function fetchResource(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.addEventListener('load', function () {
      var response = req.response;
      if (req.status === 200) {
        resolve(response);
      } else {
        reject(response);
      }
    });

    req.open('GET', url);
    if (options.responseType === 'arraybuffer') {
      req.responseType = 'arraybuffer';
    }
    req.send();
  });
}