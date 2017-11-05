import React from 'react';
import {
  VideoPano,
  VideoControl,
  View,
  MediaPlayerState
} from 'react-vr';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     playerState: new MediaPlayerState({autoPlay: true, muted: true}), // init with muted, autoPlay
    };
  }

  render() {
    return (
      <View>
       <VideoPano
         style={{height: 2.25, width: 4}}
         source={{uri: 'http://localhost:9000/video/360.mp4'}}
         playerState={this.state.playerState} />
       <VideoControl
         style={{height: 10, width: 4}}
         playerState={this.state.playerState} />
      </View>
    );
  }
}

module.exports = VideoPlayer;
