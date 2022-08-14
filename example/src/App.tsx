import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import { EkycID } from 'ekyc-id-react-native';

export default function App() {
  return (
    <View style={{ flex: 1, width: 100, height: 100, backgroundColor: "red", }}>
      <Button title='Start Document Scanner' onPress={() => {
        EkycID.startDocumentScanner()
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
