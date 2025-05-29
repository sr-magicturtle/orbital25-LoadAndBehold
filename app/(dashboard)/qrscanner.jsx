import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const qrscanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>qr scanner</Text>
    </View>
  );
};

export default qrscanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
})