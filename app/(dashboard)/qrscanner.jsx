import { CameraView, useCameraPermissions } from 'expo-camera';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from "expo-router";

const qrscanner = () => {
  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          console.log("Scanned QR data: ", data);
        }}
      />
    </View>
  );
};


  {/* code to ask for permission and open camera separately 

  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>QR Code Scanner</Text>
      
      <Pressable onPress={requestPermission}>
        <Text style={styles.permissionButton}>Request Permissions</Text>
      </Pressable>

      <Link href={"../"} asChild>
        <Pressable disabled={isPermissionGranted}>
          <Text style={[
            styles.secondPermissionButton,
            { opacity: !isPermissionGranted ? 0.5 : 1},
          ]}
          >
          Scan code
          </Text>
        </Pressable>
      </Link>

    </View>
  );
*/}



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
  permissionButton: {
    fontSize: 18,
    color: 'white',
    backgroundColor: '#1C3A7C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  secondPermissionButton: {
    fontSize: 18,
    color: 'white',
    backgroundColor: '#1C3A7C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
})