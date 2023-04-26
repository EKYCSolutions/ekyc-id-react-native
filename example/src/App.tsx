import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import {
  EkycID,
  DocumentScannerScannerOptions,
  ObjectDetectionObjectType,
  DocumentScannerOverlayOptions,
  EkycIDLanguage,
  LivenessDetectionScannerOptions,
  LivenessPromptType,
  LivenessDetectionOverlayOptions,
} from 'ekyc-id-react-native';

export default function App() {
  const cameraOptions: DocumentScannerScannerOptions = {
    cameraOptions: {
      preparingDuration: 3,
    },
    scannableDocuments: [
      {
        mainSide: ObjectDetectionObjectType.NATIONAL_ID_0,
        // secondarySide: ObjectDetectionObjectType.NATIONAL_ID_0_BACK,
      },
    ],
  };

  const cameraOverlayOptions: DocumentScannerOverlayOptions = {
    language: EkycIDLanguage.KH,
  };

  const livenessScannerOptions: LivenessDetectionScannerOptions = {
    options: {
      prompts: [
        LivenessPromptType.LOOK_LEFT,
        LivenessPromptType.LOOK_RIGHT,
        LivenessPromptType.BLINKING,
      ],
      promptTimerCountDownSec: 5,
    },
  };

  const livenessOverlayOptions: LivenessDetectionOverlayOptions = {
    language: EkycIDLanguage.KH,
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{ flex: 1, width: 100, height: 100, backgroundColor: 'red' }}
      >
        <Button
          title="Start Liveness Detection"
          onPress={async () => {
            try {
              await EkycID.startLivenessDetection(
                livenessScannerOptions,
                livenessOverlayOptions
              );
            } catch (error) {
              console.log('startLivenessDetection error', error);
            }
          }}
        />
      </View>

      <View
        style={{ flex: 1, width: 100, height: 100, backgroundColor: 'red' }}
      >
        <Button
          title="Start Document Scanner"
          onPress={async () => {
            try {
              const res = await EkycID.startDocumentScanner(
                cameraOptions,
                cameraOverlayOptions
              );
              console.log('document scanner result ', res);
            } catch (error) {
              console.log(
                'EkycID.startDocumentScanner ',
                EkycID.startDocumentScanner
              );
            }
          }}
        />
      </View>

      <View
        style={{ flex: 1, width: 100, height: 100, backgroundColor: 'red' }}
      >
        <Button
          title="Start EkycIDExpress"
          onPress={async () => {
            try {
              const res = await EkycID.startEkycIDExpress(
                cameraOptions,
                cameraOverlayOptions,
                livenessScannerOptions,
                livenessOverlayOptions
              );
              console.log('express result', res);
            } catch (error) {
              console.log('EkycID.startEkycIDExpress', error);
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
