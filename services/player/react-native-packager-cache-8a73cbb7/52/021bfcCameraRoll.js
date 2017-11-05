
'use strict';

var ReactPropTypes = require('React').PropTypes;
var RCTCameraRollManager = require('NativeModules').CameraRollManager;

var createStrictShapeTypeChecker = require('createStrictShapeTypeChecker');
var deepFreezeAndThrowOnMutationInDev = require('deepFreezeAndThrowOnMutationInDev');
var invariant = require('fbjs/lib/invariant');

var GROUP_TYPES_OPTIONS = ['Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream', 'SavedPhotos'];

var ASSET_TYPE_OPTIONS = ['All', 'Videos', 'Photos'];

deepFreezeAndThrowOnMutationInDev(GROUP_TYPES_OPTIONS);
deepFreezeAndThrowOnMutationInDev(ASSET_TYPE_OPTIONS);

var getPhotosParamChecker = createStrictShapeTypeChecker({
  first: ReactPropTypes.number.isRequired,

  after: ReactPropTypes.string,

  groupTypes: ReactPropTypes.oneOf(GROUP_TYPES_OPTIONS),

  groupName: ReactPropTypes.string,

  assetType: ReactPropTypes.oneOf(ASSET_TYPE_OPTIONS),

  mimeTypes: ReactPropTypes.arrayOf(ReactPropTypes.string)
});

var getPhotosReturnChecker = createStrictShapeTypeChecker({
  edges: ReactPropTypes.arrayOf(createStrictShapeTypeChecker({
    node: createStrictShapeTypeChecker({
      type: ReactPropTypes.string.isRequired,
      group_name: ReactPropTypes.string.isRequired,
      image: createStrictShapeTypeChecker({
        uri: ReactPropTypes.string.isRequired,
        height: ReactPropTypes.number.isRequired,
        width: ReactPropTypes.number.isRequired,
        isStored: ReactPropTypes.bool
      }).isRequired,
      timestamp: ReactPropTypes.number.isRequired,
      location: createStrictShapeTypeChecker({
        latitude: ReactPropTypes.number,
        longitude: ReactPropTypes.number,
        altitude: ReactPropTypes.number,
        heading: ReactPropTypes.number,
        speed: ReactPropTypes.number
      })
    }).isRequired
  })).isRequired,
  page_info: createStrictShapeTypeChecker({
    has_next_page: ReactPropTypes.bool.isRequired,
    start_cursor: ReactPropTypes.string,
    end_cursor: ReactPropTypes.string
  }).isRequired
});

var CameraRoll = function () {
  function CameraRoll() {
    babelHelpers.classCallCheck(this, CameraRoll);
  }

  babelHelpers.createClass(CameraRoll, null, [{
    key: 'saveImageWithTag',
    value: function saveImageWithTag(tag) {
      console.warn('CameraRoll.saveImageWithTag is deprecated. Use CameraRoll.saveToCameraRoll instead');
      return this.saveToCameraRoll(tag, 'photo');
    }
  }, {
    key: 'saveToCameraRoll',
    value: function saveToCameraRoll(tag, type) {
      invariant(typeof tag === 'string', 'CameraRoll.saveToCameraRoll must be a valid string.');

      invariant(type === 'photo' || type === 'video' || type === undefined, 'The second argument to saveToCameraRoll must be \'photo\' or \'video\'. You passed ' + type);

      var mediaType = 'photo';
      if (type) {
        mediaType = type;
      } else if (['mov', 'mp4'].indexOf(tag.split('.').slice(-1)[0]) >= 0) {
        mediaType = 'video';
      }

      return RCTCameraRollManager.saveToCameraRoll(tag, mediaType);
    }
  }, {
    key: 'getPhotos',
    value: function getPhotos(params) {
      if (__DEV__) {
        getPhotosParamChecker({ params: params }, 'params', 'CameraRoll.getPhotos');
      }
      if (arguments.length > 1) {
        console.warn('CameraRoll.getPhotos(tag, success, error) is deprecated.  Use the returned Promise instead');
        var successCallback = arguments[1];
        if (__DEV__) {
          var callback = arguments[1];
          successCallback = function successCallback(response) {
            getPhotosReturnChecker({ response: response }, 'response', 'CameraRoll.getPhotos callback');
            callback(response);
          };
        }
        var errorCallback = arguments[2] || function () {};
        RCTCameraRollManager.getPhotos(params).then(successCallback, errorCallback);
      }

      return RCTCameraRollManager.getPhotos(params);
    }
  }]);
  return CameraRoll;
}();

CameraRoll.GroupTypesOptions = GROUP_TYPES_OPTIONS;
CameraRoll.AssetTypeOptions = ASSET_TYPE_OPTIONS;

module.exports = CameraRoll;