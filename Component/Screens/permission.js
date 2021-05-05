
import {check, request,requestMultiple ,PERMISSIONS, RESULTS} from 'react-native-permissions';
/**
 * @name requestCameraAndAudioPermission
 * @description Function to request permission for Audio and Camera
 */
export default async function requestCameraAndAudioPermission() {
	try {
		const granted = await requestMultiple([
			Platform.OS === 'android'?PERMISSIONS.ANDROID.CAMERA:PERMISSIONS.IOS.CAMERA,
			Platform.OS === 'android'?PERMISSIONS.IOS.RECORD_AUDIO:PERMISSIONS.IOS.CAMERA,
		]);
		if (
			granted["android.permission.RECORD_AUDIO"] ===
			PermissionsAndroid.RESULTS.GRANTED &&
			granted["android.permission.CAMERA"] ===
			PermissionsAndroid.RESULTS.GRANTED
		) {
			console.log("You can use the cameras & mic");
		} else {
			console.log("Permission denied");
		}
	} catch (err) {
		console.warn(err);
	}
}