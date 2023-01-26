package com.flir;

import com.flir.thermalsdk.androidsdk.ThermalSdkAndroid;

public class FlirSDKProperties {

  public static final String NAME = "FlirSDKProperties";

  public String getVersion() {
    return ThermalSdkAndroid.getVersion();
  }

  public String getCommitHash() {
    return ThermalSdkAndroid.getCommitHash();
  }
}
