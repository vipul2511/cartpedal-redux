import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import NotificationSetting from 'react-native-open-notification';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Routes';
import {initStore} from './redux/store';
import {Provider} from 'react-redux';
import {LogBox, Platform} from 'react-native';

// import {
//   VESDK,
//   VideoEditorModal,
//   Configuration,
//   Tool,
// } from 'react-native-videoeditorsdk';

// VESDK.unlockWithLicense(require('./Routes/vesdk_android_license.json'));

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
    // VESDK.openEditor(require('./sample-mp4-file.mp4'), {
    //   tools: [Tool.TRIM, Tool.FRAME],
    // }).then((res) => console.log(res));
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <MainStack />
          {/* <GiftedChatDemo /> */}
        </NavigationContainer>
      </Provider>
    );
  }
}
