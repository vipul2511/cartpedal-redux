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

firebase.notifications().onNotification((notification) => {});

firebase.messaging().onMessage(async (m) => {});

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {MainStack} from './Routes';
import initStore from './redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {LogBox} from 'react-native';

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
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}
