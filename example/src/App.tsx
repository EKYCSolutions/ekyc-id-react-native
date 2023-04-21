import * as React from 'react';

import { View, Button } from 'react-native';
import {
  EkycID,
  EkycIDLanguage,
  LivenessPromptType,
  ObjectDetectionObjectType,
} from '@ekycsolutions/ekyc-id-react-native';
import type {
  LivenessDetectionScannerOptions,
  LivenessDetectionOverlayOptions,
  DocumentScannerScannerOptions,
  DocumentScannerOverlayOptions,
} from '@ekycsolutions/ekyc-id-react-native';

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
            await EkycID.startLivenessDetection(
              livenessScannerOptions,
              livenessOverlayOptions
            );
          }}
        />
      </View>

      <View
        style={{ flex: 1, width: 100, height: 100, backgroundColor: 'red' }}
      >
        <Button
          title="Start Document Scanner"
          onPress={async () => {
            await EkycID.startDocumentScanner(
              cameraOptions,
              cameraOverlayOptions
            );
          }}
        />
      </View>

      <View
        style={{ flex: 1, width: 100, height: 100, backgroundColor: 'red' }}
      >
        <Button
          title="Start EkycIDExpress"
          onPress={async () => {
            await EkycID.startEkycIDExpress(
              cameraOptions,
              cameraOverlayOptions,
              livenessScannerOptions,
              livenessOverlayOptions
            );
          }}
        />
      </View>
    </View>
  );
}
