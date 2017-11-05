Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Box = require('../Views/Box');

var _Box2 = babelHelpers.interopRequireDefault(_Box);

var _Cylinder = require('../Views/Cylinder');

var _Cylinder2 = babelHelpers.interopRequireDefault(_Cylinder);

var _Plane = require('../Views/Plane');

var _Plane2 = babelHelpers.interopRequireDefault(_Plane);

var _Sphere = require('../Views/Sphere');

var _Sphere2 = babelHelpers.interopRequireDefault(_Sphere);

var _Image = require('../Views/Image');

var _Image2 = babelHelpers.interopRequireDefault(_Image);

var _View = require('../Views/View');

var _View2 = babelHelpers.interopRequireDefault(_View);

var _Pano = require('../Views/Pano');

var _Pano2 = babelHelpers.interopRequireDefault(_Pano);

var _LiveEnvCamera = require('../Views/LiveEnvCamera');

var _LiveEnvCamera2 = babelHelpers.interopRequireDefault(_LiveEnvCamera);

var _Model = require('../Views/Model');

var _Model2 = babelHelpers.interopRequireDefault(_Model);

var _Scene = require('../Views/Scene');

var _Scene2 = babelHelpers.interopRequireDefault(_Scene);

var _Sound = require('../Views/Sound');

var _Sound2 = babelHelpers.interopRequireDefault(_Sound);

var _Text = require('../Views/Text');

var _Text2 = babelHelpers.interopRequireDefault(_Text);

var _RawText = require('../Views/RawText');

var _RawText2 = babelHelpers.interopRequireDefault(_RawText);

var _Video = require('../Views/Video');

var _Video2 = babelHelpers.interopRequireDefault(_Video);

var _VideoPano = require('../Views/VideoPano');

var _VideoPano2 = babelHelpers.interopRequireDefault(_VideoPano);

var _AmbientLight = require('../Views/AmbientLight');

var _AmbientLight2 = babelHelpers.interopRequireDefault(_AmbientLight);

var _DirectionalLight = require('../Views/DirectionalLight');

var _DirectionalLight2 = babelHelpers.interopRequireDefault(_DirectionalLight);

var _PointLight = require('../Views/PointLight');

var _PointLight2 = babelHelpers.interopRequireDefault(_PointLight);

var _SpotLight = require('../Views/SpotLight');

var _SpotLight2 = babelHelpers.interopRequireDefault(_SpotLight);

var _CylindricalPanel = require('../Views/CylindricalPanel');

var _CylindricalPanel2 = babelHelpers.interopRequireDefault(_CylindricalPanel);

var _Prefetch = require('../Views/Prefetch');

var _Prefetch2 = babelHelpers.interopRequireDefault(_Prefetch);

var _Module2 = require('./Module');

var _Module3 = babelHelpers.interopRequireDefault(_Module2);

var _three = require('three');

var THREE = babelHelpers.interopRequireWildcard(_three);

var _ovrui = require('ovrui');

var OVRUI = babelHelpers.interopRequireWildcard(_ovrui);

var _Yoga = require('../Utils/Yoga.bundle');

var Yoga = babelHelpers.interopRequireWildcard(_Yoga);

var STYLES_THAT_DONT_ALTER_LAYOUT = {
  color: true,
  backgroundColor: true,
  transform: true,
  borderColor: true,
  opacity: true
};

var UIManager = function (_Module) {
  babelHelpers.inherits(UIManager, _Module);

  function UIManager(rnctx, guiSys) {
    var customViews = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    babelHelpers.classCallCheck(this, UIManager);

    var _this = babelHelpers.possibleConstructorReturn(this, (UIManager.__proto__ || Object.getPrototypeOf(UIManager)).call(this, 'UIManager'));

    _this._rnctx = rnctx;
    _this._guiSys = guiSys;

    _this.Dimensions = {
      windowPhysicalPixels: {
        width: 1024,
        height: 1024,
        scale: 1,
        fontScale: 1,
        densityDpi: 1
      },
      screenPhysicalPixels: {
        width: 1024,
        height: 1024,
        scale: 1,
        fontScale: 1,
        densityDpi: 1
      }
    };

    _this.customDirectEventTypes = {
      topLayout: { registrationName: 'onLayout' },
      topLoadStart: { registrationName: 'onLoadStart' },
      topLoad: { registrationName: 'onLoad' },
      topLoadEnd: { registrationName: 'onLoadEnd' },
      topEnter: { registrationName: 'onEnter' },
      topExit: { registrationName: 'onExit' },
      topMove: { registrationName: 'onMove' },

      topDurationChange: { registrationName: 'onDurationChange' },
      topEnded: { registrationName: 'onEnded' },
      topTimeUpdate: { registrationName: 'onTimeUpdate' },
      topPlayStatusChange: { registrationName: 'onPlayStatusChange' }
    };
    _this.customBubblingEventTypes = {
      topChange: {
        phasedRegistrationNames: {
          bubbled: 'onChange',
          captured: 'onChangeCapture'
        }
      },
      topInput: {
        phasedRegistrationNames: {
          bubbled: 'onInput',
          captured: 'onInputCapture'
        }
      },
      topHeadPose: {
        phasedRegistrationNames: {
          bubbled: 'onHeadPose',
          captured: 'onHeadPoseCapture'
        }
      }
    };

    _this._views = {};
    _this._viewTypes = {};
    _this._viewCreator = {};
    _this._rootViews = {};
    _this._viewsOfType = {};
    _this._layoutAnimation = null;
    _this.registerViewType('RCTView', _View2.default.describe(), function () {
      return new _View2.default(guiSys);
    });
    _this.registerViewType('LiveEnvCamera', _LiveEnvCamera2.default.describe(), function () {
      return new _LiveEnvCamera2.default(guiSys);
    });
    _this.registerViewType('RCTImageView', _Image2.default.describe(), function () {
      return new _Image2.default(guiSys, rnctx);
    });
    _this.registerViewType('Pano', _Pano2.default.describe(), function () {
      return new _Pano2.default(guiSys, rnctx);
    });
    _this.registerViewType('Model', _Model2.default.describe(), function () {
      return new _Model2.default(guiSys, rnctx);
    });
    _this.registerViewType('Scene', _Scene2.default.describe(), function () {
      return new _Scene2.default(guiSys);
    });
    _this.registerViewType('Sound', _Sound2.default.describe(), function () {
      return new _Sound2.default(guiSys, rnctx);
    });
    _this.registerViewType('RCTText', _Text2.default.describe(), function () {
      return new _Text2.default(guiSys);
    });
    _this.registerViewType('RCTRawText', _RawText2.default.describe(), function () {
      return new _RawText2.default(guiSys);
    });
    _this.registerViewType('Video', _Video2.default.describe(), function () {
      return new _Video2.default(guiSys, rnctx);
    });
    _this.registerViewType('VideoPano', _VideoPano2.default.describe(), function () {
      return new _VideoPano2.default(guiSys, rnctx);
    });
    _this.registerViewType('AmbientLight', _AmbientLight2.default.describe(), function () {
      return new _AmbientLight2.default(guiSys);
    });
    _this.registerViewType('DirectionalLight', _DirectionalLight2.default.describe(), function () {
      return new _DirectionalLight2.default(guiSys);
    });
    _this.registerViewType('PointLight', _PointLight2.default.describe(), function () {
      return new _PointLight2.default(guiSys);
    });
    _this.registerViewType('SpotLight', _SpotLight2.default.describe(), function () {
      return new _SpotLight2.default(guiSys);
    });
    _this.registerViewType('CylindricalPanel', _CylindricalPanel2.default.describe(), function () {
      return new _CylindricalPanel2.default(guiSys);
    });
    _this.registerViewType('Box', _Box2.default.describe(), function () {
      return new _Box2.default(guiSys, rnctx);
    });
    _this.registerViewType('Cylinder', _Cylinder2.default.describe(), function () {
      return new _Cylinder2.default(guiSys, rnctx);
    });
    _this.registerViewType('Plane', _Plane2.default.describe(), function () {
      return new _Plane2.default(guiSys, rnctx);
    });
    _this.registerViewType('Sphere', _Sphere2.default.describe(), function () {
      return new _Sphere2.default(guiSys, rnctx);
    });
    _this.registerViewType('Prefetch', _Prefetch2.default.describe(), function () {
      return new _Prefetch2.default(guiSys);
    });

    customViews.forEach(function (_ref) {
      var name = _ref.name,
          view = _ref.view;

      _this.registerViewType(name, view.describe(), function () {
        return new view(guiSys);
      });
    });
    return _this;
  }

  babelHelpers.createClass(UIManager, [{
    key: 'createView',
    value: function createView(tag, type, rootTag, attr) {
      var newView = this._viewCreator[type]();
      this._views[String(tag)] = newView;
      newView.UIManager = this;
      newView.tag = tag;

      if (newView.view) {
        newView.view.tag = tag;
      }
      newView.rootTag = rootTag;

      this._viewTypes[String(tag)] = type;

      this._viewsOfType[type][String(tag)] = newView;

      this.updateView(tag, type, attr);

      this._views[String(tag)].makeDirty();
      return this._views[String(tag)];
    }
  }, {
    key: 'setChildren',
    value: function setChildren(tag, childrenTags) {
      var viewToManage = this._views[String(tag)];

      for (var i = 0; i < childrenTags.length; i++) {
        var viewToAdd = this._views[String(childrenTags[i])];
        if (viewToAdd) {
          viewToManage.addChild(i, viewToAdd);
          viewToAdd.setParent(viewToManage);

          viewToAdd.makeDirty();
        }
      }
    }
  }, {
    key: 'manageChildren',
    value: function manageChildren(tag, moveFrom, moveTo, addChildTags, addAtIndices, removeFrom) {
      var cssNodeToManage = this._views[String(tag)];
      if (!cssNodeToManage) {
        return;
      }

      var numToMove = !moveFrom ? 0 : moveFrom.length;

      var viewsToAdd = [];
      var indicesToRemove = [];
      var tagsToRemove = [];
      var tagsToDelete = [];

      if (moveFrom && moveTo) {
        for (var i = 0; i < moveFrom.length; i++) {
          var moveFromIndex = moveFrom[i];
          var tagToMove = cssNodeToManage.getChild(moveFromIndex).getTag();
          viewsToAdd[i] = {
            tag: tagToMove,
            index: moveTo[i]
          };
          indicesToRemove[i] = moveFromIndex;
          tagsToRemove[i] = tagToMove;
        }
      }

      if (addChildTags) {
        for (var _i = 0; _i < addChildTags.length; _i++) {
          var viewTagToAdd = addChildTags[_i];
          var indexToAddAt = addAtIndices[_i];
          viewsToAdd[numToMove + _i] = {
            tag: viewTagToAdd,
            index: indexToAddAt
          };
        }
      }

      if (removeFrom) {
        for (var _i2 = 0; _i2 < removeFrom.length; _i2++) {
          var indexToRemove = removeFrom[_i2];
          var tagToRemove = cssNodeToManage.getChild(indexToRemove).getTag();
          indicesToRemove[numToMove + _i2] = indexToRemove;
          tagsToRemove[numToMove + _i2] = tagToRemove;
          tagsToDelete[_i2] = tagToRemove;
        }
      }

      viewsToAdd.sort(function (a, b) {
        return a.index - b.index;
      });
      indicesToRemove.sort(function (a, b) {
        return a - b;
      });

      for (var _i3 = indicesToRemove.length - 1; _i3 >= 0; _i3--) {
        cssNodeToManage.removeChild(indicesToRemove[_i3]);
      }

      for (var _i4 = 0; _i4 < viewsToAdd.length; _i4++) {
        var viewAtIndex = viewsToAdd[_i4];
        var cssNodeToAdd = this._views[String(viewAtIndex.tag)];
        cssNodeToManage.addChild(viewAtIndex.index, cssNodeToAdd);
        cssNodeToAdd.setParent(cssNodeToManage);
        cssNodeToAdd.makeDirty();
      }

      for (var _i5 = 0; _i5 < tagsToDelete.length; _i5++) {
        this.purgeView(this._views[String(tagsToDelete[_i5])]);
      }
    }
  }, {
    key: 'registerViewType',
    value: function registerViewType(name, view, viewCreator) {
      this[name] = view;
      this._viewCreator[name] = viewCreator;
      this._viewsOfType[name] = {};
    }
  }, {
    key: 'updateView',
    value: function updateView(tag, type, attr) {
      var view = this._views[String(tag)];
      var forceLayout = false;
      for (var a in attr) {
        if (this[type] && this[type].NativeProps[a]) {
          view.props[a] = attr[a];
        } else {
          if (typeof view['_' + a] === 'function') {
            view['_' + a](attr[a]);
          } else {
            view.style[a] = attr[a];
          }

          forceLayout = forceLayout || !STYLES_THAT_DONT_ALTER_LAYOUT[a];
        }
      }

      if (forceLayout) {
        view.makeDirty();
      }

      if (typeof view.updateView === 'function') {
        view.updateView();
      }
    }
  }, {
    key: 'purgeView',
    value: function purgeView(view) {
      view.makeDirty();

      view.dispose();

      var type = this._viewTypes[String(view.tag)];
      delete this._viewTypes[String(view.tag)];
      delete this._views[String(view.tag)];
      delete this._viewsOfType[type][String(view.tag)];

      for (var i = 0; i < view.children.length; i++) {
        this.purgeView(view.children[i]);
      }

      view.children = [];
    }
  }, {
    key: 'createRootView',
    value: function createRootView(tag) {
      this._rootViews[String(tag)] = this.createView(tag, 'RCTView', tag, {});
      this._guiSys.add(this._rootViews[String(tag)].view);
    }
  }, {
    key: 'removeRootView',
    value: function removeRootView(tag) {
      var view = this._views[String(tag)];
      if (!view) {
        return;
      }

      delete this._rootViews[String(tag)];
      this.purgeView(view);
    }
  }, {
    key: 'replaceExistingNonRootView',
    value: function replaceExistingNonRootView(reactTag, newReactTag) {
      var view = this._views[String(reactTag)];
      if (!view) {
        return;
      }
      view.makeDirty();

      var superView = view.getParent();
      if (!superView) {
        return;
      }

      var indexOfView = superView.getIndexOf(view);
      if (indexOfView === -1) {
        return;
      }

      this.manageChildren(superView.getTag(), null, null, [newReactTag], [indexOfView], [indexOfView]);
    }
  }, {
    key: 'removeSubviewsFromContainerWithID',
    value: function removeSubviewsFromContainerWithID(tag) {
      var view = this._views[String(tag)];
      if (!view) {
        return;
      }

      view.makeDirty();

      var removeIndex = [];
      for (var childIndex = 0; childIndex < view.getChildCount(); childIndex++) {
        removeIndex.push(childIndex);
      }

      for (var i = removeIndex.length - 1; i >= 0; i--) {
        var childView = view.getChild(removeIndex[i]);
        this.purgeView(childView);
        childView.setParent(null);
        view.removeChild(removeIndex[i]);
      }
    }
  }, {
    key: 'presentLayout',
    value: function presentLayout(view) {
      if (view.presentLayout) {
        view.presentLayout();
      }
      view.isDirty = false;
      for (var i = 0; i < view.children.length; i++) {
        this.presentLayout(view.children[i]);
      }
    }
  }, {
    key: 'frame',
    value: function frame(frameStart) {
      for (var _tag in this._views) {
        this._views[_tag].frame(frameStart);
      }

      this.layout();
    }
  }, {
    key: 'layout',
    value: function layout() {
      for (var _tag2 in this._rootViews) {
        var rootView = this._rootViews[_tag2];

        rootView.YGNode.calculateLayout(Yoga.UNDEFINED, Yoga.UNDEFINED, Yoga.DIRECTION_LTR);

        this.presentLayout(rootView);
      }
    }
  }, {
    key: 'getSceneCameraTransform',
    value: function getSceneCameraTransform(rootTag) {
      var scenes = this._viewsOfType['Scene'];
      if (!scenes || Object.keys(scenes).length === 0) {
        return null;
      }
      var scene = function (scenes, rootTag) {
        for (var _tag3 in scenes) {
          var item = scenes[_tag3];
          if (item.rootTag === rootTag) {
            return item;
          }
        }
      }(scenes, rootTag);
      return scene && scene.style && scene.style.transform;
    }
  }, {
    key: 'getLayers',
    value: function getLayers() {
      var CylindricalPanels = this._viewsOfType['CylindricalPanel'];
      return CylindricalPanels;
    }
  }, {
    key: 'setCursorVisibility',
    value: function setCursorVisibility(visibility) {
      this._guiSys.setCursorVisibility(visibility);
    }
  }, {
    key: 'measureTextHeight',
    value: function measureTextHeight(text, fontSize, width, maxLineCount, callbackID) {
      var wordWrapped = OVRUI.wrapLines(this._guiSys.font, text, fontSize, width, undefined, maxLineCount);
      var dim = OVRUI.measureText(this._guiSys.font, wordWrapped, fontSize);
      this._rnctx.invokeCallback(callbackID, [dim.maxHeight]);
    }
  }, {
    key: 'setBoundingBoxVisible',
    value: function setBoundingBoxVisible(tag, visible) {
      var view = this._views[String(tag)];
      var uiView = view.view;
      if (!uiView) {
        return;
      }
      var previous = null;
      uiView.children.forEach(function (c) {
        if (c.__REACT_VR_BOUNDING) {
          previous = c;
        }
      });
      if (visible) {
        if (previous) {
          return;
        }
        var bounds = new THREE.Box3();
        bounds.setFromObject(uiView);
        var boundViz = new THREE.Mesh(new THREE.BoxGeometry(bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y, bounds.max.z - bounds.min.z, 1, 1, 1), new THREE.MeshBasicMaterial({ wireframe: true, color: 0xe44dd9 }));
        boundViz.__REACT_VR_BOUNDING = true;
        uiView.add(boundViz);
      } else {
        if (!previous) {
          return;
        }
        uiView.remove(previous);
      }
    }
  }, {
    key: 'measure',
    value: function measure(reactTag, callback) {
      var view = this._views[String(reactTag)];
      if (!view) {
        this._rnctx.invokeCallback(callback, []);
        return;
      }
      var x = 0;
      var y = 0;
      var w = view.YGNode.getComputedWidth();
      var h = view.YGNode.getComputedHeight();
      while (view) {
        x += view.YGNode.getComputedLeft() - view.YGNode.getComputedWidth() * view.style.layoutOrigin[0];
        y += view.YGNode.getComputedTop() - view.YGNode.getComputedHeight() * view.style.layoutOrigin[1];
        view = view.getParent();
      }
      this._rnctx.invokeCallback(callback, [x, y, w, h]);
    }
  }, {
    key: 'measureInWindow',
    value: function measureInWindow(reactTag, callback) {
      var view = this._views[String(reactTag)];
      if (!view) {
        this._rnctx.invokeCallback(callback, []);
        return;
      }
      var x = 0;
      var y = 0;
      var w = view.YGNode.getComputedWidth();
      var h = view.YGNode.getComputedHeight();
      while (view) {
        x += view.YGNode.getComputedLeft() - view.YGNode.getComputedWidth() * view.style.layoutOrigin[0];
        y += view.YGNode.getComputedTop() - view.YGNode.getComputedHeight() * view.style.layoutOrigin[1];
        view = view.getParent();
      }
      this._rnctx.invokeCallback(callback, [x, y, w, h]);
    }
  }, {
    key: 'measureLayout',
    value: function measureLayout(reactTag, ancestorTag, errorCallback, successCallback) {
      var view = this._views[String(reactTag)];
      if (!view) {
        this._rnctx.invokeCallback(errorCallback, []);
        return;
      }
      var x = 0;
      var y = 0;
      var w = view.YGNode.getComputedWidth();
      var h = view.YGNode.getComputedHeight();
      while (view && view.tag !== ancestorTag) {
        x += view.YGNode.getComputedLeft() - view.YGNode.getComputedWidth() * view.style.layoutOrigin[0];
        y += view.YGNode.getComputedTop() - view.YGNode.getComputedHeight() * view.style.layoutOrigin[1];
        view = view.getParent();
      }
      this._rnctx.invokeCallback(successCallback, [x, y, w, h]);
    }
  }, {
    key: 'measureLayoutRelativeToParent',
    value: function measureLayoutRelativeToParent(reactTag, errorCallback, successCallback) {
      var view = this._views[String(reactTag)];
      if (!view) {
        this._rnctx.invokeCallback(successCallback, []);
        return;
      }
      var x = view.YGNode.getComputedLeft() - view.YGNode.getComputedWidth() * view.style.layoutOrigin[0];
      var y = view.YGNode.getComputedTop() - view.YGNode.getComputedHeight() * view.style.layoutOrigin[1];
      var w = view.YGNode.getComputedWidth();
      var h = view.YGNode.getComputedHeight();
      this._rnctx.invokeCallback(successCallback, [x, y, w, h]);
    }
  }, {
    key: 'configureNextLayoutAnimation',
    value: function configureNextLayoutAnimation(config, finished, error) {
      this._layoutAnimation = config;
    }
  }, {
    key: 'dispatchViewManagerCommand',
    value: function dispatchViewManagerCommand(reactTag, commandId, commandArgs) {
      var view = this._views[String(reactTag)];
      if (!view) {
        console.warn('UIManager.dispatchViewManagerCommand: dispatching command on a nonexistent view: ' + reactTag);
        return;
      }
      view.receiveCommand(commandId, commandArgs);
    }
  }]);
  return UIManager;
}(_Module3.default);

exports.default = UIManager;