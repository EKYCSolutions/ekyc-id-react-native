import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { DocumentScannerResult, DocumentScannerView } from 'ekyc-id-react-native';

export default function App() {
  return (
    <DocumentScannerView
      options={{ preparingDuration: 2, }}
      onDocumentScanned={async (mainSide: DocumentScannerResult, secondarySide?: DocumentScannerResult) => { }}
    />
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
