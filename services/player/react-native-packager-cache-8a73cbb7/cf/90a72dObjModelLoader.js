Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MTLLoader = require('../Loaders/WavefrontOBJ/MTLLoader');

var _OBJLoader = require('../Loaders/WavefrontOBJ/OBJLoader');

var _three = require('three');

var _extractURL = require('../Utils/extractURL');

var _extractURL2 = babelHelpers.interopRequireDefault(_extractURL);

var ObjMeshInstance = function () {
  function ObjMeshInstance(value, parent, litMaterial, unlitMaterial) {
    babelHelpers.classCallCheck(this, ObjMeshInstance);

    this._lit = true;
    this._objURL = null;
    this._mtlURL = null;
    this._objState = null;
    this._update = null;
    this._view = parent;
    this._mesh = null;
    this._litMaterial = litMaterial;
    this._unlitMaterial = unlitMaterial;

    if (value.hasOwnProperty('obj')) {
      var resource = null;
      if (value.obj) {
        var url = (0, _extractURL2.default)(value.obj);
        if (!url) {
          throw new Error('Invalid value for "obj" property: ' + JSON.stringify(value.obj));
        }
        resource = url;
      }
      if (resource !== this._objURL) {
        this._setOBJ(resource);
      }
    }
    if (value.hasOwnProperty('mtl')) {
      var _resource = null;
      if (value.mtl) {
        var _url = (0, _extractURL2.default)(value.mtl);
        if (!_url) {
          throw new Error('Invalid value for "mtl" property: ' + JSON.stringify(value.mtl));
        }
        _resource = _url;
      }
      if (_resource !== this._mtlURL) {
        this._setMTL(_resource);
      }
    }
  }

  babelHelpers.createClass(ObjMeshInstance, [{
    key: '_setOBJ',
    value: function _setOBJ(value) {
      var _this = this;

      if (!value) {
        if (this._objURL) {
          this._objState = null;
          (0, _OBJLoader.removeOBJReference)(this._objURL);
          this._objURL = null;
        }
        if (this._mesh) {
          this._view.remove(this._mesh);
          if (typeof this._mesh.dispose === 'function') {
            this._mesh.dispose();
          }
          this._mesh = null;
        }
        return;
      }

      (0, _OBJLoader.fetchAndCacheOBJ)(value).then(function (state) {
        _this._objURL = value;
        _this._objState = state;
        if (_this._mesh) {
          _this._view.remove(_this._mesh);
          if (typeof _this._mesh.dispose === 'function') {
            _this._mesh.dispose();
          }
        }
        if (_this._view) {
          _this._mesh = _this._updateMeshes();
          _this._view.add(_this._mesh);
        }
      }, function (err) {
        console.error('Failed to fetch resource: ' + JSON.stringify(value));
      }).catch(function (err) {
        console.error('Failed to update mesh:', err);
      });
    }
  }, {
    key: '_setMTL',
    value: function _setMTL(value) {
      var _this2 = this;

      if (!value) {
        if (this._mtlURL) {
          this._materialMap = null;
          (0, _MTLLoader.removeMTLReference)(this._mtlURL);
          this._mtlURL = null;
        }
        if (!this._mesh) {
          return;
        }
        var material = this._lit ? this._litMaterial : this._unlitMaterial;
        if (this._mesh.type === 'Group') {
          this._mesh.children.forEach(function (c) {
            c.material = material;
          });
        } else {
          this._mesh.material = material;
        }
        return;
      }

      var url = (0, _extractURL2.default)(value);
      if (!url) {
        throw new Error('Invalid value for "mtl" property: ' + JSON.stringify(value));
      }
      (0, _MTLLoader.fetchAndCacheMTL)(url).then(function (map) {
        _this2._mtlURL = url;
        _this2._materialMap = map;

        if (_this2._mesh) {
          _this2._updateMeshes(_this2._mesh);
        }
      }, function (err) {
        console.error('Failed to fetch resource: ' + url);
      }).catch(function (err) {
        console.error('Failed to update mesh:', err);
      });
    }
  }, {
    key: '_updateMeshes',
    value: function _updateMeshes(previousGroup) {
      var _this3 = this;

      if (!this._objState) {
        return;
      }
      var fallbackMaterial = this._lit ? this._litMaterial : this._unlitMaterial;
      var group = previousGroup || new _three.Group();
      var index = 0;
      this._objState.objects.forEach(function (obj) {
        var geometry = obj.geometry;
        if (geometry.position.length < 1) {
          return;
        }
        var materials = obj.materials.filter(function (m) {
          return m.startGroup < m.endGroup || m.endGroup < 0;
        });
        var bufferGeometry = previousGroup ? null : new _three.BufferGeometry();
        if (bufferGeometry) {
          bufferGeometry.addAttribute('position', new _three.BufferAttribute(new Float32Array(geometry.position), 3));
          bufferGeometry.setIndex(new _three.BufferAttribute(new Uint32Array(geometry.index), 1));
          if (geometry.hasUVs) {
            bufferGeometry.addAttribute('uv', new _three.BufferAttribute(new Float32Array(geometry.uv), 2));
          }
          if (geometry.hasNormals) {
            bufferGeometry.addAttribute('normal', new _three.BufferAttribute(new Float32Array(geometry.normal), 3));
          } else {
            bufferGeometry.computeVertexNormals();
          }
          if (geometry.hasVertexColors) {
            bufferGeometry.addAttribute('color', new _three.BufferAttribute(new Float32Array(geometry.color), 3));

            _this3._litMaterial.vertexColors = _three.VertexColors;
            _this3._unlitMaterial.vertexColors = _three.VertexColors;
          } else {
            _this3._litMaterial.vertexColors = _three.NoColors;
            _this3._unlitMaterial.vertexColors = _three.NoColors;
          }
        }

        var material = fallbackMaterial;
        if (materials.length === 1) {
          material = _this3._getMaterial(materials[0].name);
        } else if (materials.length > 1) {
          var multi = [];
          for (var i = 0; i < materials.length; i++) {
            var end = materials[i].endGroup;
            if (end < 0) {
              end = geometry.index.length;
            }
            var length = end - materials[i].startGroup;
            if (length > 0) {
              if (bufferGeometry) {
                bufferGeometry.addGroup(materials[i].startGroup, length, i);
              }
              multi.push(_this3._getMaterial(materials[i].name));
            }
          }
          material = new _three.MultiMaterial(multi);
        }
        material.shading = obj.smooth ? _three.SmoothShading : _three.FlatShading;
        if (previousGroup) {
          var mesh = group.children[index];
          if (mesh && mesh instanceof _three.Mesh) {
            mesh.material = material;
          }
        } else if (bufferGeometry) {
          var _mesh = new _three.Mesh(bufferGeometry, material);
          group.add(_mesh);
        }
        index++;
      });
      return group;
    }
  }, {
    key: '_getMaterial',
    value: function _getMaterial(name) {
      if (!this._materialMap) {
        return this._lit ? this._litMaterial : this._unlitMaterial;
      }
      var material = this._materialMap[name];
      if (!material) {
        if (__DEV__) {
          console.warn('OBJ attempted to load unknown material: ' + name);
        }
        return this._lit ? this._litMaterial : this._unlitMaterial;
      }
      return this._lit ? material.lit : material.unlit;
    }
  }, {
    key: 'update',
    value: function update(definition) {
      return false;
    }
  }, {
    key: 'setLit',
    value: function setLit(flag) {
      var changed = this._lit !== flag;
      this._lit = flag;
      if (changed) {
        this._updateMeshes(this._mesh);
      }
    }
  }, {
    key: 'setTexture',
    value: function setTexture(value) {}
  }, {
    key: 'setWireframe',
    value: function setWireframe(value) {
      if (__DEV__) {
        console.log('Wireframe mode is not currently supported for OBJ models');
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this._mtlURL) {
        this._materialMap = null;
        (0, _MTLLoader.removeMTLReference)(this._mtlURL);
        this._mtlURL = null;
      }
      if (this._objURL) {
        this._objState = null;
        (0, _OBJLoader.removeOBJReference)(this._objURL);
        this._objURL = null;
      }
      if (this._mesh) {
        this._view.remove(this._mesh);
        if (typeof this._mesh.dispose === 'function') {
          this._mesh.dispose();
        }
        this._mesh = null;
      }
      return;
    }
  }]);
  return ObjMeshInstance;
}();

var ObjModelLoader = function () {
  function ObjModelLoader() {
    babelHelpers.classCallCheck(this, ObjModelLoader);
  }

  babelHelpers.createClass(ObjModelLoader, [{
    key: 'canLoad',
    value: function canLoad(definition) {
      return definition && definition.hasOwnProperty('obj');
    }
  }, {
    key: 'createInstance',
    value: function createInstance(definition, parent, litMaterial, unlitMaterial) {
      return new ObjMeshInstance(definition, parent, litMaterial, unlitMaterial);
    }
  }]);
  return ObjModelLoader;
}();

exports.default = ObjModelLoader;