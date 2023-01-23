
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNFlirSpec.h"

@interface Flir : NSObject <NativeFlirSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Flir : NSObject <RCTBridgeModule>
#endif

@end
