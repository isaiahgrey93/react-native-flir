package com.flir;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.Map;

public class FlirModule extends FlirSpec {

  public static final String NAME = "Flir";

  public ReactApplicationContext context;

  public FlirDeviceManager deviceManager;
  public FlirSDKProperties properties = new FlirSDKProperties();

  FlirModule(ReactApplicationContext __) {
    super(__);
    context = __;

    deviceManager = new FlirDeviceManager(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    constants.put("events", deviceManager.events);

    return constants;
  }

  @ReactMethod
  public void addListener(String event) {
    /* Keep: Required for RN built in Event Emitter Calls.  */
  }

  @ReactMethod
  public void removeListeners(Integer count) {
    /* Keep: Required for RN built in Event Emitter Calls. */
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getVersion() {
    return properties.getVersion();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String getCommitHash() {
    return properties.getCommitHash();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean isConnected() {
    return deviceManager.isConnected();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean isStreaming() {
    return deviceManager.isStreaming();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public double getFrameRate() {
    return deviceManager.getFrameRate();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean isScanningForDevices() {
    return deviceManager.isScanningForDevices();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void connect() {
    deviceManager.connect();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public void disconnect() {
    deviceManager.disconnect();
  }

  @ReactMethod
  public void startScanningForDevices() {
    deviceManager.startScanningForDevices();
  }

  @ReactMethod
  public void stopScanningForDevices() {
    deviceManager.stopScanningForDevices();
  }
}
