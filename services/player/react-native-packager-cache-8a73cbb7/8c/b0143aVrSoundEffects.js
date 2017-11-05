
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSupportedResource = getSupportedResource;
exports.load = load;
exports.play = play;
exports.volume = volume;
exports.unload = unload;

var _reactNative = require('react-native');

var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var AudioModule = _reactNative.NativeModules.AudioModule;

var loadedSounds = {};
var loadedSoundsRefs = {};

function getSupportedResource(formats) {
  if (!formats) {
    return null;
  }
  if (formats.uri) {
    return formats;
  }
  var supported = AudioModule.supportedFormats;
  for (var _format in formats) {
    if (supported.indexOf(_format) > -1) {
      return formats[_format];
    }
  }
  return null;
}

function load(formats) {
  var resource = getSupportedResource(formats);
  if (!resource || !resource.uri) {
    console.warn("VrSoundEffects.load(resource) expected resource in format {url: 'http'}, got:", resource);
    return;
  }
  var url = resource.uri;
  var sound = {
    handle: url,
    src: url,
    config: {}
  };
  if (loadedSounds[url]) {
    loadedSoundsRefs[url] += 1;
  } else {
    loadedSoundsRefs[url] = 1;
    loadedSounds[url] = sound;
    loadedSounds[url].ready = false;
    AudioModule.addHandle(url, sound.config);
    AudioModule.setUrl(url, sound.src);
    AudioModule.load(url);
  }
}

function play(formats) {
  var resource = getSupportedResource(formats);
  if (!resource || !resource.uri) {
    console.warn("VrSoundEffects.load(resource) expected resource in format {url: 'http'}, got:", resource);
    return;
  }
  var url = resource.uri;
  if (!loadedSounds[url] || !loadedSounds[url].ready) {
    console.warn('VrSoundEffects: must load sound before playing', url);
    return;
  }
  AudioModule.play(url);
}

function volume(formats, volume) {
  var resource = getSupportedResource(formats);
  var url = resource.uri;
  if (!loadedSounds[url] || !loadedSounds[url].ready) {
    console.warn('VrSoundEffects: must load sound before adjusting volume', url);
    return;
  }
  if (volume < 0) {
    console.warn('VrSoundEffects: volume cannot be negative', volume);
    return;
  }
  AudioModule.setVolume(url, volume);
}

function unload(formats, volume) {
  var resource = getSupportedResource(formats);
  var url = resource.uri;
  if (loadedSounds[url]) {
    loadedSoundsRefs[url] -= 1;
    if (loadedSoundsRefs[url] === 0) {
      AudioModule.unload(url);
      delete loadedSounds[url];
      delete loadedSoundsRefs[url];
    }
  }
}

function _onAudioCanPlay(handle) {
  if (loadedSounds[handle]) {
    loadedSounds[handle].ready = true;
  }
}

RCTDeviceEventEmitter.addListener('onAudioCanPlay', _onAudioCanPlay);