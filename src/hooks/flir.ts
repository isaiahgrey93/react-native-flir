import { useRef, useEffect, useState } from 'react';

import { getFlir } from '../lib';

const useFlir = (): UseFlir => {
  const { current: flir } = useRef(getFlir());

  const device = useDetectedDevice();
  const scanning = useIsScanningForDevice();
  const connected = useIsConnectedToDevice();
  const streaming = useIsStreaming();
  const fps = useFPS();

  return {
    fps,
    streaming,
    scanning,
    connected,
    device,
    start: flir.start,
    stop: flir.stop,
    connect: flir.connect,
    disconnect: flir.disconnect,
    onDeviceFound: flir.onDeviceFound,
    onDeviceLost: flir.onDeviceLost,
    onDeviceScanError: flir.onDeviceScanError,
    onDeviceConnected: flir.onDeviceConnected,
    onDeviceDisconnected: flir.onDeviceDisconnected,
  };
};

const useFPS = (interval: number = 1000) => {
  const { current: flir } = useRef(getFlir());

  const [fps, setFPS] = useState(flir.fps);

  useEffect(() => {
    const subscription = setInterval(() => {
      setFPS(flir.fps);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return fps;
};

const useIsStreaming = (interval: number = 1000) => {
  const { current: flir } = useRef(getFlir());

  const [streaming, setStreaming] = useState(flir.streaming);

  useEffect(() => {
    const subscription = setInterval(() => {
      setStreaming(flir.streaming);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return streaming;
};

const useIsScanningForDevice = (interval: number = 1000) => {
  const { current: flir } = useRef(getFlir());

  const [scanning, setScanning] = useState(flir.scanning);

  useEffect(() => {
    const subscription = setInterval(() => {
      setScanning(flir.scanning);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return scanning;
};

const useIsConnectedToDevice = (interval: number = 1000) => {
  const { current: flir } = useRef(getFlir());

  const [connected, setConnected] = useState(flir.connected);

  useEffect(() => {
    const subscription = setInterval(() => {
      setConnected(flir.connected);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return connected;
};

const useDetectedDevice = () => {
  const [device, setDevice] = useState<string | null>(null);

  useOnDeviceFound((id) => setDevice(id));
  useOnDeviceLost(() => setDevice(null));

  return device;
};

const useOnDeviceFound = (callback: (id: string) => void) => {
  const { current: flir } = useRef(getFlir());

  useEffect(() => {
    const listener = flir.onDeviceFound(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

const useOnDeviceLost = (callback: (id: string) => void) => {
  const { current: flir } = useRef(getFlir());

  useEffect(() => {
    const listener = flir.onDeviceLost(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

const useOnDeviceScanError = (callback: (error: string) => void) => {
  const { current: flir } = useRef(getFlir());

  useEffect(() => {
    const listener = flir.onDeviceScanError(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

export {
  useFlir,
  useFPS,
  useIsStreaming,
  useIsConnectedToDevice,
  useIsScanningForDevice,
  useDetectedDevice,
  useOnDeviceFound,
  useOnDeviceLost,
  useOnDeviceScanError,
};
