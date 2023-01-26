import { Flir } from '../native';

const {
  events: {
    ON_SCANNER_DEVICE_FOUND,
    ON_SCANNER_DEVICE_LOST,
    ON_SCANNER_ERROR,
    ON_DEVICE_CONNECT,
    ON_DEVICE_DISCONNECT,
  },
}: Constants = Flir.getConstants();

const ON_STREAM = 'ON_STREAM';

export {
  ON_SCANNER_DEVICE_FOUND,
  ON_SCANNER_DEVICE_LOST,
  ON_SCANNER_ERROR,
  ON_DEVICE_CONNECT,
  ON_DEVICE_DISCONNECT,
  ON_STREAM,
};
