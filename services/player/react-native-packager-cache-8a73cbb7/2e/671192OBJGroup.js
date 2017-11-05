Object.defineProperty(exports, "__esModule", {
  value: true
});

var OBJGroup = function () {
  function OBJGroup(vertices, textureCoords, normals) {
    var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    babelHelpers.classCallCheck(this, OBJGroup);

    this.name = name;
    this.vertices = vertices;
    this.textureCoords = textureCoords;
    this.normals = normals;
    this.smooth = false;
    this.materials = [];
    this.geometry = {
      position: [],
      normal: [],
      uv: [],
      color: [],
      indexedPositions: {},
      index: [],
      hasNormals: false,
      hasUVs: false,
      hasVertexColors: false
    };
  }

  babelHelpers.createClass(OBJGroup, [{
    key: 'setSmoothing',
    value: function setSmoothing(smooth) {
      this.smooth = smooth;
    }
  }, {
    key: 'addFace',
    value: function addFace(face) {
      var positions = [];
      var uvs = [];
      var normals = [];
      for (var i = 0; i < face.length; i++) {
        positions.push(face[i][0] < 0 ? face[i][0] + this.vertices.length : face[i][0] - 1);
        if (!face[i][1]) {
          uvs.push(-1);
        } else {
          uvs.push(face[i][1] < 0 ? face[i][1] + this.vertices.length : face[i][1] - 1);
          this.geometry.hasUVs = true;
        }
        if (!face[i][2]) {
          normals.push(-1);
        } else {
          normals.push(face[i][2] < 0 ? face[i][2] + this.vertices.length : face[i][2] - 1);
          this.geometry.hasNormals = true;
        }
      }

      for (var iter = 1; iter + 1 < face.length; iter++) {
        this._pushGeometryPoint(positions[0], uvs[0], normals[0]);
        this._pushGeometryPoint(positions[iter], uvs[iter], normals[iter]);
        this._pushGeometryPoint(positions[iter + 1], uvs[iter + 1], normals[iter + 1]);
      }
    }
  }, {
    key: 'addMaterial',
    value: function addMaterial(name, lib) {
      var currentGroup = this.geometry.index.length;
      if (this.materials.length > 0) {
        var last = this.materials[this.materials.length - 1];
        last.endGroup = currentGroup;
      }
      this.materials.push({
        name: name,
        lib: lib,
        startGroup: currentGroup,
        endGroup: -1
      });
    }
  }, {
    key: '_pushGeometryPoint',
    value: function _pushGeometryPoint(position, uv, normal) {
      var vertex = this.vertices[position];
      var textureCoord = uv < 0 ? [0, 0] : this.textureCoords[uv];
      var norm = normal < 0 ? [0, 0, 1] : this.normals[normal];
      var key = [position, uv, normal].join(',');
      var knownIndex = this.geometry.indexedPositions[key];

      if (knownIndex === undefined) {
        var location = this.geometry.position.length / 3 | 0;
        this.geometry.position.push(vertex[0]);
        this.geometry.position.push(vertex[1]);
        this.geometry.position.push(vertex[2]);
        this.geometry.uv.push(textureCoord[0]);
        this.geometry.uv.push(textureCoord[1]);
        this.geometry.normal.push(norm[0]);
        this.geometry.normal.push(norm[1]);
        this.geometry.normal.push(norm[2]);
        this.geometry.index.push(location);
        this.geometry.indexedPositions[key] = location;

        if (vertex.length >= 6) {
          this.geometry.color.push(vertex[3]);
          this.geometry.color.push(vertex[4]);
          this.geometry.color.push(vertex[5]);
          this.geometry.hasVertexColors = true;
        }
      } else {
        this.geometry.index.push(knownIndex);
      }
    }
  }]);
  return OBJGroup;
}();

exports.default = OBJGroup;