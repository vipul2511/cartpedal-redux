import AsyncStorage from '@react-native-community/async-storage';

import firebase from 'react-native-firebase';
import {pushNotifications} from './Component/Screens/services';
pushNotifications.configure();
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

firebase.notifications().onNotification((notification) => {
  console.log('uper notification', notification);
});

firebase.messaging().onMessage(async (m) => {
  // alert('hello');
  alert('hello');
});

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Routes';
import initStore from './redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

const {store, persistor} = initStore();
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
