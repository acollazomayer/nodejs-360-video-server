
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var THREE = window && window.THREE || require('three');

if (!THREE) {
  throw new Error("Could not find Three.js! Make sure you've included the appropriate .js file");
}

exports.default = THREE;