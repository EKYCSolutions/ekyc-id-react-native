import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { EkycID, DocumentScannerScannerOptions, ObjectDetectionObjectType, DocumentScannerOverlayOptions, EkycIDLanguage } from 'ekyc-id-react-native';

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
  }

  const cameraOverlayOptions: DocumentScannerOverlayOptions = {
    language: EkycIDLanguage.EN
  }

  return (
    <View style={{ flex: 1, width: 100, height: 100, backgroundColor: "red", }}>
      <Button title='Start Document Scanner' onPress={async () => {
        const r = await EkycID.startDocumentScanner(cameraOptions, cameraOverlayOptions)
        console.log(r.mainSide.documentType)
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
