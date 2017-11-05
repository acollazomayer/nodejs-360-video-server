
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _ThreeShim = require('../ThreeShim');

var _ThreeShim2 = _interopRequireDefault(_ThreeShim);

var _SDFFont = require('../SDFFont/SDFFont');

var _GuiSysEvent = require('./GuiSysEvent');

var _GamepadEventInput = require('../Inputs/GamepadEventInput');

var _GamepadEventInput2 = _interopRequireDefault(_GamepadEventInput);

var _KeyboardEventInput = require('../Inputs/KeyboardEventInput');

var _KeyboardEventInput2 = _interopRequireDefault(_KeyboardEventInput);

var _MouseEventInput = require('../Inputs/MouseEventInput');

var _MouseEventInput2 = _interopRequireDefault(_MouseEventInput);

var _TouchEventInput = require('../Inputs/TouchEventInput');

var _TouchEventInput2 = _interopRequireDefault(_TouchEventInput);

var _MouseRayCaster = require('../Inputs/MouseRayCaster');

var _MouseRayCaster2 = _interopRequireDefault(_MouseRayCaster);

var _UIViewUtil = require('./UIViewUtil');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var DEFAULT_Z_OFFSET_SCALE = 0.001;
var DEFAULT_CURSOR_DISTANCE = 2.0;
var DEFAULT_CURSOR_WIDTH = 0.025;
var RENDERSORT_DISTANCE_MULTIPLIER = 64;
var RENDERSORT_DISTANCE_SHIFT = 9;
var DEFAULT_TOUCH_RELEASE_DELAY = 300;

var frameUpdateUID = 0;

var raycaster = new _ThreeShim2.default.Raycaster();

function matrixDistance(matrixA, matrixB) {
  var x = matrixA.elements[12] - matrixB.elements[12];
  var y = matrixA.elements[13] - matrixB.elements[13];
  var z = matrixA.elements[14] - matrixB.elements[14];
  return Math.sqrt(x * x + y * x + z * z);
}

function _applyUpdates(node, currentOpacity, updateContext, index, clipRect) {
  if (node.renderGroup) {
    var dist = matrixDistance(node.matrixWorld, updateContext.camera.matrixWorld);
    dist += node.zOffset || 0;
    index = updateContext.renderOrder;

    if (node.type === 'UIView') {
      dist = Math.max(0, updateContext.camera.far - dist);
    }

    updateContext.distances[index] = Math.floor(dist * RENDERSORT_DISTANCE_MULTIPLIER) << RENDERSORT_DISTANCE_SHIFT;
  }

  updateContext.renderOrder++;
  node.renderOrder = updateContext.distances[index] + updateContext.renderOrder;

  if (node.type === 'UIView') {
    var worldClipRect = node.calcWorldClipRect();
    currentOpacity *= node.opacity;
    node.setClipPlanes(clipRect);
    node.applyUpdates(currentOpacity, updateContext);
    clipRect = [Math.max(clipRect[0], worldClipRect[0]), Math.max(clipRect[1], worldClipRect[1]), Math.min(clipRect[2], worldClipRect[2]), Math.min(clipRect[3], worldClipRect[3])];
  } else if (node.type === 'SDFText') {
    node.textClip[0] = clipRect[0];
    node.textClip[1] = clipRect[1];
    node.textClip[2] = clipRect[2];
    node.textClip[3] = clipRect[3];
  }
  for (var i in node.children) {
    _applyUpdates(node.children[i], currentOpacity, updateContext, index, clipRect);
  }
}

function updateBillboard(node, updateContext) {
  if (node.type === 'UIView' && node.billboarding === 'on') {
    node.updateBillboard(updateContext);
  }
  for (var i in node.children) {
    updateBillboard(node.children[i], updateContext);
  }
}

function intersectObject(object, raycaster, intersects) {
  if (object.visible === false) {
    return;
  }
  object.raycast(raycaster, intersects);
  var children = object.children;
  for (var i = 0, l = children.length; i < l; i++) {
    intersectObject(children[i], raycaster, intersects);
  }
}

var GuiSys = function () {
  function GuiSys(root) {
    var _this = this;

    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, GuiSys);

    this.root = root;
    this.guiRoot = new _ThreeShim2.default.Object3D();
    this.root.add(this.guiRoot);
    this.isVRPresenting = false;
    this._requestFrames = {};
    this._offscreenRenders = {};
    this._offscreenRenderUID = 1;

    this._cursor = {
      intersectDistance: 0,
      lastHit: null,
      lastAlmostHit: null,
      source: null,
      rayOrigin: null,
      rayDirection: null,
      lastHitCache: [],
      drawsCursor: false,

      lastLocalX: null,
      lastLocalY: null,
      lastHitImmediateListeners: null
    };

    this.ZOffsetScale = DEFAULT_Z_OFFSET_SCALE;

    this.mouseOffset = null;

    this.mouseCursorInactiveStyle = 'default';
    this.mouseCursorActiveStyle = 'pointer';

    this.mouseCursorActive = false;

    this.touchReleaseDelay = DEFAULT_TOUCH_RELEASE_DELAY;

    this.cursorVisibility = 'hidden';

    this.cursorAutoDepth = true;

    this.cursorFixedDistance = DEFAULT_CURSOR_DISTANCE;

    if (!params.font) {
      params.font = (0, _SDFFont.loadFont)();
    }

    if (!params.raycasters) {
      params.raycasters = [new _MouseRayCaster2.default()];
    }

    if (params !== undefined) {
      (0, _UIViewUtil.setParams)(this, params);
    }

    this.eventDispatcher = new _ThreeShim2.default.EventDispatcher();

    var touchEventInput = new _TouchEventInput2.default();
    touchEventInput.setImmediateListener(function (event) {
      return _this._onTouchImmediate(event);
    });
    this._inputEventSources = [new _KeyboardEventInput2.default(), new _MouseEventInput2.default(), touchEventInput, new _GamepadEventInput2.default()];

    window.addEventListener('vrdisplaypresentchange', this._onPresentChange.bind(this));
  }

  _createClass(GuiSys, [{
    key: 'add',
    value: function add(child) {
      this.guiRoot.add(child);
    }

  }, {
    key: 'remove',
    value: function remove(child) {
      this.guiRoot.remove(child);
    }

  }, {
    key: 'requestFrameFunction',
    value: function requestFrameFunction(func) {
      var uid = frameUpdateUID++;
      this._requestFrames[uid] = func;
      return uid;
    }

  }, {
    key: 'cancelFrameFunction',
    value: function cancelFrameFunction(uid) {
      delete this._requestFrames[uid];
    }
  }, {
    key: 'applyUpdates',
    value: function applyUpdates(camera, root) {
      var updateContext = {
        camera: camera,
        renderOrder: 0,
        distances: [Math.floor(camera.far * RENDERSORT_DISTANCE_MULTIPLIER) << RENDERSORT_DISTANCE_SHIFT],
        distancesNode: [null]
      };

      _applyUpdates(root, 1, updateContext, 0, [-16384, -16384, 16384, 16384]);

      root.updateMatrixWorld();

      return updateContext;
    }

  }, {
    key: 'frameRenderUpdates',
    value: function frameRenderUpdates(camera) {
      var curTime = Date.now();
      var currentRequests = this._requestFrames;
      this._requestFrames = {};
      for (var update in currentRequests) {
        currentRequests[update](curTime);
      }

      for (var scene in this._offscreenRenders) {
        var sceneParams = this._offscreenRenders[scene];
        this.applyUpdates(sceneParams.camera, sceneParams.scene);
      }

      var updateContext = this.applyUpdates(camera, this.root);

      if (!this.isVRPresenting) {
        updateBillboard(this.root, updateContext);
      }

      if (this._raycasters) {
        for (var i = 0; i < this._raycasters.length; i++) {
          if (typeof this._raycasters[i].frame === 'function') {
            this._raycasters[i].frame(curTime);
          }
        }
      }

      if (this.cursorVisibility !== 'hidden' && !this.cursorMesh) {
        this.addCursor();
      }
    }

  }, {
    key: 'frameInputEvents',
    value: function frameInputEvents(camera, renderer) {
      if (this._raycasters) {
        var caster = null;
        var origin = null;
        var direction = null;
        var maxLength = Infinity;

        var r = 0;
        while ((!origin || !direction) && r < this._raycasters.length) {
          caster = this._raycasters[r];
          origin = caster.getRayOrigin(camera);
          direction = caster.getRayDirection(camera);
          if (typeof caster.getMaxLength === 'function') {
            maxLength = caster.getMaxLength();
          } else {
            maxLength = Infinity;
          }
          r++;
        }
        if (origin && direction) {
          var firstHit = null;
          var firstAlmostHit = null;
          var cameraPosition = camera.getWorldPosition();
          raycaster.ray.origin.set(cameraPosition.x + origin[0], cameraPosition.y + origin[1], cameraPosition.z + origin[2]);
          raycaster.ray.direction.fromArray(direction);
          raycaster.ray.direction.normalize();
          raycaster.ray.direction.applyQuaternion(camera.getWorldQuaternion());
          raycaster.far = maxLength;
          var rotatedDirection = [raycaster.ray.direction.x, raycaster.ray.direction.y, raycaster.ray.direction.z];
          var hits = raycaster.intersectObject(this.root, true);
          for (var i = 0; i < hits.length; i++) {
            var hit = hits[i];
            if (hit.uv && hit.object && hit.object.subScene) {
              var distanceToSubscene = hit.distance;
              var scene = hit.object.subScene;
              raycaster.ray.origin.set(scene._rttWidth * hit.uv.x, scene._rttHeight * (1 - hit.uv.y), 0.1);
              raycaster.ray.direction.set(0, 0, -1);
              var subHits = [];
              intersectObject(scene, raycaster, subHits);
              if (subHits.length === 0) {
                continue;
              }
              hit = subHits[subHits.length - 1];
              hit.distance = distanceToSubscene;
            }
            if (!firstHit && !hit.isAlmostHit) {
              firstHit = hit;
            }
            if (!firstAlmostHit && hit.isAlmostHit) {
              firstAlmostHit = hit;
            }
          }

          var source = caster.getType();
          if (firstHit) {
            this.updateLastHit(firstHit.object, source);
            if (firstHit.uv) {
              this._cursor.lastLocalX = firstHit.uv.x;
              this._cursor.lastLocalY = firstHit.uv.y;
            }

            this._cursor.intersectDistance = firstHit.distance;
          } else {
            this.updateLastHit(null, source);
            this._cursor.lastLocalX = null;
            this._cursor.lastLocalY = null;
          }

          if (this.cursorVisibility === 'auto') {
            if (firstAlmostHit && !(firstHit && firstHit.object.isInteractable)) {
              this._cursor.lastAlmostHit = firstAlmostHit.object;
              this._cursor.intersectDistance = firstAlmostHit.distance;
            } else {
              this._cursor.lastAlmostHit = null;
            }
          }

          this._cursor.rayOrigin = origin;
          this._cursor.rayDirection = rotatedDirection;
          this._cursor.drawsCursor = caster.drawsCursor();
        } else {
          this._cursor.lastHit = null;
          this._cursor.source = null;
          this._cursor.drawsCursor = false;
          this._cursor.rayOrigin = null;
          this._cursor.rayDirection = null;
        }
      }

      var renderTarget = renderer ? renderer.domElement : null;
      this._domElement = renderTarget;
      this._fireInputEvents(renderTarget);
      this._updateMouseCursorStyle(renderTarget);
    }

  }, {
    key: 'frame',
    value: function frame(camera, renderer) {
      this.frameRenderUpdates(camera);
      this.frameInputEvents(camera, renderer);
      this.updateCursor(camera);
    }

  }, {
    key: 'updateLastHit',
    value: function updateLastHit(hit, source) {
      var hitCache = [];
      var hitImmediateListeners = [];
      var currentHit = hit;

      var hitViews = [];
      while (currentHit) {
        if (currentHit.type === 'UIView') {
          hitViews.push(currentHit);
        }
        currentHit = currentHit.parent;
      }

      var target = null;
      this.mouseCursorActive = false;
      for (var i = hitViews.length - 1; i >= 0; i--) {
        if (hitViews[i].shouldAcceptHitEvent()) {
          target = hitViews[i].id;
          hitCache[hitViews[i].id] = hitViews[i];
          if (hitViews[i].immediateListener) {
            hitImmediateListeners.push(hitViews[i].immediateListener);
          }
          if (hitViews[i].isMouseInteractable) {
            this.mouseCursorActive = true;
          }
        }

        if (hitViews[i].shouldInterceptHitEvent()) {
          break;
        }
      }

      currentHit = target !== null && hitCache[target] ? hitCache[target] : null;
      if (this._cursor.lastHit !== currentHit || this._cursor.source !== source) {
        this.eventDispatcher.dispatchEvent(new _GuiSysEvent.GuiSysEvent(_GuiSysEvent.GuiSysEventType.HIT_CHANGED, {
          lastHit: this._cursor.lastHit,
          currentHit: currentHit,
          lastSource: this._cursor.source,
          currentSource: source
        }));
        this._cursor.lastHit = currentHit;
        this._cursor.source = source;
      }

      for (var id in this._cursor.lastHitCache) {
        if (!hitCache[id]) {
          this.eventDispatcher.dispatchEvent(new _GuiSysEvent.UIViewEvent(this._cursor.lastHitCache[id], _GuiSysEvent.UIViewEventType.FOCUS_LOST, {
            target: this._cursor.lastHit,
            source: this._cursor.source
          }));
        }
      }

      for (var _id in hitCache) {
        if (!this._cursor.lastHitCache[_id]) {
          this.eventDispatcher.dispatchEvent(new _GuiSysEvent.UIViewEvent(hitCache[_id], _GuiSysEvent.UIViewEventType.FOCUS_GAINED, {
            target: this._cursor.lastHit,
            source: this._cursor.source
          }));
        }
      }

      this._cursor.lastHitCache = hitCache;

      this._cursor.lastHitImmediateListeners = hitImmediateListeners;
    }
  }, {
    key: 'addCursor',
    value: function addCursor() {
      this.cursorMesh = this.makeDefaultCursor();
      this.cursorMesh.raycast = function () {
        return null;
      };
      this.root.add(this.cursorMesh);
      this.cursorMesh.visible = false;

      this.cursorMesh.material.depthTest = false;
      this.cursorMesh.material.depthWrite = false;
      this.cursorMesh.renderOrder = 1;
    }
  }, {
    key: 'updateCursor',
    value: function updateCursor(camera) {
      var cursorZ = this.cursorAutoDepth && this._cursor.lastHit !== null ? this._cursor.intersectDistance : this.cursorFixedDistance;

      var lastOrigin = this._cursor.rayOrigin;
      var lastDirection = this._cursor.rayDirection;

      if (this.cursorMesh && this.cursorVisibility !== 'hidden' && lastOrigin && lastDirection) {
        var cameraToCursorX = lastOrigin[0] + lastDirection[0] * cursorZ;
        var cameraToCursorY = lastOrigin[1] + lastDirection[1] * cursorZ;
        var cameraToCursorZ = lastOrigin[2] + lastDirection[2] * cursorZ;
        this.cursorMesh.position.set(camera.position.x + cameraToCursorX, camera.position.y + cameraToCursorY, camera.position.z + cameraToCursorZ);
        this.cursorMesh.rotation.copy(camera.getWorldRotation());

        if (this.cursorAutoDepth) {
          var scale = Math.sqrt(cameraToCursorX * cameraToCursorX + cameraToCursorY * cameraToCursorY + cameraToCursorZ * cameraToCursorZ);
          this.cursorMesh.scale.set(scale, scale, scale);
        }
      }

      if (this.cursorMesh) {
        var autoVisible = false;
        if (this.cursorVisibility === 'auto') {
          autoVisible = this._cursor.lastHit !== null && this._cursor.lastHit.isInteractable;
          if (!autoVisible) {
            autoVisible = this._cursor.lastAlmostHit !== null && this._cursor.lastAlmostHit.isInteractable;
          }
        }

        this.cursorMesh.visible = this._cursor.drawsCursor && (this.cursorVisibility === 'visible' || autoVisible) && lastOrigin !== null && lastDirection !== null;
      }
    }
  }, {
    key: 'makeDefaultCursor',
    value: function makeDefaultCursor() {
      var canvas = document.createElement('canvas');

      canvas.width = 256;
      canvas.height = 256;

      var ctx = canvas.getContext('2d');
      ctx.beginPath();

      ctx.arc(128, 128, 95, 0, 2 * Math.PI);

      ctx.strokeStyle = 'rgba(256, 256, 256, 1)';
      ctx.fillStyle = 'rgba(256, 256, 256, 0.8)';
      ctx.lineWidth = 25;
      ctx.stroke();
      ctx.fill();

      var texture = new _ThreeShim2.default.Texture(canvas);
      texture.needsUpdate = true;
      var material = new _ThreeShim2.default.MeshBasicMaterial({
        transparent: true,
        opacity: 1.0,
        side: _ThreeShim2.default.DoubleSide,
        map: texture
      });

      var defaultCursor = new _ThreeShim2.default.Mesh(new _ThreeShim2.default.PlaneGeometry(DEFAULT_CURSOR_WIDTH, DEFAULT_CURSOR_WIDTH), material);
      return defaultCursor;
    }
  }, {
    key: '_updateMouseCursorStyle',
    value: function _updateMouseCursorStyle(renderTarget) {
      var cursorStyle = this.mouseCursorActive ? this.mouseCursorActiveStyle : this.mouseCursorInactiveStyle;
      if (renderTarget && renderTarget.style) {
        renderTarget.style.cursor = cursorStyle;
        renderTarget.style.cursor = '-webkit-' + cursorStyle;
        renderTarget.style.cursor = '-moz-' + cursorStyle;
      }
    }
  }, {
    key: '_onPresentChange',
    value: function _onPresentChange(e) {
      this.isVRPresenting = e.display.isPresenting;
    }
  }, {
    key: '_fireInputEvents',
    value: function _fireInputEvents(target) {
      var collected = [];
      for (var i = 0; i < this._inputEventSources.length; i++) {
        var source = this._inputEventSources[i];
        if (typeof source.getTarget === 'function') {
          if (source.getTarget() !== target) {
            source.setTarget(target);
          }
        }

        var events = source.getEvents();
        if (events) {
          collected = collected.concat(events);
        }
      }

      for (var _i = 0; _i < collected.length; _i++) {
        this.eventDispatcher.dispatchEvent(new _GuiSysEvent.GuiSysEvent(_GuiSysEvent.GuiSysEventType.INPUT_EVENT, {
          target: this._cursor.lastHit,
          source: this._cursor.source,
          inputEvent: collected[_i]
        }));
      }
    }
  }, {
    key: '_onTouchImmediate',
    value: function _onTouchImmediate(event) {
      var listeners = this._cursor.lastHitImmediateListeners;
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i].eventType === event.eventType) {
            listeners[i].callback(event);
          }
        }
      }
    }
  }, {
    key: 'registerOffscreenRender',
    value: function registerOffscreenRender(scene, camera, renderTarget) {
      var uid = this._offscreenRenderUID++;
      this._offscreenRenders[uid] = { scene: scene, camera: camera, renderTarget: renderTarget };
      return uid;
    }
  }, {
    key: 'unregisterOffscreenRender',
    value: function unregisterOffscreenRender(uid) {
      if (!uid) {
        return;
      }
      delete this._offscreenRenders[uid];
    }
  }, {
    key: 'getOffscreenRenders',
    value: function getOffscreenRenders() {
      return this._offscreenRenders;
    }
  }, {
    key: 'setFont',
    value: function setFont(font) {
      this.font = font;
    }

  }, {
    key: 'setMouseCursorInactiveStyle',
    value: function setMouseCursorInactiveStyle(style) {
      this.mouseCursorInactiveStyle = style;
    }

  }, {
    key: 'setMouseCursorActiveStyle',
    value: function setMouseCursorActiveStyle(style) {
      this.mouseCursorActiveStyle = style;
    }

  }, {
    key: 'setCursorVisibility',
    value: function setCursorVisibility(visibility) {
      var modes = ['visible', 'hidden', 'auto'];
      if (!modes.includes(visibility)) {
        console.warn('Unknown cursorVisibility: ' + visibility + ' expected', modes);
        return;
      }
      this.cursorVisibility = visibility;
    }

  }, {
    key: 'setCursorAutoDepth',
    value: function setCursorAutoDepth(flag) {
      this.cursorAutoDepth = flag;
    }

  }, {
    key: 'setCursorFixedDistance',
    value: function setCursorFixedDistance(distance) {
      this.cursorFixedDistance = distance;
    }

  }, {
    key: 'setRaycasters',
    value: function setRaycasters(raycasters) {
      if (!Array.isArray(raycasters)) {
        throw new Error('GuiSys raycasters must be an array of RayCaster objects');
      }
      this._raycasters = raycasters;
    }
  }, {
    key: 'getLastLocalIntersect',
    value: function getLastLocalIntersect() {
      if (this._cursor.lastLocalX === null || this._cursor.lastLocalY === null) {
        return null;
      }
      return [this._cursor.lastLocalX, this._cursor.lastLocalY];
    }
  }]);

  return GuiSys;
}();

exports.default = GuiSys;