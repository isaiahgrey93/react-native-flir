import React, { useState } from 'react';
import { Dimensions, View, Button, SafeAreaView } from 'react-native';
import { useFlir, FlirCameraView } from 'react-native-flir';

const useStream = () => {
  const [streaming, setStreaming] = useState(false);

  return {
    active: streaming,
    start: () => setStreaming(true),
    stop: () => setStreaming(false),
  };
};

const useThermal = () => {
  const [thermal, setThermal] = useState(false);

  return {
    active: thermal,
    enable: () => setThermal(true),
    disable: () => setThermal(false),
  };
};

const { width, height } = Dimensions.get('window');

const App = () => {
  const {
    scanning,
    connected,
    streaming,
    device,
    start,
    stop,
    connect,
    disconnect,
    onDeviceConnected,
  } = useFlir();
  const stream = useStream();
  const thermal = useThermal();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!streaming && !connected && !scanning && (
        <Button title="Scan For Devices" onPress={start} color={'green'} />
      )}
      {!streaming && !connected && scanning && (
        <Button
          title="Stop Scanning For Devices"
          onPress={stop}
          color={'red'}
        />
      )}
      {!streaming && !connected && scanning && device && (
        <Button title={`Connect ${device}`} onPress={connect} color={'green'} />
      )}
      {!streaming && connected && (
        <Button
          title={`Disconnect ${device}`}
          onPress={disconnect}
          color={'red'}
        />
      )}
      {!streaming && connected && (
        <Button
          title="Start Streaming"
          onPress={stream.start}
          color={'green'}
        />
      )}
      {streaming && connected && (
        <Button title="Stop Streaming" onPress={stream.stop} color={'red'} />
      )}
      {streaming && connected && (
        <Button
          title={thermal.active ? 'Disable Thermal' : 'Enable Thermal'}
          onPress={thermal.active ? thermal.disable : thermal.enable}
          color={thermal.active ? 'red' : 'green'}
        />
      )}
      <View style={{ opacity: streaming ? 1 : 0 }}>
        <FlirCameraView
          stream={stream.active}
          thermal={thermal.active}
          width={width}
          height={height / 1.5}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;
