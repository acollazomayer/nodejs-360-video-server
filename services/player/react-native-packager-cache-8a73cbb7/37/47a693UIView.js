
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UIView;

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

var _UIViewUtil = require('./UIViewUtil');

var _VectorGeometry = require('../FourByFourRect/VectorGeometry');

var _SDFFont = require('../SDFFont/SDFFont');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var DEFAULT_Z_OFFSET = 1;

var BACKGROUND_MAT_INDEX = 0;
var BORDER_MAT_INDEX = 1;
var IMAGE_MAT_INDEX = 2;

var DEFAULT_BACKGROUND_COLOR = 0xffffff;
var DEFAULT_BORDER_COLOR = 0x000000;
var DEFAULT_IMAGE_COLOR = 0xffffff;

var AnimationFunctions = {
  spring: function spring(dt) {
    return 1 + Math.pow(2, -10 * dt) * Math.sin((dt - 0.5 / 4) * Math.PI * 2 / 0.5);
  },
  linear: function linear(dt) {
    return dt;
  },
  easeInEaseOut: function easeInEaseOut(dt) {
    return dt < 0.5 ? 2 * dt * dt : -1 + (4 - 2 * dt) * dt;
  },
  easeIn: function easeIn(dt) {
    return dt * dt;
  },
  easeOut: function easeOut(dt) {
    return dt * (2 - dt);
  },
  keyboard: function keyboard(dt) {
    return dt;
  }
};

function UIView(guiSys, params) {
  _ThreeShim2.default.Object3D.call(this);

  this.type = 'UIView';
  this.clippingEnabled = false;
  this.clipPlanes = [new _ThreeShim2.default.Plane(new _ThreeShim2.default.Vector3(1, 0, 0), 16384), new _ThreeShim2.default.Plane(new _ThreeShim2.default.Vector3(-1, 0, 0), 16384), new _ThreeShim2.default.Plane(new _ThreeShim2.default.Vector3(0, 1, 0), 16384), new _ThreeShim2.default.Plane(new _ThreeShim2.default.Vector3(0, -1, 0), 16384)];

  this.geometry = new _ThreeShim2.default.PlaneGeometry(0, 0);
  this.backgroundMaterial = new _ThreeShim2.default.MeshBasicMaterial({
    clippingPlanes: this.clipPlanes,
    color: DEFAULT_BACKGROUND_COLOR,
    side: _ThreeShim2.default.DoubleSide
  });
  this.backgroundMaterial.transparent = true;
  this.backgroundMaterial.visible = false;
  this.backgroundMaterial.depthWrite = false;

  this.borderMaterial = new _ThreeShim2.default.MeshBasicMaterial({
    clippingPlanes: this.clipPlanes,
    color: DEFAULT_BORDER_COLOR,
    side: _ThreeShim2.default.DoubleSide
  });
  this.borderMaterial.transparent = true;
  this.borderMaterial.visible = false;
  this.borderMaterial.depthWrite = false;
  this.imageMaterial = new _ThreeShim2.default.MeshBasicMaterial({
    clippingPlanes: this.clipPlanes,
    color: DEFAULT_IMAGE_COLOR,
    side: _ThreeShim2.default.DoubleSide
  });
  this.imageMaterial.transparent = true;
  this.imageMaterial.visible = false;
  this.imageMaterial.depthWrite = false;
  this.material = new _ThreeShim2.default.MultiMaterial([this.backgroundMaterial, this.borderMaterial, this.imageMaterial]);
  this.material.side = _ThreeShim2.default.DoubleSide;
  this.guiSys = guiSys;
  this.zIndex = 0;

  this.drawMode = _ThreeShim2.default.TrianglesDrawMode;

  this.opacity = 1.0;
  this.dirtyGeometry = true;
  this.frame = [0, 0, 0, 0];
  this.targetFrame = [0, 0, 0, 0];
  this.frameDirty = true;
  this.inset = [0, 0, 0, 0];
  this.insetSize = [0, 0, 0, 0];

  this.hitSlop = [0, 0, 0, 0];
  this.cursorVisibilitySlop = [0, 0, 0, 0];
  this.borderWidth = [0, 0, 0, 0];
  this.borderRadius = [0, 0, 0, 0];
  this.scaleType = (0, _UIViewUtil.defaultScaleType)();
  this.textureDim = [0, 0];

  this.crop = [0, 0, 1, 1];
  this.backgroundOpacity = 1;
  this.borderOpacity = 1;
  this.imageOpacity = 1;
  this.matrixAutoUpdate = false;
  this.localRotate = new _ThreeShim2.default.Matrix4();
  this.localPosition = [0, 0, 0];

  this.layoutZOffset = DEFAULT_Z_OFFSET;

  this.text = null;
  this.textDirty = false;
  this.textHAlign = _SDFFont.CENTER_LINE;
  this.textLinecount = 0;
  this.textVAlign = _SDFFont.CENTER;
  this.textColor = new _ThreeShim2.default.Color();
  this.textSize = 2;
  this.textMesh = new _ThreeShim2.default.Mesh(new _ThreeShim2.default.BufferGeometry(), guiSys.font.material);
  this.textMesh.type = 'SDFText';
  this.textMesh.textClip = [-16384, -16384, 16384, 16384];
  this.textMesh.visible = false;
  this.textFontParms = {
    AlphaCenter: 0.47,
    ColorCenter: 0.5
  };

  this.autoScale = false;

  this.isInteractable = false;

  this.isMouseInteractable = false;

  this.pointerEvents = _UIViewUtil.PointerEvents.AUTO;

  this.billboarding = 'off';

  this.immediateListener = null;

  if (params !== undefined) {
    (0, _UIViewUtil.setParams)(this, params);
  }

  this.textMesh.raycast = function () {};
  this.add(this.textMesh);
}

UIView.prototype = babelHelpers.extends(Object.create(_ThreeShim2.default.Object3D.prototype), {
  constructor: UIView,

  isMesh: true,

  isGui: true,

  updateGeometry: function (updateContext) {
    var transform = new _ThreeShim2.default.Matrix4();
    var config = {
      frame: [0, 0, 0, 0]
    };
    return function (updateContext) {
      if (!this.dirtyGeometry) {
        return;
      }

      if (this.text) {
        if (this.textDirty) {
          if (this.autoScale) {
            config.dim = (0, _SDFFont.measureText)(this.guiSys.font, this.text, this.textSize);
            this.frame[2] = config.dim.maxWidth;
            this.frame[3] = config.dim.maxHeight;
          }
          config.frame[0] = -this.frame[2] / 2;
          config.frame[1] = -this.frame[3] / 2;
          config.frame[2] = this.frame[2];
          config.frame[3] = this.frame[3];
          config.hAlign = this.textHAlign;
          config.vAlign = this.textVAlign;
          config.lineCount = this.textLinecount;
          config.fontParms = this.textFontParms;
          config.autoScale = this.autoScale;
          this.textMesh.geometry.dispose();
          this.textMesh.geometry = new _SDFFont.BitmapFontGeometry(this.guiSys.font, this.text, this.textSize, config);
          this.textMesh.visible = !!this.textMesh.geometry;
          this.textMesh.material = this.textMesh.geometry.materials;
          this.textMesh.position.z = 0.01;
          this.textDirty = false;
        }
      } else {
        this.textMesh.geometry.dispose();
        this.textMesh.visible = false;
        this.textDirty = false;
      }

      var x = this.frame[0] + this.frame[2] / 2;
      var y = this.frame[1] - this.frame[3] / 2;
      var z = this.layoutZOffset * this.guiSys.ZOffsetScale;
      if (this.parent && this.parent.frame) {
        x -= this.parent.frame[2] / 2;
        y += this.parent.frame[3] / 2;
      }

      if (this.localTransform) {
        this.matrix.fromArray(this.localTransform);
        this.matrix.elements[12] += x;
        this.matrix.elements[13] += y;
        this.matrix.elements[14] += z;
      } else {
        transform.makeTranslation(x + this.localPosition[0], y + this.localPosition[1], z + this.localPosition[2]);
        this.matrix.multiplyMatrices(transform, this.localRotate);
      }

      if (this.frameDirty) {
        this.geometry.dispose();
        this.geometry = new _VectorGeometry.VectorGeometry([this.frame[2], this.frame[3]], this.borderMaterial.visible ? this.borderWidth : undefined, this.borderRadius, BACKGROUND_MAT_INDEX, IMAGE_MAT_INDEX, BORDER_MAT_INDEX);
        this.needsUpdate = true;
        this.frameDirty = false;
      }
      this.dirtyGeometry = false;
    };
  }(),

  updateBillboard: function (updateContext) {
    var thisPosition = new _ThreeShim2.default.Vector3();
    var camPosition = new _ThreeShim2.default.Vector3();
    var camAxisX = new _ThreeShim2.default.Vector3();
    var camAxisY = new _ThreeShim2.default.Vector3();
    var camAxisZ = new _ThreeShim2.default.Vector3();
    var newAxisX = new _ThreeShim2.default.Vector3();
    var newAxisY = new _ThreeShim2.default.Vector3();
    var newAxisZ = new _ThreeShim2.default.Vector3();
    var up = new _ThreeShim2.default.Vector3(0, 1, 0);
    var rotationMatrix = new _ThreeShim2.default.Matrix4();
    var parentMatrixWorldInverse = new _ThreeShim2.default.Matrix4();
    var parentRotationInverse = new _ThreeShim2.default.Matrix4();

    return function (updateContext) {
      var camMatrixWorld = updateContext.camera.matrixWorld;
      thisPosition.setFromMatrixPosition(this.matrixWorld);
      camPosition.setFromMatrixPosition(camMatrixWorld);
      camMatrixWorld.extractBasis(camAxisX, camAxisY, camAxisZ);

      newAxisY.copy(up);

      newAxisZ.copy(camAxisZ);
      newAxisZ.y = 0;
      newAxisZ.normalize();

      newAxisX.crossVectors(newAxisY, newAxisZ).normalize();

      rotationMatrix.identity();
      var e = rotationMatrix.elements;
      e[0] = newAxisX.x;
      e[4] = newAxisY.x;
      e[8] = newAxisZ.x;
      e[1] = newAxisX.y;
      e[5] = newAxisY.y;
      e[9] = newAxisZ.y;
      e[2] = newAxisX.z;
      e[6] = newAxisY.z;
      e[10] = newAxisZ.z;

      if (this.parent) {
        parentMatrixWorldInverse.getInverse(this.parent.matrixWorld);
        parentRotationInverse.extractRotation(parentMatrixWorldInverse);
        rotationMatrix.multiply(parentRotationInverse);
      }

      this.matrix.extractRotation(rotationMatrix);
    };
  }(),

  applyUpdates: function applyUpdates(opacity, updateContext) {
    this.updateGeometry(updateContext);
    this.backgroundMaterial.opacity = opacity * this.backgroundOpacity;
    this.borderMaterial.opacity = opacity * this.borderOpacity;
    this.imageMaterial.opacity = opacity * this.imageOpacity;
    this.textMesh.opacity = opacity;
  },

  setFrame: function setFrame(x, y, width, height, animator) {
    if (x === this.targetFrame[0] && y === this.targetFrame[1] && width === this.targetFrame[2] && height === this.targetFrame[3]) {
      return;
    }
    this.targetFrame[0] = x;
    this.targetFrame[1] = y;
    this.targetFrame[2] = width;
    this.targetFrame[3] = height;
    if (animator) {
      var self = this;
      var startFrame = [this.frame[0], this.frame[1], this.frame[2], this.frame[3]];
      var startTime = Date.now();
      var animState = this.frame[2] === 0 && this.frame[3] === 0 && animator.create ? animator.create : animator.update;

      var frameAnimation = function frameAnimation(curTime) {
        var deltaTime = curTime - startTime;
        var dt = animState ? AnimationFunctions[animState.type](Math.min(1, deltaTime / animator.duration)) : 1;
        var omdt = 1 - dt;
        self.frame[0] = startFrame[0] * omdt + x * dt;
        self.frame[1] = startFrame[1] * omdt + y * dt;
        self.frame[2] = startFrame[2] * omdt + width * dt;
        self.frame[3] = startFrame[3] * omdt + height * dt;
        self.dirtyGeometry = true;
        self.frameDirty = true;
        if (deltaTime < animator.duration && animState) {
          self.animatorHandle = self.guiSys.requestFrameFunction(frameAnimation);
        } else {
          self.animatorHandle = null;
        }
      };

      this.guiSys.cancelFrameFunction(self.animatorHandle);
      frameAnimation(startTime);
    } else {
      this.frame[0] = x;
      this.frame[1] = y;
      this.frame[2] = width;
      this.frame[3] = height;
      this.dirtyGeometry = true;
      this.frameDirty = true;
    }
  },

  setHitSlop: function setHitSlop(l, t, r, b) {
    this.hitSlop[0] = l;
    this.hitSlop[1] = t;
    this.hitSlop[2] = r;
    this.hitSlop[3] = b;
  },

  setCursorVisibilitySlop: function setCursorVisibilitySlop(l, t, r, b) {
    this.cursorVisibilitySlop[0] = l;
    this.cursorVisibilitySlop[1] = t;
    this.cursorVisibilitySlop[2] = r;
    this.cursorVisibilitySlop[3] = b;
  },

  setLayoutZOffset: function setLayoutZOffset(offset) {
    this.layoutZOffset = offset;
    this.dirtyGeometry = true;
  },

  setLocalTransform: function setLocalTransform(transform) {
    this.localTransform = transform.slice();
    this.dirtyGeometry = true;
  },

  setLocalRotation: function setLocalRotation(quatOrEuler) {
    if (quatOrEuler.isEuler) {
      this.localRotate.makeRotationFromEuler(quatOrEuler);
    } else {
      this.localRotate.makeRotationFromQuaternion(quatOrEuler);
    }
    this.localTransform = undefined;
    this.dirtyGeometry = true;
  },

  setLocalPosition: function setLocalPosition(position) {
    this.localTransform = undefined;
    this.localPosition[0] = position[0];
    this.localPosition[1] = position[1];
    this.localPosition[2] = position[2];
    this.dirtyGeometry = true;
  },

  setImage: function setImage(url, loaded, invisibleTillLoad) {
    var _this = this;

    if (url) {
      if (this.imageMaterial.mapurl === url) {
        loaded && loaded(true, this.imageMaterial.map.naturalWidth, this.imageMaterial.map.naturalHeight);
        return;
      }

      delete this.imageMaterial.mapurl;

      var loader = new _ThreeShim2.default.TextureLoader();
      loader.setCrossOrigin('Access-Control-Allow-Origin');
      loader.load(url, function (texture) {
        _this.imageMaterial.map = texture;
        _this.imageMaterial.mapurl = url;

        _this.updateOffsetRepeat();
        _this.imageMaterial.visible = true;
        _this.imageMaterial.needsUpdate = true;
        loaded && loaded(true, texture.image.naturalWidth, texture.image.naturalHeight);
      }, function (xhr) {}, function (xhr) {
        _this.imageMaterial.map && _this.imageMaterial.map.dispose();
        _this.imageMaterial.map = undefined;
        loaded && loaded(false);
      });
      this.imageMaterial.visible = !!invisibleTillLoad;
    } else {
      this.imageMaterial.map && this.imageMaterial.map.dispose();
      this.imageMaterial.map = undefined;
      this.imageMaterial.visible = false;
      loaded && loaded(false);
    }
    this.imageMaterial.needsUpdate = true;
  },

  setImageTexture: function setImageTexture(texture) {
    if (!texture) {
      if (this.imageMaterial.mapurl) {
        this.imageMaterial.map && this.imageMaterial.map.dispose();

        delete this.imageMaterial.mapurl;
      }

      delete this.imageMaterial.map;

      this.imageMaterial.visible = false;
    } else if (texture instanceof _ThreeShim2.default.Texture || texture.isWebGLRenderTarget) {
      delete this.imageMaterial.mapurl;

      this.imageMaterial.map = texture;

      this.updateOffsetRepeat();

      this.imageMaterial.visible = true;
    } else {
      throw new Error('Image textures must be of type THREE.Texture');
    }

    this.imageMaterial.needsUpdate = true;
  },

  setClipPlanes: function setClipPlanes(rect) {
    this.clipPlanes[0].setComponents(1, 0, 0, -rect[0]);
    this.clipPlanes[1].setComponents(-1, 0, 0, rect[2]);
    this.clipPlanes[2].setComponents(0, 1, 0, -rect[1]);
    this.clipPlanes[3].setComponents(0, -1, 0, rect[3]);
  },

  setImageColor: function setImageColor() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args[0] == null) {
      this.imageOpacity = 1.0;
      this.imageMaterial.color.set(DEFAULT_IMAGE_COLOR);
    } else {
      this.imageOpacity = typeof args[0] === 'number' ? (args[0] >> 24 & 0xff) / 255.0 : 1.0;
      this.imageMaterial.color.set.apply(this.imageMaterial.color, args);
    }
    this.imageMaterial.needsUpdate = true;
  },

  setBackgroundColor: function setBackgroundColor() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (args[0] == null) {
      this.backgroundOpacity = 1.0;
      this.backgroundMaterial.color.set(DEFAULT_BACKGROUND_COLOR);
      this.backgroundMaterial.visible = false;
    } else {
      this.backgroundOpacity = typeof args[0] === 'number' ? (args[0] >> 24 & 0xff) / 255.0 : 1.0;
      this.backgroundMaterial.color.set.apply(this.backgroundMaterial.color, args);
      this.backgroundMaterial.visible = true;
    }
    this.backgroundMaterial.needsUpdate = true;
  },

  setBorderColor: function setBorderColor() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    if (args[0] == null) {
      this.borderOpacity = 1.0;
      this.borderMaterial.color.set(DEFAULT_BORDER_COLOR);
    } else {
      this.borderOpacity = typeof args[0] === 'number' ? (args[0] >> 24 & 0xff) / 255.0 : 1.0;
      this.borderMaterial.color.set.apply(this.borderMaterial.color, arguments);
    }
    this.borderMaterial.needsUpdate = true;
  },

  setInset: function setInset(inset) {
    this.inset = inset.slice();
    this.dirtyGeometry = true;
  },

  setInsetSize: function setInsetSize(insetSize) {
    this.insetSize = insetSize.slice();
    this.dirtyGeometry = true;
  },

  setBorderWidth: function setBorderWidth(width) {
    var newValue = void 0;
    if (typeof width === 'number') {
      newValue = [width, width, width, width];
    } else {
      newValue = width;
    }
    if (newValue[0] !== this.borderWidth[0] || newValue[1] !== this.borderWidth[1] || newValue[2] !== this.borderWidth[2] || newValue[3] !== this.borderWidth[3]) {
      this.borderWidth = newValue.slice();
      this.borderMaterial.visible = newValue[0] > 0 || newValue[1] > 0 || newValue[2] > 0 || newValue[3] > 0;
      this.frameDirty = true;
      this.dirtyGeometry = true;
    }
  },

  setBorderRadius: function setBorderRadius(borderRadius) {
    for (var i = 0; i < 4; i++) {
      if (this.borderRadius[i] !== borderRadius[i]) {
        this.borderRadius[i] = borderRadius[i];
        this.frameDirty = true;
        this.dirtyGeometry = true;
      }
    }
  },

  setResizeMode: function setResizeMode(resizeModeValue) {
    var scaleType = (0, _UIViewUtil.resizeModetoScaleType)(resizeModeValue);
    if (this.scaleType !== scaleType) {
      this.scaleType = scaleType;
      this.frameDirty = true;
      this.dirtyGeometry = true;
    }
  },

  setTextureCrop: function setTextureCrop(crop) {
    this.crop = crop.slice();
    this.updateOffsetRepeat();
  },

  updateOffsetRepeat: function updateOffsetRepeat() {
    if (!this.imageMaterial.map) {
      return;
    }

    var offset = new _ThreeShim2.default.Vector2(this.crop[0], 1 - (this.crop[1] + this.crop[3]));
    var repeat = new _ThreeShim2.default.Vector2(this.crop[2], this.crop[3]);
    if (this.imageMaterial.map.offset === offset && this.imageMaterial.map.repeat === repeat) {
      return;
    }

    this.imageMaterial.map.offset = offset;
    this.imageMaterial.map.repeat = repeat;
    this.imageMaterial.needsUpdate = true;

    var width = this.imageMaterial.map.image ? this.imageMaterial.map.image.width : 0;
    var height = this.imageMaterial.map.image ? this.imageMaterial.map.image.height : 0;
    if (width !== this.textureDim[0] || height !== this.textureDim[0]) {
      this.textureDim = [width, height];
      this.frameDirty = true;
      this.dirtyGeometry = true;
    }
  },

  setOpacity: function setOpacity(value) {
    this.opacity = value;
    this.visible = value > 0;
  },

  setAlphaTest: function setAlphaTest(value) {
    this.imageMaterial.alphaTest = value;
    this.imageMaterial.needsUpdate = true;
  },

  setText: function setText(text) {
    this.text = text;
    this.textDirty = true;
    this.dirtyGeometry = true;
  },

  setTextAlphaCenter: function setTextAlphaCenter(alphaCenter) {
    this.textFontParms.AlphaCenter = alphaCenter;
    this.dirtyGeometry = true;
  },

  setTextColor: function setTextColor(value) {
    this.textColor.set(value);
  },

  setTextColorCenter: function setTextColorCenter(colorCenter) {
    this.textFontParms.ColorCenter = colorCenter;
    this.dirtyGeometry = true;
  },

  setTextHAlign: function setTextHAlign(textAlign) {
    this.textDirty = true;
    this.textHAlign = textAlign;
    this.dirtyGeometry = true;
  },

  setTextLinecount: function setTextLinecount(count) {
    this.textDirty = true;
    this.textLinecount = count;
    this.dirtyGeometry = true;
  },

  setTextSize: function setTextSize(textSize) {
    this.textDirty = true;
    this.textSize = textSize;
    this.dirtyGeometry = true;
  },

  setTextVAlign: function setTextVAlign(textAlign) {
    this.textDirty = true;
    this.textVAlign = textAlign;
    this.dirtyGeometry = true;
  },

  setAutoScale: function setAutoScale(autoScale) {
    this.autoScale = autoScale;
  },

  setIsInteractable: function setIsInteractable(isInteractable) {
    this.isInteractable = isInteractable;
  },

  setIsMouseInteractable: function setIsMouseInteractable(isMouseInteractable) {
    this.isMouseInteractable = isMouseInteractable;
  },

  setPointerEvents: function setPointerEvents(pointerEvents) {
    this.pointerEvents = pointerEvents;
  },

  setBillboarding: function setBillboarding(billboarding) {
    this.billboarding = billboarding;
  },

  calcWorldClipRect: function calcWorldClipRect() {
    if (!this.clippingEnabled) {
      return [0, 0, 16384, 16384];
    }
    return [this.matrixWorld.elements[12] - this.frame[2] / 2, this.matrixWorld.elements[13] - this.frame[3] / 2, this.matrixWorld.elements[12] + this.frame[2] / 2, this.matrixWorld.elements[13] + this.frame[3] / 2];
  },

  setImmediateListener: function setImmediateListener(listener) {
    this.immediateListener = listener;
  },

  shouldAcceptHitEvent: function shouldAcceptHitEvent() {
    return !(this.pointerEvents === _UIViewUtil.PointerEvents.NONE || this.pointerEvents === _UIViewUtil.PointerEvents.BOX_NONE);
  },

  shouldInterceptHitEvent: function shouldInterceptHitEvent() {
    return this.pointerEvents === _UIViewUtil.PointerEvents.NONE || this.pointerEvents === _UIViewUtil.PointerEvents.BOX_ONLY;
  },

  forceRaycastTest: function forceRaycastTest(enabled) {
    this.forceRaycastTestEnabled = enabled;
  },

  raycast: function () {
    var inverseMatrix = new _ThreeShim2.default.Matrix4();
    var ray = new _ThreeShim2.default.Ray();

    var vTL = new _ThreeShim2.default.Vector3();
    var vTR = new _ThreeShim2.default.Vector3();
    var vBL = new _ThreeShim2.default.Vector3();
    var vBR = new _ThreeShim2.default.Vector3();

    function intersectRectangle(frame, slop) {
      var xMin = -frame[2] / 2 - slop[0];
      var yMin = -frame[3] / 2 - slop[3];
      var xMax = frame[2] / 2 + slop[2];
      var yMax = frame[3] / 2 + slop[1];
      vTL.fromArray([xMin, yMax, 0]);
      vTR.fromArray([xMax, yMax, 0]);
      vBL.fromArray([xMin, yMin, 0]);
      vBR.fromArray([xMax, yMin, 0]);

      var intersect = ray.intersectTriangle(vTL, vTR, vBR, false, intersectionPoint);
      intersect = intersect || ray.intersectTriangle(vTL, vBR, vBL, false, intersectionPoint);
      if (intersect) {
        var width = xMax - xMin;
        var height = yMax - yMin;

        intersectionNormalized.set((intersectionPoint.x + width / 2) / width, (-intersectionPoint.y + height / 2) / height, 0);
      }
      return intersect;
    }

    var intersectionNormalized = new _ThreeShim2.default.Vector3();
    var intersectionPoint = new _ThreeShim2.default.Vector3();
    var intersectionPointWorld = new _ThreeShim2.default.Vector3();

    return function raycast(raycaster, intersects) {
      var material = this.material;

      if (!this.forceRaycastTestEnabled) {
        if (material === undefined) return;

        if (this.backgroundMaterial.opacity < 1 / 255 && this.borderMaterial.opacity < 1 / 255 && this.imageMaterial.opacity < 1 / 255) return;

        if (!this.backgroundMaterial.visible && !this.borderMaterial.visible && !this.imageMaterial.visible) return;
      }

      inverseMatrix.getInverse(this.matrixWorld);
      ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

      var intersect = intersectRectangle(this.frame, this.hitSlop);
      var isAlmostHit = false;
      if (!intersect) {
        var needsUpdate = this.cursorVisibilitySlop[0] > this.hitSlop[0] || this.cursorVisibilitySlop[1] > this.hitSlop[1] || this.cursorVisibilitySlop[2] > this.hitSlop[2] || this.cursorVisibilitySlop[3] > this.hitSlop[3];
        if (this.guiSys.cursorVisibility === 'auto' && needsUpdate) {
          intersect = intersectRectangle(this.frame, this.cursorVisibilitySlop);
        }
        if (!intersect) {
          return;
        }
        isAlmostHit = true;
      }

      intersectionPointWorld.copy(intersect);
      intersectionPointWorld.applyMatrix4(this.matrixWorld);

      var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

      if (distance < raycaster.near || distance > raycaster.far) return;

      intersects.push({
        distance: distance,
        point: intersectionPointWorld.clone(),
        object: this,
        isAlmostHit: isAlmostHit,
        uv: intersectionNormalized.clone()
      });
    };
  }(),


  clone: function clone() {
    return new this.constructor(this.material).copy(this);
  },

  dispose: function dispose() {
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
  }
});