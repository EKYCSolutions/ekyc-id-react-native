import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'ekyc-id-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type EkycIdReactNativeProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'EkycIdReactNativeView';

export const EkycIdReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<EkycIdReactNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
