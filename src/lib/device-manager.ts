import { Flir } from '../native';

import {
  ON_SCANNER_DEVICE_FOUND,
  ON_SCANNER_DEVICE_LOST,
  ON_SCANNER_ERROR,
  ON_DEVICE_CONNECT,
  ON_DEVICE_DISCONNECT,
  ON_STREAM,
} from './constants';

import { emitter } from './event-emitter';

function getDeviceManager(): DeviceScanner {
  return {
    get scanning() {
      return Flir.isScanningForDevices();
    },
    get connected() {
      return Flir.isConnected();
    },
    get streaming() {
      return Flir.isStreaming();
    },
    get fps() {
      return Flir.getFrameRate();
    },
    connect: () => Flir.connect(),
    disconnect: () => Flir.disconnect(),
    start: () => Flir.startScanningForDevices(),
    stop: () => Flir.stopScanningForDevices(),
    onDeviceFound: function onDeviceFound(callback: EventCallback<string>) {
      return emitter.addListener(ON_SCANNER_DEVICE_FOUND, callback);
    },
    onDeviceLost: function onDeviceLost(callback: EventCallback<string>) {
      return emitter.addListener(ON_SCANNER_DEVICE_LOST, callback);
    },
    onDeviceScanError: function onDeviceScanError(
      callback: EventCallback<string>
    ) {
      return emitter.addListener(ON_SCANNER_ERROR, callback);
    },
    onDeviceConnected: function onDeviceConnected(
      callback: EventCallback<string>
    ) {
      return emitter.addListener(ON_DEVICE_CONNECT, callback);
    },
    onDeviceDisconnected: function onDeviceDisconnected(
      callback: EventCallback<string>
    ) {
      return emitter.addListener(ON_DEVICE_DISCONNECT, callback);
    },
    onStream: function onStream(callback: EventCallback<string>) {
      return emitter.addListener(ON_STREAM, callback);
    },
  };
}

export { getDeviceManager };
