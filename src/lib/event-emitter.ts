import { NativeEventEmitter } from 'react-native';

import { Flir } from '../native';

const emitter = new NativeEventEmitter(Flir);

export { emitter };
