import { Platform, requireNativeComponent } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-flir' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NativeFlirCameraView = requireNativeComponent('RCTFlirCameraView');

const RCTFlirCameraView = NativeFlirCameraView
  ? NativeFlirCameraView
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface FlirCameraViewProps {
  stream: boolean;
  thermal: boolean;
  width: number;
  height: number;
}

const FlirCameraView =
  RCTFlirCameraView as React.ComponentType<FlirCameraViewProps>;

export { FlirCameraView };
