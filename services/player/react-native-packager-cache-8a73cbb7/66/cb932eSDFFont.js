
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SDFFONT_MARKER_COLOR = exports.TOP = exports.RIGHT_LINE = exports.RIGHT = exports.LEFT = exports.CENTER_LINE = exports.CENTER_FIXEDHEIGHT = exports.CENTER = exports.BOTTOM = exports.BASELINE = undefined;
exports.splitLines = splitLines;
exports.wrapLines = wrapLines;
exports.measureText = measureText;
exports.BitmapFontGeometry = BitmapFontGeometry;
exports.loadFont = loadFont;
exports.addFontFallback = addFontFallback;

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

var _DefaultFont = require('./DefaultFont');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var BASELINE = exports.BASELINE = 'baseline';
var BOTTOM = exports.BOTTOM = 'bottom';
var CENTER = exports.CENTER = 'center';
var CENTER_FIXEDHEIGHT = exports.CENTER_FIXEDHEIGHT = 'center_fixedheight';
var CENTER_LINE = exports.CENTER_LINE = 'center_line';
var LEFT = exports.LEFT = 'left';
var RIGHT = exports.RIGHT = 'right';
var RIGHT_LINE = exports.RIGHT_LINE = 'right_line';
var TOP = exports.TOP = 'top';
var SDFFONT_MARKER_COLOR = exports.SDFFONT_MARKER_COLOR = 0;

function isBreakable(code) {
  return code === 32 || code === 13 || code === 10;
}
function isNewLine(code) {
  return code === 13 || code === 10;
}
function isWhiteSpace(code) {
  return code === 32 || code === 9;
}

var vertexShader = '\nvarying vec2 vUv;\nattribute vec4 fontParms;\nattribute vec4 textColors;\nvarying vec4 vFontParms;\nvarying vec4 vTextColor;\nvarying vec4 vMVPosition;\nvoid main( ) {\n  vUv = uv;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vFontParms = fontParms;\n  vTextColor = textColors;\n  vMVPosition = mvPosition;\n  gl_Position = projectionMatrix * mvPosition;\n}\n';

var fragmentShader = '\nuniform sampler2D texture;\nuniform vec4 textColor;\nuniform vec4 clipRegion;\nvarying vec4 vTextColor;\nvarying vec4 vFontParms;\nvarying vec4 vMVPosition;\nvarying vec2 vUv;\nvoid main( void ) {\n  float distance = texture2D( texture, vUv ).r;\n  float ds = vFontParms.z * 255.0;\n  float dd = fwidth( vUv.x ) * vFontParms.w * 16.0 * ds;\n  float ALPHA_MIN = vFontParms.x - dd;\n  float ALPHA_MAX = vFontParms.x + dd;\n  float COLOR_MIN = vFontParms.y - dd;\n  float COLOR_MAX = vFontParms.y + dd;\n  float value = ( clamp( distance, COLOR_MIN, COLOR_MAX ) - COLOR_MIN ) / max(0.00001, COLOR_MAX - COLOR_MIN );\n  float alpha = ( clamp( distance, ALPHA_MIN, ALPHA_MAX ) - ALPHA_MIN ) / max(0.00001,  ALPHA_MAX - ALPHA_MIN );\n  if (vMVPosition.x < clipRegion.x) {\n    discard;\n  }\n  if (vMVPosition.y < clipRegion.y) {\n    discard;\n  }\n  if (vMVPosition.x > clipRegion.z) {\n    discard;\n  }\n  if (vMVPosition.y > clipRegion.w) {\n    discard;\n  }\n  float premultAlphaValue = value * vTextColor.w * textColor.w;\n  gl_FragColor = vec4(\n    premultAlphaValue,\n    premultAlphaValue,\n    premultAlphaValue,\n    alpha) *\n    vTextColor *\n    textColor;\n}\n';

function LineBreaker(text, fontObject, fontHeight) {
  var fallback = fontObject.data.CharMap[42];
  return {
    text: text,
    fontObject: fontObject,
    cursor: 0,
    nextBreak: function nextBreak(maxWidth) {
      var width = 0;
      if (this.cursor >= this.text.length) {
        return null;
      }
      var code = this.text.charCodeAt(this.cursor++);
      if (code === SDFFONT_MARKER_COLOR) {
        this.cursor += 4;
        if (this.cursor >= this.text.length) {
          return null;
        }
        code = this.text.charCodeAt(this.cursor++);
      }

      var curFontObject = this.fontObject;
      var g = this.fontObject.data.CharMap[code];
      if (!g) {
        for (var index = 0; index < this.fontObject.fallbacks.length; index++) {
          var fallbackFontObject = this.fontObject.fallbacks[index];
          g = fallbackFontObject.data.CharMap[code];
          if (g) {
            curFontObject = fallbackFontObject;
            break;
          }
        }
      }
      g = g || fallback;
      curFontObject = curFontObject || this.fontObject;
      var font = curFontObject.data;
      var xScale = fontHeight / font.FontHeight;

      width += g.AdvanceX * xScale;
      if (isBreakable(code)) {
        return {
          position: this.cursor,
          required: isNewLine(code),
          whitespace: isWhiteSpace(code),
          split: false,
          width: width
        };
      }
      code = this.text.charCodeAt(this.cursor);
      if (code === SDFFONT_MARKER_COLOR) {
        this.cursor += 5;
        code = this.text.charCodeAt(this.cursor);
      }
      while (this.cursor < this.text.length && !isBreakable(code)) {
        var _g = font.CharMap[code] || fallback;
        var w = _g.AdvanceX * xScale;
        if (width + w > maxWidth) {
          return {
            position: this.cursor,
            required: false,
            whitespace: false,
            split: true,
            width: width
          };
        }
        width += w;
        this.cursor++;
        code = this.text.charCodeAt(this.cursor);
        if (code === SDFFONT_MARKER_COLOR) {
          this.cursor += 5;
          code = this.text.charCodeAt(this.cursor);
        }
      }
      return {
        position: this.cursor,
        required: false,
        whitespace: false,
        split: false,
        width: width
      };
    }
  };
}

function splitLines(fontObject, text, fontHeight, maxWidth, maxHeight, maxLines, hasPerPixelClip) {
  var lineStart = 0;
  var lastOption = 0;
  var breaker = new LineBreaker(text, fontObject, fontHeight);
  var bk = void 0;
  var lines = [];
  var lineWidth = 0;
  while (bk = breaker.nextBreak(maxWidth)) {
    if (bk.whitespace && lineWidth === 0) {
      lineStart = bk.position;
    }

    if (bk.required || lineWidth !== 0 && lineWidth + bk.width > maxWidth) {
      if (lineStart !== lastOption) {
        lines[lines.length] = text.slice(lineStart, lastOption).trim();
      }
      lineWidth = 0;
      lineStart = lastOption;

      if (bk.whitespace) {
        lineStart = bk.position;
        continue;
      }
    }
    lineWidth += bk.width;
    lastOption = bk.position;
  }

  if (lineStart < text.length) {
    lines[lines.length] = text.slice(lineStart).trim();
  }

  if (maxLines > 0) {
    lines.splice(maxLines);
  }

  if (maxHeight) {
    if (hasPerPixelClip) {
      lines.splice(Math.ceil(maxHeight / fontHeight));
    } else {
      lines.splice(Math.floor(maxHeight / fontHeight));
    }
  }
  return lines;
}

function wrapLines(fontObject, text, fontHeight, maxWidth, maxHeight, maxLines, hasPerPixelClip) {
  return splitLines(fontObject, text, fontHeight, maxWidth, maxHeight, maxLines, hasPerPixelClip).join('\n');
}

function measureText(fontObject, text, fontHeight) {
  var dim = {
    maxWidth: 0,
    maxHeight: 0,
    maxDescent: 0,
    numLines: 1,
    lineWidths: []
  };

  var width = 0;
  var fallback = fontObject.data.CharMap[42];
  for (var i = 0; i < text.length; i++) {
    var charCode = text.charCodeAt(i);
    if (charCode === SDFFONT_MARKER_COLOR) {
      i += 4;
      continue;
    }

    if (isNewLine(charCode)) {
      if (width > dim.maxWidth) {
        dim.maxWidth = width;
      }
      if (i !== text.length - 1) {
        dim.maxHeight += fontHeight;
        dim.maxDescent = 0;
      }

      dim.lineWidths[dim.lineWidths.length] = width;
      width = 0;
      dim.numLines++;
      continue;
    }

    var curFontObject = fontObject;
    var g = fontObject.data.CharMap[charCode];
    if (!g) {
      for (var index = 0; index < fontObject.fallbacks.length; index++) {
        var fallbackFontObject = fontObject.fallbacks[index];
        g = fallbackFontObject.data.CharMap[charCode];
        if (g) {
          curFontObject = fallbackFontObject;
          break;
        }
      }
    }
    g = g || fallback;
    curFontObject = curFontObject || fontObject;
    var font = curFontObject.data;
    var xScale = fontHeight / font.FontHeight;
    var yScale = fontHeight / font.FontHeight;

    var descent = (g.Height - g.BearingY) * yScale;
    if (descent > dim.maxDescent) {
      dim.maxDescent = descent;
    }
    width += g.AdvanceX * xScale;
  }
  if (width > dim.maxWidth) {
    dim.maxWidth = width;
  }
  if (width > 0) {
    dim.maxHeight += fontHeight;
    dim.lineWidths[dim.lineWidths.length] = width;
  }
  if (dim.maxDescent > 0) {
    dim.maxHeight += dim.maxDescent;
  }

  return dim;
}

function BitmapFontGeometry(fontObject, text, fontHeight) {
  var config = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  var frame = config.frame || [0, 0, 0, 0];
  var deltaZ = config.deltaZ || 0;
  var hAlign = config.hAlign || LEFT;
  var vAlign = config.vAlign || BASELINE;
  var fontParms = config.fontParms || {
    AlphaCenter: 0.47,
    ColorCenter: 0.49
  };

  var dim = config.dim || measureText(fontObject, text, fontHeight);

  var fontParamsAlphaCenter = Math.min(255, fontParms.AlphaCenter * 255 || 108);
  var fontParamsColorCenter = Math.min(255, fontParms.ColorCenter * 255 || 128);

  _ThreeShim2.default.BufferGeometry.apply(this);

  if (!fontObject.data) {
    return;
  }

  var curPos = [0, 0];

  var numGlyphs = text.length;

  var positionsBuffer = new Float32Array(numGlyphs * 4 * 3);
  var texCoordBuffer = new Float32Array(numGlyphs * 4 * 2);
  var fontParmsBuffer = new Uint8Array(numGlyphs * 4 * 4);
  var textColorBuffer = new Uint8Array(numGlyphs * 4 * 4);
  var indicesBuffer = new Uint32Array(numGlyphs * 6);

  if (hAlign === LEFT) {
    curPos[0] = frame[0];
  } else if (hAlign === CENTER) {
    curPos[0] = frame[0] + frame[2] / 2 - dim.maxWidth / 2;
  } else if (hAlign === RIGHT) {
    curPos[0] = frame[0] + frame[2] - dim.maxWidth;
  }

  var baseFont = fontObject.data;

  var yBaseScale = fontHeight / fontObject.data.FontHeight;
  if (vAlign === BASELINE) {
    curPos[1] = frame[1] + dim.maxHeight - fontHeight;
  } else if (vAlign === CENTER) {
    var ma = baseFont.MaxAscent;
    var md = baseFont.MaxDescent;
    var fh = baseFont.FontHeight;

    var maxFontExtent = ma + md + fh * (dim.numLines - 1);
    curPos[1] = (maxFontExtent / 2 - fh) * yBaseScale;
  } else if (vAlign === CENTER_FIXEDHEIGHT) {
    var _ma = baseFont.MaxAscent;
    var _md = baseFont.MaxDescent;
    var _fh = baseFont.FontHeight;
    var maxFontHeight = _ma + _md;
    var maxTextHeight = (_fh * (dim.numLines - 1) + maxFontHeight) * yBaseScale;
    curPos[1] = (maxTextHeight - fontHeight) * 0.5 - _md * yBaseScale;
  } else if (vAlign === TOP) {
    curPos[1] = frame[1] + frame[3] - fontHeight;
  } else if (vAlign === BOTTOM) {
    curPos[1] = frame[1] + dim.maxHeight - fontHeight;
  }

  var startX = curPos[0];
  if (hAlign === CENTER_LINE) {
    curPos[0] = frame[0] + frame[2] / 2 - dim.lineWidths[0] / 2;
  } else if (hAlign === RIGHT_LINE) {
    curPos[0] = frame[0] + frame[2] - dim.lineWidths[0];
  }
  var offsetZ = 0.0;
  var lineIndex = 0;
  var index = 0;
  var textColor = [0xff, 0xff, 0xff, 0xff];
  var fallback = baseFont.CharMap[42];
  var lastGroupIndex = 0;
  var lastFontObject = fontObject;

  var materials = [];
  for (var i = 0; i < text.length; i++) {
    var charCode = text.charCodeAt(i);
    if (charCode === SDFFONT_MARKER_COLOR) {
      textColor[0] = text.charCodeAt(i + 1);
      textColor[1] = text.charCodeAt(i + 2);
      textColor[2] = text.charCodeAt(i + 3);
      textColor[3] = text.charCodeAt(i + 4);
      i += 4;
      continue;
    }
    if (isNewLine(charCode)) {
      curPos[0] = startX;
      curPos[1] -= fontHeight;
      lineIndex++;

      if (hAlign === CENTER_LINE) {
        curPos[0] = frame[0] + frame[2] / 2 - dim.lineWidths[lineIndex] / 2;
      } else if (hAlign === RIGHT_LINE) {
        curPos[0] = frame[0] + frame[2] - dim.lineWidths[lineIndex];
      }

      continue;
    }
    var curFontObject = fontObject;
    var g = fontObject.data.CharMap[charCode];
    if (!g) {
      for (var _index = 0; _index < fontObject.fallbacks.length; _index++) {
        var fallbackFontObject = fontObject.fallbacks[_index];
        g = fallbackFontObject.data.CharMap[charCode];
        if (g) {
          curFontObject = fallbackFontObject;
          break;
        }
      }
    }
    g = g || fallback;
    curFontObject = curFontObject || fontObject;
    var font = curFontObject.data;
    var xScale = fontHeight / font.FontHeight;
    var yScale = fontHeight / font.FontHeight;

    if (curFontObject !== lastFontObject) {
      if (lastGroupIndex !== index) {
        this.addGroup(lastGroupIndex * 6, (index - lastGroupIndex) * 6, materials.length);
        materials.push(lastFontObject.material);
      }
      lastGroupIndex = index;
      lastFontObject = curFontObject;
    }

    var s0 = g.X / font.NaturalWidth;
    var t0 = g.Y / font.NaturalHeight;
    var s1 = (g.X + g.Width) / font.NaturalWidth;
    var t1 = (g.Y + g.Height) / font.NaturalHeight;

    var bearingX = g.BearingX * xScale;
    var bearingY = g.BearingY * yScale;

    var rw = (g.Width + g.BearingX) * xScale;
    var rh = (g.Height - g.BearingY) * yScale;
    var r = [1, 0, 0];
    var u = [0, 1, 0];

    positionsBuffer[index * 12 + 0] = curPos[0] + r[0] * bearingX - u[0] * rh;
    positionsBuffer[index * 12 + 1] = curPos[1] + r[1] * bearingX - u[1] * rh;
    positionsBuffer[index * 12 + 2] = offsetZ + r[2] * bearingX - u[2] * rh;
    texCoordBuffer[index * 8 + 0] = s0;
    texCoordBuffer[index * 8 + 1] = t1;
    fontParmsBuffer[index * 16 + 0] = fontParamsAlphaCenter;
    fontParmsBuffer[index * 16 + 1] = fontParamsColorCenter;
    fontParmsBuffer[index * 16 + 2] = 0x02;
    fontParmsBuffer[index * 16 + 3] = 0xff;
    textColorBuffer[index * 16 + 0] = textColor[0];
    textColorBuffer[index * 16 + 1] = textColor[1];
    textColorBuffer[index * 16 + 2] = textColor[2];
    textColorBuffer[index * 16 + 3] = textColor[3];

    positionsBuffer[index * 12 + 3] = curPos[0] + r[0] * bearingX + u[0] * bearingY;
    positionsBuffer[index * 12 + 4] = curPos[1] + r[1] * bearingX + u[1] * bearingY;
    positionsBuffer[index * 12 + 5] = offsetZ + r[2] * bearingX + u[2] * bearingY;
    texCoordBuffer[index * 8 + 2] = s0;
    texCoordBuffer[index * 8 + 3] = t0;
    fontParmsBuffer[index * 16 + 4] = fontParamsAlphaCenter;
    fontParmsBuffer[index * 16 + 5] = fontParamsColorCenter;
    fontParmsBuffer[index * 16 + 6] = 0x02;
    fontParmsBuffer[index * 16 + 7] = 0xff;
    textColorBuffer[index * 16 + 4] = textColor[0];
    textColorBuffer[index * 16 + 5] = textColor[1];
    textColorBuffer[index * 16 + 6] = textColor[2];
    textColorBuffer[index * 16 + 7] = textColor[3];

    positionsBuffer[index * 12 + 6] = curPos[0] + r[0] * rw + u[0] * bearingY;
    positionsBuffer[index * 12 + 7] = curPos[1] + r[1] * rw + u[1] * bearingY;
    positionsBuffer[index * 12 + 8] = offsetZ + r[2] * rw + u[2] * bearingY;
    texCoordBuffer[index * 8 + 4] = s1;
    texCoordBuffer[index * 8 + 5] = t0;
    fontParmsBuffer[index * 16 + 8] = fontParamsAlphaCenter;
    fontParmsBuffer[index * 16 + 9] = fontParamsColorCenter;
    fontParmsBuffer[index * 16 + 10] = 0x02;
    fontParmsBuffer[index * 16 + 11] = 0xff;
    textColorBuffer[index * 16 + 8] = textColor[0];
    textColorBuffer[index * 16 + 9] = textColor[1];
    textColorBuffer[index * 16 + 10] = textColor[2];
    textColorBuffer[index * 16 + 11] = textColor[3];

    positionsBuffer[index * 12 + 9] = curPos[0] + r[0] * rw - u[0] * rh;
    positionsBuffer[index * 12 + 10] = curPos[1] + r[1] * rw - u[1] * rh;
    positionsBuffer[index * 12 + 11] = offsetZ + r[2] * rw - u[2] * rh;
    texCoordBuffer[index * 8 + 6] = s1;
    texCoordBuffer[index * 8 + 7] = t1;
    fontParmsBuffer[index * 16 + 12] = fontParamsAlphaCenter;
    fontParmsBuffer[index * 16 + 13] = fontParamsColorCenter;
    fontParmsBuffer[index * 16 + 14] = 0x02;
    fontParmsBuffer[index * 16 + 15] = 0xff;
    textColorBuffer[index * 16 + 12] = textColor[0];
    textColorBuffer[index * 16 + 13] = textColor[1];
    textColorBuffer[index * 16 + 14] = textColor[2];
    textColorBuffer[index * 16 + 15] = textColor[3];

    indicesBuffer[index * 6 + 0] = index * 4 + 0;
    indicesBuffer[index * 6 + 1] = index * 4 + 1;
    indicesBuffer[index * 6 + 2] = index * 4 + 2;
    indicesBuffer[index * 6 + 3] = index * 4 + 0;
    indicesBuffer[index * 6 + 4] = index * 4 + 2;
    indicesBuffer[index * 6 + 5] = index * 4 + 3;

    index++;
    curPos[0] += g.AdvanceX * xScale;
    offsetZ += deltaZ;
  }

  this.type = 'SDFText';
  this.textClip = [-16384, -16384, 16384, 16384];
  this.addAttribute('position', new _ThreeShim2.default.BufferAttribute(positionsBuffer, 3));
  this.addAttribute('uv', new _ThreeShim2.default.BufferAttribute(texCoordBuffer, 2));
  this.addAttribute('fontParms', new _ThreeShim2.default.BufferAttribute(fontParmsBuffer, 4, true));
  this.addAttribute('textColors', new _ThreeShim2.default.BufferAttribute(textColorBuffer, 4, true));
  this.setIndex(new _ThreeShim2.default.BufferAttribute(indicesBuffer, 1));
  if (lastGroupIndex !== index) {
    this.addGroup(lastGroupIndex * 6, (index - lastGroupIndex) * 6, materials.length);
    materials.push(lastFontObject.material);
  }
  this.computeBoundingSphere();
  this.materials = new _ThreeShim2.default.MultiMaterial(materials);
}

BitmapFontGeometry.prototype = Object.create(_ThreeShim2.default.BufferGeometry.prototype);
BitmapFontGeometry.prototype.constructor = BitmapFontGeometry;

function loadFont(fontName, fontTexture, loader) {
  if (!fontName) {
    fontTexture = _DefaultFont.DEFAULT_FONT_TEXTURE;
  }
  var tex = new _ThreeShim2.default.TextureLoader().load(fontTexture, function (texture) {
    texture.wrapS = _ThreeShim2.default.ClampToEdgeWrapping;
    texture.wrapT = _ThreeShim2.default.ClampToEdgeWrapping;
    texture.minFilter = _ThreeShim2.default.LinearFilter;
    texture.flipY = false;
  });

  var uniforms = {
    texture: {
      value: tex
    },
    textColor: {
      type: 'v4',
      dynamic: true,
      value: new _ThreeShim2.default.Vector4(),
      onUpdateCallback: function onUpdateCallback(object, camera) {
        if (object.parent.textColor) {
          this.value.set(object.parent.textColor.r, object.parent.textColor.g, object.parent.textColor.b, object.opacity);
        }
      }
    },
    clipRegion: {
      type: 'v4',
      dynamic: true,
      value: new _ThreeShim2.default.Vector4(-16384, -16384, 16384, 16384),
      onUpdateCallback: function onUpdateCallback(object, camera) {
        var textClip = object.textClip;
        if (textClip && object.parent.clippingEnabled) {
          this.value.set(textClip[0], textClip[1], textClip[2], textClip[3]);
        } else {
          this.value.set(-16384, -16384, 16384, 16384);
        }
      }
    }
  };

  var material = new _ThreeShim2.default.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: _ThreeShim2.default.DoubleSide,
    extensions: { derivatives: true }
  });

  material.premultipliedAlpha = true;
  material.depthWrite = false;
  material.transparent = true;

  function initFontData(data) {
    data.CharMap = [];
    data.MaxAscent = 0;
    data.MaxDescent = 0;
    for (var g in data.Glyphs) {
      var glyph = data.Glyphs[g];
      data.CharMap[glyph.CharCode] = glyph;
      var ascent = glyph.BearingY;
      var descent = glyph.Height - glyph.BearingY;
      if (ascent > data.MaxAscent) {
        data.MaxAscent = ascent;
      }
      if (descent > data.MaxDescent) {
        data.MaxDescent = descent;
      }
    }
  }

  function getDefaultFont() {
    var font = {
      CharMap: {},
      NaturalWidth: _DefaultFont.DEFAULT_FONT_JSON.NaturalWidth,
      NaturalHeight: _DefaultFont.DEFAULT_FONT_JSON.NaturalHeight,
      FontHeight: _DefaultFont.DEFAULT_FONT_JSON.FontHeight,
      MaxAscent: _DefaultFont.DEFAULT_FONT_JSON.MaxAscent,
      MaxDescent: _DefaultFont.DEFAULT_FONT_JSON.MaxDescent
    };
    var glyphs = _DefaultFont.DEFAULT_FONT_JSON.Glyphs;
    for (var i = glyphs.length; i--;) {
      var glyph = glyphs[i];
      var glyphData = {
        X: glyph[1],
        Y: glyph[2],
        Width: glyph[3],
        Height: glyph[4],
        AdvanceX: glyph[5],
        AdvanceY: glyph[6],
        BearingX: glyph[7],
        BearingY: glyph[8]
      };
      font.CharMap[glyph[0]] = glyphData;
    }
    return font;
  }

  var font = {
    data: null,
    material: material,
    fallbacks: []
  };

  if (!fontName) {
    font.data = getDefaultFont();
    return font;
  }

  var xhrLoader = loader || new _ThreeShim2.default.XHRLoader();
  return new Promise(function (resolve, reject) {
    xhrLoader.load(fontName, function (response) {
      var data = JSON.parse(response);
      initFontData(data);
      font.data = data;
      resolve(font);
    });
  });
}

function addFontFallback(fontObject, fallbackFontObject) {
  fontObject.fallbacks.push(fallbackFontObject);
}