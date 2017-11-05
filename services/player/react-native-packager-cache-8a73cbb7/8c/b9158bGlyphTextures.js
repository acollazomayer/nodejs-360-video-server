Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

function drawGlyph(context, instructions) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#ffffff';

  context.fillStyle = color;
  for (var i = 0, length = instructions.length; i < length; i++) {
    switch (instructions[i][0]) {
      case 'move':
        {
          var x = instructions[i][1];
          var y = instructions[i][2];
          context.moveTo(x, y);
          break;
        }
      case 'line':
        {
          var _x2 = instructions[i][1];
          var _y = instructions[i][2];
          context.lineTo(_x2, _y);
          break;
        }
      case 'arc':
        {
          var _x3 = instructions[i][1];
          var _y2 = instructions[i][2];
          var radius = instructions[i][3];
          var startAngle = instructions[i][4];
          var endAngle = instructions[i][5];
          var anticlockwise = !!instructions[i][6];
          context.arc(_x3, _y2, radius, startAngle, endAngle, anticlockwise);
          break;
        }
      case 'rect':
        {
          var _x4 = instructions[i][1];
          var _y3 = instructions[i][2];
          var _width = instructions[i][3];
          var _height = instructions[i][4];
          context.rect(_x4, _y3, _width, _height);
          break;
        }
      case 'begin':
        context.beginPath();
        break;
      case 'end':
        context.fill();
        break;
    }
  }
  if (instructions.length && instructions[instructions.length - 1][0] !== 'end') {
    context.fill();
  }
}

var GlyphTextures = function (_Module) {
  babelHelpers.inherits(GlyphTextures, _Module);

  function GlyphTextures(rnctx) {
    babelHelpers.classCallCheck(this, GlyphTextures);

    var _this = babelHelpers.possibleConstructorReturn(this, (GlyphTextures.__proto__ || Object.getPrototypeOf(GlyphTextures)).call(this, 'GlyphTextures'));

    _this._rnctx = rnctx;
    return _this;
  }

  babelHelpers.createClass(GlyphTextures, [{
    key: 'registerGlyph',
    value: function registerGlyph(name, glyph) {
      var canvas = document.createElement('canvas');
      canvas.width = glyph.width;
      canvas.height = glyph.height;
      var context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not generate 2d context of canvas');
      }
      context.translate(0.5, 0.5);
      drawGlyph(context, glyph.instructions, glyph.color);
      var url = 'glyph/' + name;
      this._rnctx.TextureManager.registerLocalTextureSource(url, canvas);
    }
  }]);
  return GlyphTextures;
}(_Module3.default);

exports.default = GlyphTextures;