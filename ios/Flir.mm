#import "Flir.h"
#import "ThermalSDK.h"

FLIRCamera * camera;
FLIRDiscovery * discovery;
FLIRIdentity * detected;
FLIRStream * stream;
FLIRThermalStreamer * thermal;

BOOL isScanning;
BOOL hasObservers;

@implementation Flir
RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (instancetype)init {
 if (self = [super init]) {
     camera = [[FLIRCamera alloc] init];
     camera.delegate = self;
     
     discovery = [[FLIRDiscovery alloc] init];
     discovery.delegate = self;
     
     isScanning = false;
     hasObservers = false;
 }
 return self;
}

// EVENTS SETUP
- (void)startObserving {
  hasObservers = YES;
}

- (void)stopObserving {
  hasObservers = NO;
}

- (NSDictionary *)constantsToExport
{
 return @{
     @"events": @{
         @"ON_SCANNER_DEVICE_FOUND": @"ON_SCANNER_DEVICE_FOUND",
         @"ON_SCANNER_DEVICE_LOST": @"ON_SCANNER_DEVICE_LOST",
         @"ON_SCANNER_ERROR": @"ON_SCANNER_ERROR",
         @"ON_DEVICE_CONNECT": @"ON_DEVICE_CONNECT",
         @"ON_DEVICE_DISCONNECT": @"ON_DEVICE_DISCONNECT"
     }
};
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"ON_SCANNER_DEVICE_FOUND",
    @"ON_SCANNER_DEVICE_LOST",
    @"ON_SCANNER_ERROR",
    @"ON_DEVICE_CONNECT",
    @"ON_DEVICE_DISCONNECT"
  ];
}

- (void)sendEventWithName:(NSString *)name event:(NSString *)event {
  if (hasObservers) {
    [self sendEventWithName:name body:event];
  }
}
// EVENTS SETUP @END

- (void)cameraDiscovered:(nonnull FLIRDiscoveredCamera *)discoveredCamera {
    detected = discoveredCamera.identity;

    [self sendEventWithName:@"ON_SCANNER_DEVICE_FOUND" event:detected.deviceId];
}

- (void)cameraLost:(nonnull FLIRIdentity *)cameraIdentity {
    [self sendEventWithName:@"ON_SCANNER_DEVICE_LOST" event:detected.deviceId];
    
    detected = nil;
}

- (void)discoveryError:(nonnull NSString *)error netServiceError:(int)errorCode on:(FLIRCommunicationInterface)iface {
    [self sendEventWithName:@"ON_SCANNER_ERROR" event:error];
    
    detected = nil;
}

- (void)onDisconnected:(FLIRCamera * _Nonnull)camera withError:(nullable NSError *)error {
    [self sendEventWithName:@"ON_DEVICE_DISCONNECT" event:camera.getIdentity.deviceId];
}

RCT_EXPORT_METHOD(startScanningForDevices) {
    [discovery start:FLIRCommunicationInterfaceEmulator | FLIRCommunicationInterfaceLightning];
    
    isScanning = true;
}

RCT_EXPORT_METHOD(stopScanningForDevices) {
    [discovery stop];
    
    detected = nil;
    isScanning = false;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isScanningForDevices) {
    return @(isScanning);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isConnected) {
    return @([camera isConnected]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getCamera) {
    return camera;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDiscovery) {
    return discovery;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getDetected) {
    return detected;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getStream) {
    return stream;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getThermalStream) {
    return thermal;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(connect) {
    if (detected != nil) {
        NSError *error;

        [camera connect:detected error:&error];

        if (error != nil) {
            NSLog(@"Error: %@", error);
        } else {
            [self sendEventWithName:@"ON_DEVICE_CONNECT" event:camera.getIdentity.deviceId];
        }
    }
    
    return @(true);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(disconnect) {
    if (detected != nil) {
        [camera disconnect];
    }
    
    return @(true);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(isStreaming) {
    return @([camera isGrabbing]);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getFrameRate) {
    if ([camera isGrabbing]) {
        NSArray<FLIRStream*>* streams = [camera getStreams];
        
        if (streams.count == 0) {            
            return 0;
        }
        
        FLIRStream * _stream = streams[0];
        
        return @([_stream getFrameRate]);
    }
    
    return 0;
}


// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFlirSpecJSI>(params);
}
#endif
@end
