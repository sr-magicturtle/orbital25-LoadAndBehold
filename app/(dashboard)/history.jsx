import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const history = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>history page</Text>
    </View>
  );
};

export default history;

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