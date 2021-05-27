import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import NotificationSetting from 'react-native-open-notification';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Routes';
import {initStore} from './redux/store';
import {Provider} from 'react-redux';
import {LogBox, Platform} from 'react-native';
import {View} from 'native-base';
import VideoPlayer from 'react-native-video-player';
import Video from 'react-native-video';

const url =
  'https://www.cartpedal.com/attachments/attachment_1691622121108.mp4';

if (Platform.OS === 'android') {
  const channel = new firebase.notifications.Android.Channel(
    'test-channel',
    'Test Channel',
    firebase.notifications.Android.Importance.Max,
  ).setDescription('My apps test channel');
  firebase.notifications().android.createChannel(channel);
}

const messaging = firebase.messaging();

messaging
  .hasPermission()
  .then((enabled) => {
    if (enabled) {
      messaging
        .getToken()
        .then(async (token) => {
          const asked = await AsyncStorage.getItem('asked');
          if (!asked && Platform.OS === 'android') {
            NotificationSetting.open();
            await AsyncStorage.setItem('asked', 'true');
          }
          AsyncStorage.setItem('@fcmtoken', JSON.stringify(token));
        })
        .catch((error) => {
          console.log('erorr', error);
        });
    } else {
      messaging
        .requestPermission()
        .then(() => {})
        .catch((error) => {
          console.log('erorr', error);
        });
    }
  })
  .catch((error) => {});

const store = initStore();
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </Provider>
    );
  }
}

{
  /* <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5%',
              backgroundColor: 'red',
            }}>
            {Platform.OS === 'ios' ? (
              <Video
                controls={true}
                source={{uri: url}}
                style={{height: '30%', width: '70%'}}
                fullscreen={false}
                resizeMode="contain"
              />
            ) : (
              <VideoPlayer
                video={{uri: url}}
                videoHeight={800}
                videoWidth={800}
                resizeMode="cover"
                // onBuffer={onBuffer}
                // onLoadStart={onLoadStart}
                // onLoad={onLoad}
                disableControlsAutoHide={true}
              />
            )}
          </View> */
}
