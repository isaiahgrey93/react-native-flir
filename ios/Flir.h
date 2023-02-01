#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "ThermalSDK.h"

@interface Flir : RCTEventEmitter <RCTBridgeModule, FLIRDiscoveryEventDelegate, FLIRDataReceivedDelegate>
    - (FLIRCamera *) getCamera;
    - (FLIRDiscovery *) getDiscovery;
    - (FLIRIdentity *) getDetected;
    - (FLIRStream *) getStream;
    - (FLIRThermalStreamer *) getThermalStream;
@end
