import React from 'react';
import {
  AppRegistry,
  asset,
  View
} from 'react-vr';

import VideoPlayer from './components/VideoPlayer.js';

export default class VrVideoApp extends React.Component {

  render() {
    return (
      <VideoPlayer />
    );
  }
};

AppRegistry.registerComponent('VrVideoApp', () => VrVideoApp);
