import { NativeModules, Platform, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  connect(): void;
  disconnect(): void;
  getVersion(): string;
  getCommitHash(): string;
  startScanningForDevices(): void;
  stopScanningForDevices(): void;
  isScanningForDevices(): any;
}

const LINKING_ERROR =
  `The package 'react-native-flir' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;

const NativeFlirSDK = isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('Flir')
  : NativeModules.Flir;

const Flir = NativeFlirSDK
  ? NativeFlirSDK
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export { Flir };
