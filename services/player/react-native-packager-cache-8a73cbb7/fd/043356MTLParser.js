Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readChannels = readChannels;
exports.readTextureOptions = readTextureOptions;
exports.readLine = readLine;
exports.readMTLFile = readMTLFile;


var CHANNELS_TEST = /^\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)/;

function readChannels(remainder, lineNumber) {
  var match = remainder.match(CHANNELS_TEST);
  if (!match) {
    throw new Error('Expected a series of numbers on line ' + lineNumber);
  }
  var points = [parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])];
  if (isNaN(points[0]) || isNaN(points[1]) || isNaN(points[2])) {
    throw new Error('Invalid number on line ' + lineNumber);
  }
  for (var i = 0; i < points.length; i++) {
    if (points[i] < 0) {
      points[i] = 0;
    } else if (points[i] > 1) {
      points[i] = 1;
    }
  }
  return points;
}

function readTextureOptions(remainder) {
  var args = remainder.split(/\s+/);
  var options = {
    blendu: true,
    blendv: true,
    brightness: 0,
    contrast: 1,
    origin: [0, 0, 0],
    scale: [1, 1, 1],
    turbulence: [0, 0, 0],
    clamp: false
  };
  var file = args[args.length - 1];
  var index = 0;
  while (index < args.length - 1) {
    var opt = args[index];
    if (opt[0] !== '-') {
      index++;
      continue;
    }
    if (opt === '-blendu') {
      var flag = args[index + 1];
      if (flag === 'on') {
        options.blendu = true;
      } else if (flag === 'off') {
        options.blendu = false;
      }
      index += 2;
      continue;
    }
    if (opt === '-blendv') {
      var _flag = args[index + 1];
      if (_flag === 'on') {
        options.blendv = true;
      } else if (_flag === 'off') {
        options.blendv = false;
      }
      index += 2;
      continue;
    }
    if (opt === '-boost') {
      var _boost = parseFloat(args[index + 1]);
      if (!isNaN(_boost)) {
        options.boost = _boost;
      }
      index += 2;
      continue;
    }
    if (opt === '-mm') {
      var base = parseFloat(args[index + 1]);
      var gain = parseFloat(args[index + 2]);
      if (!isNaN(base) && !isNaN(gain)) {
        options.brightness = base;
        options.contrast = gain;
      }
      index += 3;
      continue;
    }

    if (opt === '-o') {
      index++;
      var u = parseFloat(args[index]);
      index++;
      if (isNaN(u)) {
        continue;
      }
      options.origin[0] = u;
      if (args[index][0] !== '-') {
        var v = parseFloat(args[index]);
        index++;
        if (isNaN(v)) {
          continue;
        }
        options.origin[1] = v;
        if (args[index][0] !== '-') {
          var w = parseFloat(args[index]);
          index++;
          if (isNaN(w)) {
            continue;
          }
          options.origin[2] = w;
        }
      }
      continue;
    }
    if (opt === '-s') {
      index++;
      var _u = parseFloat(args[index]);
      index++;
      if (isNaN(_u)) {
        continue;
      }
      options.scale[0] = _u;
      if (args[index][0] !== '-') {
        var _v = parseFloat(args[index]);
        index++;
        if (isNaN(_v)) {
          continue;
        }
        options.scale[1] = _v;
        if (args[index][0] !== '-') {
          var _w = parseFloat(args[index]);
          index++;
          if (isNaN(_w)) {
            continue;
          }
          options.scale[2] = _w;
        }
      }
      continue;
    }
    if (opt === '-t') {
      index++;
      var _u2 = parseFloat(args[index]);
      index++;
      if (isNaN(_u2)) {
        continue;
      }
      options.turbulence[0] = _u2;
      if (args[index][0] !== '-') {
        var _v2 = parseFloat(args[index]);
        index++;
        if (isNaN(_v2)) {
          continue;
        }
        options.turbulence[1] = _v2;
        if (args[index][0] !== '-') {
          var _w2 = parseFloat(args[index]);
          index++;
          if (isNaN(_w2)) {
            continue;
          }
          options.turbulence[2] = _w2;
        }
      }
      continue;
    }
    if (opt === '-texres') {
      var res = args[index + 1];
      options.texRes = res;
      index += 2;
      continue;
    }
    if (opt === '-clamp') {
      var _flag2 = args[index + 1];
      if (_flag2 === 'on') {
        options.clamp = true;
      } else if (_flag2 === 'off') {
        options.clamp = false;
      }
      index += 2;
      continue;
    }
    if (opt === '-bm') {
      var mult = parseFloat(args[index + 1]);
      if (!isNaN(mult)) {
        options.bumpMultiplier = mult;
      }
      index += 2;
      continue;
    }
    if (opt === '-imfchan') {
      var chan = args[index + 1];
      if (chan === 'r' || chan === 'g' || chan === 'b' || chan === 'm' || chan === 'l' || chan === 'z') {
        options.imfchan = chan;
      }
      index += 2;
      continue;
    }
    if (opt === '-type') {
      var _type = args[index + 1];
      if (_type === 'sphere' || _type === 'cube_top' || _type === 'cube_bottom' || _type === 'cube_front' || _type === 'cube_back' || _type === 'cube_left' || _type === 'cube_right') {
        options.type = _type;
      }
      index += 2;
      continue;
    }

    index++;
  }
  return { file: file, options: options };
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
  var latest = state[state.length - 1];
  if (first === 'K') {
    if (line[index + 1] === 'a') {
      var channels = readChannels(line.substr(index + 2), lineNumber);
      latest.ambient = channels;
      return;
    }
    if (line[index + 1] === 'd') {
      var _channels = readChannels(line.substr(index + 2), lineNumber);
      latest.diffuse = _channels;
      return;
    }
    if (line[index + 1] === 's') {
      var _channels2 = readChannels(line.substr(index + 2), lineNumber);
      latest.specular = _channels2;
      return;
    }
    if (line[index + 1] === 'e') {
      var _channels3 = readChannels(line.substr(index + 2), lineNumber);
      latest.emissive = _channels3;
    }
  }
  if (first === 'd') {
    if (line[index + 1] === ' ' || line[index + 1] === '\t') {
      var density = parseFloat(line.substr(index + 2).trim());
      if (isNaN(density)) {
        throw new Error('Density must be a number');
      }
      if (density < 0) {
        density = 0;
      } else if (density > 1) {
        density = 1;
      }
      latest.opacity = density;
      return;
    }
  }
  if (first === 'T') {
    if (line[index + 1] === 'r') {
      var transparency = parseFloat(line.substr(index + 2).trim());
      if (isNaN(transparency)) {
        throw new Error('Transparency must be a number');
      }
      if (transparency < 0) {
        transparency = 0;
      } else if (transparency > 1) {
        transparency = 1;
      }
      latest.opacity = 1 - transparency;
      return;
    }
  }
  if (first === 'N') {
    if (line[index + 1] === 's') {
      var _specularExp = parseFloat(line.substr(index + 2).trim());
      if (isNaN(_specularExp)) {
        throw new Error('Specular exponent must be a number');
      }
      latest.specularExp = _specularExp;
      return;
    }
  }
  if (first === 'n') {
    if (line.substr(index, 6) === 'newmtl') {
      var mtl = line.substr(index + 7).trim();
      if (mtl.length < 1) {
        throw new Error('newmtl must provide a material name on line ' + lineNumber);
      }
      state.push({
        name: mtl
      });
      return;
    }
    throw new Error('Unknown identifier: u');
  }
  if (first === 'i') {
    if (line.substr(index, 5) === 'illum') {
      var mode = parseInt(line.substr(index + 6).trim(), 10);
      if (isNaN(mode)) {
        throw new Error('Illumination mode must be a number on line ' + lineNumber);
      }
      latest.illum = mode;
    }
  }
  if (first === 'm') {
    var command = line.substr(index, 6).toLowerCase();
    if (command === 'map_ka') {
      var tex = readTextureOptions(line.substr(index + 6).trim());
      if (tex.file) {
        if (!latest.textureMap) {
          latest.textureMap = {};
        }
        latest.textureMap.ambient = tex;
      }
      return;
    }
    if (command === 'map_kd') {
      var _tex = readTextureOptions(line.substr(index + 6).trim());
      if (_tex.file) {
        if (!latest.textureMap) {
          latest.textureMap = {};
        }
        latest.textureMap.diffuse = _tex;
      }
    }
    if (command === 'map_ks') {
      var _tex2 = readTextureOptions(line.substr(index + 6).trim());
      if (_tex2.file) {
        if (!latest.textureMap) {
          latest.textureMap = {};
        }
        latest.textureMap.specular = _tex2;
      }
    }
    if (command === 'map_ns') {
      var _tex3 = readTextureOptions(line.substr(index + 6).trim());
      if (_tex3.file) {
        if (!latest.textureMap) {
          latest.textureMap = {};
        }
        latest.textureMap.specularExp = _tex3;
      }
    }
  }
  if (line.substr(index, 8).toLowerCase() === 'map_bump' || line.substr(index, 4).toLowerCase() === 'bump') {
    var _tex4 = readTextureOptions(line.substr(index + 6).trim());
    if (_tex4.file) {
      if (!latest.textureMap) {
        latest.textureMap = {};
      }
      if (!_tex4.options.imfchan) {
        _tex4.options.imfchan = 'l';
      }
      latest.textureMap.bump = _tex4;
    }
  }
  if (line.substr(index, 4).toLowerCase() === 'disp') {
    var _tex5 = readTextureOptions(line.substr(index + 6).trim());
    if (_tex5.file) {
      if (!latest.textureMap) {
        latest.textureMap = {};
      }
      latest.textureMap.displacement = _tex5;
    }
  }
  if (line.substr(index, 5).toLowerCase() === 'decal') {
    var _tex6 = readTextureOptions(line.substr(index + 6).trim());
    if (_tex6.file) {
      if (!latest.textureMap) {
        latest.textureMap = {};
      }
      latest.textureMap.decal = _tex6;
    }
  }
}

function readMTLFile(data) {
  var state = [];

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