package com.flir;

import android.graphics.Bitmap;
import android.widget.FrameLayout;
import android.widget.ImageView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import javax.annotation.Nullable;

public class FlirCameraViewManager extends SimpleViewManager<ImageView> {

  public static final String REACT_CLASS = "RCTFlirCameraView";
  public boolean thermal = false;
  ReactApplicationContext context;
  ImageView view;

  public FlirCameraViewManager(ReactApplicationContext __) {
    context = __;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public ImageView createViewInstance(ThemedReactContext __) {
    view = new ImageView(context);

    view.setBackgroundColor(0xFF000000);

    return view;
  }

  private int height;
  private int width;

  @ReactProp(name = "height")
  public void setHeight(ImageView view, @Nullable int h) {
    view.setLayoutParams(new FrameLayout.LayoutParams(width, h));
  }

  @ReactProp(name = "width")
  public void setWidth(ImageView view, @Nullable int w) {
    view.setLayoutParams(new FrameLayout.LayoutParams(w, height));
  }

  @ReactProp(name = "thermal")
  public void setThermal(ImageView view, @Nullable boolean t) {
    thermal = t;
  }

  @ReactProp(name = "stream")
  public void stream(ImageView view, @Nullable boolean stream) {
    if (!stream) {
      FlirDeviceManager.stopStreaming();

      view.setImageDrawable(null);

      return;
    }

    FlirDeviceManager.startStream(
      new FlirDeviceManager.StreamDataListener() {
        public void images(FlirCameraFrameDataManager dataHolder) {
          if (thermal) view.setImageBitmap(
            dataHolder.msxBitmap
          ); else view.setImageBitmap(dataHolder.dcBitmap);
        }

        public void images(Bitmap msxBitmap, Bitmap dcBitmap) {
          if (thermal) view.setImageBitmap(msxBitmap); else view.setImageBitmap(
            dcBitmap
          );
        }
      }
    );
  }
}
