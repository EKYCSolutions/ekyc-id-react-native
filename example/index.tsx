import { AppRegistry, PermissionsAndroid, Platform } from 'react-native';
import App from './src/App';

const requestCameraPermission = async () => {
  try {
    if (PermissionsAndroid.PERMISSIONS.CAMERA != null) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Need Camera Permission',
          message:
            'EKYC Id needs access to your camera ' +
            'so you can start verify your customer',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};

if (Platform.OS === 'android') {
  requestCameraPermission();
}
AppRegistry.registerComponent('main', () => App);
