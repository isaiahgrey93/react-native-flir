package com.flir;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

abstract class FlirSpec extends ReactContextBaseJavaModule {

  FlirSpec(ReactApplicationContext context) {
    super(context);
  }
}
