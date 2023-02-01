
#import "Flir.h"
#import "FlirCameraView.h"
#import "ThermalSDK.h"

@implementation FlirCameraView
RCT_EXPORT_MODULE(RCTFlirCameraView)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init {
     if (self = [super init]) {
         flir = [[Flir alloc] init];
         streaming = false;
         isThermal = true;
         renderer = dispatch_queue_create("render", DISPATCH_QUEUE_SERIAL);
     }
        
     return self;
}

- (UIImageView *)view
{
    if (imageview == nil) {
        imageview = [[UIImageView alloc] init];
    }
    
    return imageview;
}


- (void)onImageReceived {    
    dispatch_async(renderer, ^{
        NSError* error;
        
        if (![self -> thermal update: &error]) {
            return;
        }
        
        UIImage* image = [self -> thermal getImage];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            self -> imageview.image = image;
            
            [self -> thermal withThermalImage:^(FLIRThermalImage * image) {
                if (!self -> isThermal) {
                    image.Palette = image.PaletteManager.gray;
                } else {
                    image.Palette = image.PaletteManager.iron;
                }
            }];
        });
    });
}

- (void)onError:(nonnull NSError *)error { 
    NSLog(@"ONERROR");
}

RCT_CUSTOM_VIEW_PROPERTY(thermal, BOOL, UIImageView)
{
    BOOL active = [RCTConvert BOOL:json];

    isThermal = active;
}

RCT_CUSTOM_VIEW_PROPERTY(stream, BOOL, UIImageView)
{
    BOOL active = [RCTConvert BOOL:json];
    
    
    if (active) {
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSError* error;
            NSArray<FLIRStream*>* streams = [[flir getCamera] getStreams];
            
            if (streams.count == 0) {
                return;
            }
            
            self -> stream = streams[0];
            self -> stream.delegate = self;
            [self -> thermal setRenderScale: YES];
            self -> thermal = [[FLIRThermalStreamer alloc] initWithStream: self -> stream];

            BOOL started = [self -> stream start: &error];
            
            if (!started) {
                return;
            } else {
                self -> streaming = true;
            }
        });
    } else {
        [self -> stream stop];
        self -> streaming = false;
    }
}
@end
