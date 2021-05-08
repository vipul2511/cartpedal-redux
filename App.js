import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
// import {pushNotifications} from './Component/Screens/services';
// pushNotifications.configure();

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
        .then((token) => {
          console.log(token, 'TOKEN');
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

const getInitial = async () => {
  const notificationOpen = await firebase
    .notifications()
    .getInitialNotification();

  if (notificationOpen) {
    //const {title, body} = notificationOpen.notification;
    // console.log(notificationOpen.notification.data);
    alert('hello1');
  }
};

getInitial();

firebase.notifications().onNotification((notification) => {
  // console.log(notification.data, 'HELLO2');
  alert('hello2');
});

firebase.messaging().onMessage(async (m) => {
  // console.log(m.data);
  alert('hello3');
});

firebase.notifications().onNotificationOpened(async (m) => {
  // console.log(m.notification.data, 'ON OPEN');
  alert('hello4');
});

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Routes';
import initStore from './redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {LogBox, Platform} from 'react-native';
// import {GiftedChatDemo} from './Component/Screens/GiftedChatDemo';

const {store, persistor} = initStore();
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainStack />
            {/* <GiftedChatDemo /> */}
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
