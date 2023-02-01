import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
  Switch,
} from 'react-native';

import { useSDKInfo, useDeviceManager, FlirCameraView } from '../../src';

export default function App() {
  const [active, setActive] = React.useState(false);
  const [thermal, setThermal] = React.useState(false);
  const toggleActive = () => setActive((prev) => !prev);
  const toggleThermal = () => setThermal((prev) => !prev);
  const { version, commit } = useSDKInfo();
  const {
    fps,
    start,
    stop,
    streaming,
    connect,
    disconnect,
    device,
    scanning,
    connected,
    onDeviceConnected,
    onDeviceDisconnected,
    onDeviceScanError,
  } = useDeviceManager();

  onDeviceConnected((device) => {
    console.log('Device Connected', device);
  });

  onDeviceDisconnected((device) => {
    console.log('Device Disconnected', device);
  });

  onDeviceScanError((error) => {
    console.log('Device Scan Error', error);
  });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={{ padding: 12, fontSize: 32, textAlign: 'center' }}>
          react-native-flir
        </Text>
        {connected ? null : (
          <View style={{ padding: 12 }}>
            <Button
              title={scanning ? 'Stop Scanning' : 'Start Scanning'}
              onPress={scanning ? stop : start}
              color={scanning ? 'red' : 'green'}
            />
          </View>
        )}
        {streaming ? null : scanning && device ? (
          <View style={{ padding: 12 }}>
            <Button
              title={`${connected ? 'Disconnect' : 'Connect'} ${device}`}
              color={connected ? 'red' : 'green'}
              onPress={connected ? disconnect : connect}
            />
          </View>
        ) : (
          <View style={{ padding: 12 }}>
            <Text style={{ textAlign: 'center' }}>No Devices Detected</Text>
            <Text style={{ textAlign: 'center' }}>Scanning For Devices...</Text>
            <Text style={{ textAlign: 'center' }}>
              Connect Your Flir One Camera
            </Text>
          </View>
        )}
        {connected ? (
          <>
            <View style={{ padding: 12 }}>
              <Button
                title={streaming ? 'Stop Streaming' : 'Start Streaming'}
                onPress={toggleActive}
                color={streaming ? 'red' : 'green'}
              />
            </View>
            {streaming ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                }}
              >
                <Text>Thermal: </Text>
                <Switch value={thermal} onValueChange={toggleThermal} />
              </View>
            ) : null}
          </>
        ) : null}
        <View style={{ padding: 12 }}>
          {
            <ActivityIndicator
              size={'large'}
              animating={connected ? false : scanning}
            />
          }
        </View>
      </View>
      <View
        style={{
          borderWidth: 1,
          borderColor: 'black',
        }}
      >
        <Text>FPS: {fps}</Text>
        <FlirCameraView
          stream={active}
          thermal={thermal}
          width={330}
          height={440}
        />
      </View>
      <View style={{ paddingVertical: 12 }}>
        <Text style={{ textAlign: 'center' }}>
          v{version}#{commit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
