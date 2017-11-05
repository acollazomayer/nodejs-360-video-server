

var NativeModules = require('NativeModules');
var GlyphTextures = NativeModules.GlyphTextures;

var nextGlyph = 1;

function createGlyph(glyph, name) {
  if (typeof name !== 'string') {
    name = nextGlyph;
    nextGlyph++;
  }
  var uri = 'texture://glyph/' + name;
  GlyphTextures.registerGlyph(name, glyph);

  return { uri: uri };
}

module.exports = createGlyph;