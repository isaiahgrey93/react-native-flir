package com.flir;

import android.graphics.Bitmap;

class FlirCameraFrameDataManager {

  public final Bitmap msxBitmap;
  public final Bitmap dcBitmap;

  FlirCameraFrameDataManager(Bitmap msxBitmap, Bitmap dcBitmap) {
    this.msxBitmap = msxBitmap;
    this.dcBitmap = dcBitmap;
  }
}
