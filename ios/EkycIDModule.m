//
//  EkycIDModule.m
//  ekyc-id-react-native
//
//  Created by Socret Lee on 8/17/22.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EkycIDModule, NSObject)

RCT_EXTERN_METHOD(
                  startDocumentScanner: (NSDictionary *)scannerOptions
                  overlayOptions: (NSDictionary*)overlayOptions
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  startLivenessDetection: (NSDictionary *)scannerOptions
                  overlayOptions: (NSDictionary*)overlayOptions
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
                  startEkycIDExpress: (NSDictionary *)documentScannerScannerOptions
                  documentScannerOverlayOptions: (NSDictionary*)documentScannerOverlayOptions
                  livenessDetectionScannerOptions: (NSDictionary *)livenessDetectionScannerOptions
                  livenessDetectionOverlayOptions: (NSDictionary*)livenessDetectionOverlayOptions
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
)

@end
