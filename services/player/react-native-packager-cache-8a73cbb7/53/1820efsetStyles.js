
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setStyles;

function setStyles(node, styles) {
  for (var property in styles) {
    var destination = property;

    if (!node.style.hasOwnProperty(destination)) {
      var uppercase = destination[0].toUpperCase() + destination.substr(1);
      if (node.style.hasOwnProperty('moz' + uppercase)) {
        destination = 'moz' + uppercase;
      } else if (node.style.hasOwnProperty('webkit' + uppercase)) {
        destination = 'webkit' + uppercase;
      }
    }
    node.style[destination] = styles[property];
  }
}