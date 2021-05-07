import {Platform} from 'react-native';
import {
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

export const recordingPermissions = async () => {
  try {
    const granted = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        : PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === RESULTS.GRANTED) {
    } else {
      return;
    }
  } catch (err) {
    console.warn(err);
    return;
  }
  try {
    const granted = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.RECORD_AUDIO,
    );
    if (granted === RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('permission denied');
      return;
    }
  } catch (err) {
    console.warn(err);
    return;
  }
};

export const locationPermission = async () => {
  try {
    const granted = await requestMultiple([
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.ACCESS_FINE_LOCATION,
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
        : PERMISSIONS.IOS.ACCESS_COARSE_LOCATION,
    ]);
    console.log('GRANTED', granted);
  } catch (err) {
    console.warn(err);
    return;
  }
};
