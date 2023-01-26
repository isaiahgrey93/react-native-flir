package com.flir;

import android.graphics.Bitmap;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.flir.thermalsdk.ErrorCode;
import com.flir.thermalsdk.androidsdk.ThermalSdkAndroid;
import com.flir.thermalsdk.androidsdk.image.BitmapAndroid;
import com.flir.thermalsdk.image.TemperatureUnit;
import com.flir.thermalsdk.image.ThermalImage;
import com.flir.thermalsdk.image.ThermalValue;
import com.flir.thermalsdk.image.fusion.FusionMode;
import com.flir.thermalsdk.image.isotherms.BlendingMode;
import com.flir.thermalsdk.image.isotherms.Isotherm;
import com.flir.thermalsdk.image.isotherms.IsothermType;
import com.flir.thermalsdk.image.isotherms.PresetColor;
import com.flir.thermalsdk.image.palettes.PaletteManager;
import com.flir.thermalsdk.live.Camera;
import com.flir.thermalsdk.live.CommunicationInterface;
import com.flir.thermalsdk.live.ConnectParameters;
import com.flir.thermalsdk.live.Identity;
import com.flir.thermalsdk.live.WirelessCameraDetails;
import com.flir.thermalsdk.live.connectivity.ConnectionStatusListener;
import com.flir.thermalsdk.live.discovery.CameraScanner;
import com.flir.thermalsdk.live.discovery.DiscoveredCamera;
import com.flir.thermalsdk.live.discovery.DiscoveryEventListener;
import com.flir.thermalsdk.live.discovery.DiscoveryFactory;
import com.flir.thermalsdk.live.streaming.Stream;
import com.flir.thermalsdk.live.streaming.ThermalStreamer;
import com.flir.thermalsdk.log.ThermalLog;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class FlirDeviceManager {

  public static final String NAME = "FlirDeviceManager";
  private static ReactApplicationContext context;

  public static final Map<String, String> events;

  static {
    events = new HashMap<>();

    events.put("ON_SCANNER_DEVICE_FOUND", "on-scanner-device-found");
    events.put("ON_SCANNER_DEVICE_LOST", "on-scanner-device-lost");
    events.put("ON_SCANNER_ERROR", "on-scanner-error");

    events.put("ON_DEVICE_CONNECT", "on-device-connect");
    events.put("ON_DEVICE_DISCONNECT", "on-device-disconnect");
  }

  private static DiscoveryFactory scanner;
  private static Camera camera;
  private static Identity detected;
  private static Stream stream;
  private static ThermalStreamer thermal;

  private static StreamDataListener frames;

  public interface StreamDataListener {
    void images(FlirCameraFrameDataManager dataHolder);

    void images(Bitmap msxBitmap, Bitmap dcBitmap);
  }

  private static boolean scanning = false;

  FlirDeviceManager(ReactApplicationContext __) {
    context = __;

    ThermalSdkAndroid.init(context, ThermalLog.LogLevel.DEBUG);

    scanner = DiscoveryFactory.getInstance();
  }

  public static boolean isConnected() {
    return camera != null;
  }

  public static boolean isStreaming() {
    return stream != null && stream.isStreaming();
  }

  public static void connect() {
    if (detected == null) {
      return;
    }

    camera = new Camera();

    try {
      camera.connect(
        detected,
        new ConnectionStatusListener() {
          public void onDisconnected(ErrorCode error) {
            context
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit(events.get("ON_DEVICE_DISCONNECT"), detected.deviceId);
          }
        },
        new ConnectParameters()
      );

      context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(events.get("ON_DEVICE_CONNECT"), detected.deviceId);
    } catch (IOException e) {
      camera = null;
    }
  }

  private static boolean isotherms = true;

  public static double getFrameRate() {
    if (stream == null) {
      return 0;
    }

    return stream.getFrameRate();
  }

  public static void startStream(StreamDataListener listener) {
    frames = listener;

    if (camera == null || !camera.isConnected()) {
      return;
    }

    stream = camera.getStreams().get(0);

    if (stream.isThermal()) {
      thermal = new ThermalStreamer(stream);
    } else {
      return;
    }

    stream.start(
      unused -> {
        thermal.update();
        // use an array of bitmaps to twork around lamba requirement of final variables
        // without doing so, we are unable to modify the variable in the higher scope inside of the
        // withThermalImage callback
        final Bitmap[] dcBitmaps = new Bitmap[1];

        thermal.withThermalImage(thermalImage -> {
          thermalImage.setPalette(
            PaletteManager
              .getDefaultPalettes()
              .stream()
              .filter(palette -> palette.name.equalsIgnoreCase("iron"))
              .findFirst()
              .orElseGet(() -> PaletteManager.getDefaultPalettes().get(0))
          );

          dcBitmaps[0] =
            BitmapAndroid
              .createBitmap(
                Objects.requireNonNull(
                  Objects.requireNonNull(thermalImage.getFusion()).getPhoto()
                )
              )
              .getBitMap();
        });

        thermal.update();

        if (isotherms) {
          thermal.withThermalImage(thermalImage -> {
            thermalImage.getIsotherms().clear();
            thermalImage
              .getIsotherms()
              .add(
                new Isotherm.Builder(
                  IsothermType.ABOVE,
                  BlendingMode.TRANSPARENT
                )
                  .cutoff(new ThermalValue(29, TemperatureUnit.CELSIUS))
                  .presetColor(PresetColor.PALETTE_1)
                  .build()
              );
          });

          isotherms = false;
        }

        final Bitmap msxBitmap = BitmapAndroid
          .createBitmap(thermal.getImage())
          .getBitMap();

        frames.images(msxBitmap, dcBitmaps[0]);
      },
      error -> {
        //
      }
    );
  }

  public static void stopStreaming() {
    if (stream != null) {
      if (stream.isStreaming()) {
        stream.stop();
      }

      stream = null;
      isotherms = true;
    }
  }

  public static void disconnect() {
    if (camera == null) {
      return;
    }

    if (stream != null) {
      if (stream.isStreaming()) {
        stream.stop();
      }
    }

    camera.disconnect();
    camera = null;

    context
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(events.get("ON_DEVICE_DISCONNECT"), detected.deviceId);
  }

  public static boolean isScanningForDevices() {
    return scanning;
  }

  public static void startScanningForDevices() {
    scanner.scan(
      new DiscoveryEventListener() {
        @Override
        public void onCameraFound(DiscoveredCamera discoveredCamera) {
          Identity identity = discoveredCamera.getIdentity();

          detected = identity;

          context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(events.get("ON_SCANNER_DEVICE_FOUND"), identity.deviceId);
        }

        @Override
        public void onCameraLost(Identity identity) {
          detected = null;

          context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(events.get("ON_SCANNER_DEVICE_LOST"), identity.deviceId);
        }

        @Override
        public void onDiscoveryError(
          CommunicationInterface __,
          ErrorCode error
        ) {
          detected = null;

          context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(events.get("ON_SCANNER_ERROR"), error.toString());

          stopScanningForDevices();
        }
      },
      CommunicationInterface.USB,
      CommunicationInterface.EMULATOR
    );

    scanning = true;
  }

  public static void stopScanningForDevices() {
    scanner.stop(CommunicationInterface.USB, CommunicationInterface.EMULATOR);

    scanning = false;
  }
}
