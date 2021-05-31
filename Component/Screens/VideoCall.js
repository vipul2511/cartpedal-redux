/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialIcons';

// const config = {
//   //Setting config of the app
//   appid: '0f8cb6d4df7f4f548daaf17f5f896413', //Enter the App ID generated from the Agora Website
//   channelProfile: 0, //Set channel profile as 0 for RTC
//   videoEncoderConfig: {
//     //Set Video feed encoder settings
//     width: 720,
//     height: 1080,
//     bitrate: 1,
//   },
// };

class VideoCall extends Component {
  _engine;
  constructor(props) {
    super(props);
    this.state = {
      appId: 'b1ff97b3e47244eaa4c0177359705c0f',
      // channelName: 'yashpk2128',
      // token:
      //   '006b1ff97b3e47244eaa4c0177359705c0fIAAi7fTiSfrOlbRxKJsMTYAAwRwbAvhZGz2ceZuvEz2po83fcWcAAAAAEAD/3NMfiFy2YAEAAQCIXLZg',
      channelName: '+919630884259',
      token:
        '006b1ff97b3e47244eaa4c0177359705c0fIAD7FAdMgt5SUlRLjU7/fDRPTFhPTAY5WKbFXQeAA2utrMqpoY0AAAAAIgClrUYA36S2YAQAAQBvYbVgAwBvYbVgAgBvYbVgBABvYbVg',
      // channelName: this.props.route.params.channel,
      // token: this.props.route.params.token,
      joinSucceed: false,
      peerIds: [],
      uid: Math.floor(Math.random() * 100), //Generate a UID for local user
      Password: '', //Channel Name for the current session
      vidMute: false, //State variable for Video Mute
      audMute: false,
      color: false, //State variable for storing success
    };
  }
  componentDidMount = async () => {
    this._engine = await RtcEngine.create(this.state.appId);
    // Enable the video module.
    await this._engine.enableVideo();
    // await this._engine.enableAudio();

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJOINED');
      const {peerIds} = this.state;
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          peerIds: [...peerIds, uid],
        });
      }
    });

    // Listen for the UserOffline callback.
    // This callback occurs when the remote user leaves the channel or drops offline.
    this._engine.addListener('UserOffline', async (uid, reason) => {
      const {peerIds} = this.state;
      await this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
      });
      if (this.state.peerIds.length === 0) {
        this.endCall();
      }
    });

    // Listen for the JoinChannelSuccess callback.
    // This callback occurs when the local user successfully joins the channel.
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({
        joinSucceed: true,
      });
    });

    try {
      console.log(this.state.token, this.state.channelName);
      const isJoined = await this._engine?.joinChannel(
        this.state.token,
        this.state.channelName,
        null,
        0,
      );
      console.log(isJoined, 'joinChannel');
    } catch (error) {
      console.log(error);
    }
  };

  endCall = async () => {
    this.setState({color: true});
    await this._engine?.leaveChannel();
    this.setState(
      {
        peerIds: [],
        joinSucceed: false,
      },
      () => {
        this.props.navigation.goBack();
      },
    );
  };

  async toggleAudio() {
    let mute = this.state.audMute;
    await this._engine?.muteLocalAudioStream(!mute);
    this.setState({
      audMute: !mute,
    });
  }

  async toggleVideo() {
    let mute = this.state.vidMute;
    this.setState({
      vidMute: !mute,
    });
    await this._engine?.muteLocalVideoStream(!this.state.vidMute);
  }

  videoView() {
    return (
      <View style={styles.max}>
        {
          <View style={styles.max}>
            {!this.state.joinSucceed ? (
              <View />
            ) : (
              <View style={styles.fullView}>
                {this.state.peerIds.length > 0 ? (
                  <View style={styles.full}>
                    <RtcRemoteView.SurfaceView
                      style={styles.full}
                      uid={this.state.peerIds[0]}
                      channelId={this.state.channelName}
                      renderMode={VideoRenderMode.Hidden}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'black',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        this.props.route.params.useravatar
                          ? {
                              uri: this.props.route.params.useravatar,
                            }
                          : require('../images/default_user.png')
                      }
                      style={{width: 220, height: 220}}
                    />
                  </View>
                )}
                <RtcLocalView.SurfaceView
                  style={[styles.localVideoStyle, {width: 120, height: 180}]}
                  zOrderMediaOverlay={true}
                  channelId={this.state.channelName}
                  renderMode={VideoRenderMode.Hidden}
                />
              </View>
            )}
          </View>
        }
        <View style={styles.buttonBar}>
          <Icon.Button
            style={styles.iconStyle}
            backgroundColor="#0093E9"
            name={this.state.audMute ? 'mic-off' : 'mic'}
            onPress={() => this.toggleAudio()}
          />
          <Icon.Button
            style={styles.iconStyle}
            backgroundColor="#0093E9"
            name="call-end"
            color={this.state.color ? 'red' : 'white'}
            onPress={() => this.endCall()}
          />
          <Icon.Button
            style={styles.iconStyle}
            backgroundColor="#0093E9"
            name={this.state.vidMute ? 'videocam-off' : 'videocam'}
            onPress={() => this.toggleVideo()}
          />
        </View>
      </View>
    );
  }
  render() {
    console.log(this.props.route.params);
    return this.videoView();
  }
}

export default VideoCall;

let dimensions = {
  //get dimensions of the device to use in view styles
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height,
    position: 'absolute',
    zIndex: -1,
  },
  halfViewRow: {
    flex: 1 / 2,
    flexDirection: 'row',
  },
  full: {
    top: 0,
    flex: 1,
    // width: dimensions.width,
    // height: dimensions.height ,
    zIndex: -1,
    // position:'absolute'
  },
  half: {
    flex: 1 / 2,
  },
  localVideoStyle: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 100,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
  buttonBar: {
    height: 50,
    backgroundColor: '#0093E9',
    display: 'flex',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  iconStyle: {
    fontSize: 34,
    paddingTop: 15,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 15,
    borderRadius: 0,
  },
});
