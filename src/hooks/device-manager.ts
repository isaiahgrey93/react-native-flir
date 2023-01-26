import { useRef, useEffect, useState } from 'react';

import { getDeviceManager } from '../lib';

const useDeviceManager = () => {
  const { current: dm } = useRef(getDeviceManager());

  const device = useDetectedDevice();
  const scanning = useIsScanningForDevice();
  const connected = useIsConnectedToDevice();
  const streaming = useIsStreaming();
  const fps = useFPS();

  return {
    start: dm.start,
    stop: dm.stop,
    connect: dm.connect,
    disconnect: dm.disconnect,
    fps,
    streaming,
    scanning,
    connected,
    device,
    onDeviceFound: dm.onDeviceFound,
    onDeviceLost: dm.onDeviceLost,
    onDeviceScanError: dm.onDeviceScanError,
    onDeviceConnected: dm.onDeviceConnected,
    onDeviceDisconnected: dm.onDeviceDisconnected,
    onStream: dm.onStream,
  };
};

const useFPS = (interval: number = 1000) => {
  const { current: dm } = useRef(getDeviceManager());

  const [fps, setFPS] = useState(dm.fps);

  useEffect(() => {
    const subscription = setInterval(() => {
      setFPS(dm.fps);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return fps;
};

const useIsStreaming = (interval: number = 1000) => {
  const { current: dm } = useRef(getDeviceManager());

  const [streaming, setStreaming] = useState(dm.streaming);

  useEffect(() => {
    const subscription = setInterval(() => {
      setStreaming(dm.streaming);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return streaming;
};

const useIsScanningForDevice = (interval: number = 1000) => {
  const { current: dm } = useRef(getDeviceManager());

  const [scanning, setScanning] = useState(dm.scanning);

  useEffect(() => {
    const subscription = setInterval(() => {
      setScanning(dm.scanning);
    }, interval);

    return () => {
      clearInterval(subscription);
    };
  }, []);

  return scanning;
};

const useIsConnectedToDevice = (interval: number = 1000) => {
  const { current: dm } = useRef(getDeviceManager());

  const [connected, setConnected] = useState(dm.connected);

  useEffect(() => {
    const subscription = setInterval(() => {
      setConnected(dm.connected);
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
  const { current: dm } = useRef(getDeviceManager());

  useEffect(() => {
    const listener = dm.onDeviceFound(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

const useOnDeviceLost = (callback: (id: string) => void) => {
  const { current: dm } = useRef(getDeviceManager());

  useEffect(() => {
    const listener = dm.onDeviceLost(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

const useOnDeviceScanError = (callback: (error: string) => void) => {
  const { current: dm } = useRef(getDeviceManager());

  useEffect(() => {
    const listener = dm.onDeviceScanError(callback);

    return () => {
      listener.remove();
    };
  }, []);
};

export {
  useDeviceManager,
  useIsScanningForDevice,
  useDetectedDevice,
  useOnDeviceFound,
  useOnDeviceLost,
  useOnDeviceScanError,
};
