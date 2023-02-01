#import <React/RCTViewManager.h>

#import "ThermalSDK.h"

@interface FlirCameraView : RCTViewManager <FLIRStreamDelegate>
{
    BOOL streaming;
    BOOL isThermal;
    Flir * flir;
    FLIRStream* stream;
    FLIRThermalStreamer* thermal;
    dispatch_queue_t renderer;
    UIImageView * imageview;
}
@end
