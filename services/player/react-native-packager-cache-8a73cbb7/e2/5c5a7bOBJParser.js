Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readPoints = readPoints;
exports.readTexturePoints = readTexturePoints;
exports.readPairs = readPairs;
exports.readTriplets = readTriplets;
exports.readLine = readLine;
exports.readOBJFile = readOBJFile;

var _OBJGroup = require('./OBJGroup');

var _OBJGroup2 = babelHelpers.interopRequireDefault(_OBJGroup);

var POINTS_TEST = /^\s+(-?[\d\.e+-]+)\s+(-?[\d\.e+-]+)\s+(-?[\d\.e+-]+)/;
var TEXTURE_POINTS_TEST = /^\s+(-?[\d\.e+-]+)\s+(-?[\d\.e+-]+)/;
var PAIR_TEST = /^\s*(-?\d+)(\/-?\d+)?\s*/;
var TRIPLET_TEST = /^\s*(-?\d+)\/?(-?\d+)?(\/-?\d+)?\s*/;
var SMOOTHING_TEST = /^\s*(\d+|on|off)/;

function readPoints(remainder, lineNumber) {
  var match = remainder.match(POINTS_TEST);
  if (!match) {
    throw new Error('Expected a series of numbers on line ' + lineNumber);
  }
  var points = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
  if (isNaN(points[0]) || isNaN(points[1]) || isNaN(points[2])) {
    throw new Error('Invalid number on line ' + lineNumber);
  }
  if (match[0].length < remainder.length) {
    var colorMatch = remainder.substr(match[0].length).match(POINTS_TEST);
    if (colorMatch) {
      var color = [parseFloat(colorMatch[1]), parseFloat(colorMatch[2]), parseFloat(colorMatch[3])];
      if (isNaN(color[0]) || isNaN(color[1]) || isNaN(color[2])) {
        throw new Error('Invalid number on line ' + lineNumber);
      }
      points.push(color[0], color[1], color[2]);
    }
  }
  return points;
}

function readTexturePoints(remainder, lineNumber) {
  var match = remainder.match(TEXTURE_POINTS_TEST);
  if (!match) {
    throw new Error('Expected a series of numbers on line ' + lineNumber);
  }
  var points = [parseFloat(match[1]), parseFloat(match[2])];
  if (isNaN(points[0]) || isNaN(points[1])) {
    throw new Error('Invalid number on line ' + lineNumber);
  }
  return points;
}

function readPairs(remainder, lineNumber) {
  var pairs = [];
  while (remainder.length > 0) {
    var match = remainder.match(PAIR_TEST);
    if (!match) {
      throw new Error('Expected a vertex id on line ' + lineNumber);
    }
    var fullMatch = match[0];
    var vertex = parseInt(match[1], 10);
    var texture = match[2] ? parseInt(match[2].substr(1), 10) : 0;
    if (isNaN(vertex)) {
      throw new Error('Invalid vertex id on line ' + lineNumber);
    }
    if (isNaN(texture)) {
      throw new Error('Invalid texture point id on line ' + lineNumber);
    }
    pairs.push([vertex, texture]);
    remainder = remainder.substr(fullMatch.length);
  }
  return pairs;
}

function readTriplets(remainder, lineNumber) {
  var triplets = [];
  while (remainder.length > 0) {
    var match = remainder.match(TRIPLET_TEST);
    if (!match) {
      throw new Error('Expected a vertex id on line ' + lineNumber);
    }
    var fullMatch = match[0];
    var vertex = parseInt(match[1], 10);
    var texture = match[2] ? parseInt(match[2], 10) : 0;
    var normal = match[3] ? parseInt(match[3].substr(1), 10) : 0;
    if (isNaN(vertex)) {
      throw new Error('Invalid vertex id on line ' + lineNumber);
    }
    if (isNaN(texture)) {
      throw new Error('Invalid texture point id on line ' + lineNumber);
    }
    if (isNaN(normal)) {
      throw new Error('Invalid normal id on line ' + lineNumber);
    }
    triplets.push([vertex, texture, normal]);
    remainder = remainder.substr(fullMatch.length);
  }
  return triplets;
}

function readLine(state, line, lineNumber) {
  var index = 0;
  var length = line.length;
  while (index < length && line[index] === ' ' || line[index] === '\t') {
    index++;
  }
  if (index >= length) {
    return;
  }
  var first = line[index];
  if (first === '#') {
    return;
  }
  if (first === 'v') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      var points = readPoints(line.substr(index + 1), lineNumber);
      state.vertices.push(points);
      return;
    }
    if (line[index + 1] === 'n') {
      var _points = readPoints(line.substr(index + 2), lineNumber);
      var normal = [_points[0], _points[1], _points[2]];
      state.normals.push(normal);
      return;
    }
    if (line[index + 1] === 't') {
      var _points2 = readTexturePoints(line.substr(index + 2), lineNumber);
      state.textureCoords.push(_points2);
      return;
    }
    if (line[index + 1] === 'p') {
      throw new Error('Parametric curve points (vp) are currently unsupported');
    }
    throw new Error('Unknown identifier: v' + (index + 1 < line.length ? line[index + 1] : ''));
  }
  if (first === 'f') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      var triplets = readTriplets(line.substr(index + 1), lineNumber);
      state.currentObject.addFace(triplets);
      return;
    }
    throw new Error('Unknown identifier: f' + (index + 1 < line.length ? line[index + 1] : ''));
  }
  if (first === 'l') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      return;
    }
    throw new Error('Unknown identifier: l' + (index + 1 < line.length ? line[index + 1] : ''));
  }
  if (first === 's') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      var match = line.substr(index + 1).match(SMOOTHING_TEST);
      if (!match) {
        throw new Error('Invalid smoothing flag on line ' + lineNumber);
      }
      var flag = match[1];
      state.currentObject.setSmoothing(flag !== 'off');
      return;
    }
    throw new Error('Unknown identifier: s' + (index + 1 < line.length ? line[index + 1] : ''));
  }
  if (first === 'g' || first === 'o') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      var name = line.substr(2).trim();
      var obj = new _OBJGroup2.default(state.vertices, state.textureCoords, state.normals, name);
      if (state.currentObject && state.currentObject.materials.length > 0) {
        var inherited = state.currentObject.materials[state.currentObject.materials.length - 1];
        obj.addMaterial(inherited.name, inherited.lib);
      }
      state.objects.push(obj);
      state.currentObject = obj;
      return;
    }
  }
  if (first === 'm') {
    if (line.substr(index, 6) === 'mtllib') {
      var path = line.substr(index + 7).trim();
      if (path.length < 1) {
        throw new Error('mtllib must provide a file path on line ' + lineNumber);
      }
      state.materialLibraries.push(path);
      return;
    }
    throw new Error('Unknown identifier: m');
  }
  if (first === 'u') {
    if (line.substr(index, 6) === 'usemtl') {
      var mtl = line.substr(index + 7).trim();
      if (mtl.length < 1) {
        throw new Error('usemtl must provide a material name on line ' + lineNumber);
      }
      var lib = state.materialLibraries[state.materialLibraries.length - 1];
      state.currentObject.addMaterial(mtl, lib);
      return;
    }
    throw new Error('Unknown identifier: u');
  }
}

function readOBJFile(data) {
  var vertices = [];
  var textureCoords = [];
  var normals = [];
  var starterObject = new _OBJGroup2.default(vertices, textureCoords, normals);
  var state = {
    vertices: vertices,
    textureCoords: textureCoords,
    normals: normals,
    materialLibraries: [],
    objects: [starterObject],
    currentObject: starterObject
  };

  if (data.indexOf('\r\n') > -1) {
    data = data.replace('\r\n', '\n');
  }
  var lines = data.split('\n');
  var length = lines.length;
  var index = 0;
  return new Promise(function (resolve, reject) {
    var chunk = function chunk() {
      var start = Date.now();
      while (Date.now() - start < 16 && index < length) {
        try {
          readLine(state, lines[index], index + 1);
          index++;
        } catch (e) {
          reject(e);
        }
      }
      if (index >= length) {
        resolve(state);
      } else {
        setTimeout(chunk, 0);
      }
    };
    chunk();
  });
}