
'use strict';

var getDevServer = require('getDevServer');

function openFileInEditor(file, lineNumber) {
  fetch(getDevServer().url + 'open-stack-frame', {
    method: 'POST',
    body: JSON.stringify({ file: file, lineNumber: lineNumber })
  });
}

module.exports = openFileInEditor;