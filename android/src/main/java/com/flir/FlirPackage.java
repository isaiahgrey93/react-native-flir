package com.flir;

import androidx.annotation.Nullable;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FlirPackage extends TurboReactPackage {

  @Override
  public List<ViewManager> createViewManagers(
    ReactApplicationContext reactContext
  ) {
    return Arrays.<ViewManager>asList(new FlirCameraViewManager(reactContext));
  }

  @Nullable
  @Override
  public NativeModule getModule(
    String name,
    ReactApplicationContext reactContext
  ) {
    if (name.equals(FlirModule.NAME)) {
      return new FlirModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      final Map<String, ReactModuleInfo> modules = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

      modules.put(
        FlirModule.NAME,
        new ReactModuleInfo(
          FlirModule.NAME,
          FlirModule.NAME,
          false,
          false,
          true,
          false,
          isTurboModule
        )
      );

      return modules;
    };
  }
}
