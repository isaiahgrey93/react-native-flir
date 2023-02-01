type EventCallback<S extends any> = (value: S) => void;

interface Flir {
  scanning: boolean;
  connected: boolean;
  streaming: boolean;
  fps: number;
  start: () => void;
  stop: () => void;
  connect: () => void;
  disconnect: () => void;
  onDeviceFound: (callback: (deviceId: string) => void) => EmitterSubscription;
  onDeviceLost: (callback: (deviceId: string) => void) => EmitterSubscription;
  onDeviceScanError: (callback: (error: string) => void) => EmitterSubscription;
  onDeviceConnected: (
    callback: (deviceId: string) => void
  ) => EmitterSubscription;
  onDeviceDisconnected: (
    callback: (deviceId: string) => void
  ) => EmitterSubscription;
}

interface UseFlir extends Flir {
  device: string | null;
}

interface Constants {
  events: {
    ON_SCANNER_DEVICE_FOUND: string;
    ON_SCANNER_DEVICE_LOST: string;
    ON_SCANNER_ERROR: string;
    ON_DEVICE_CONNECT: string;
    ON_DEVICE_DISCONNECT: string;
  };
}
