import * as React from 'react';

import { StyleSheet, View } from 'react-native';


export default function App() {
  return (
    <View style={{ flex: 1, width: 100, height: 100, backgroundColor: "red", }}>

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
