import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const QrScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scannedRef = useRef(false);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return; 
    scannedRef.current = true;

    try {
      const parsed = JSON.parse(data);
      const machineId = parsed.machineId;
      if (!machineId) throw new Error("QR code missing 'machineId'");

      router.push({
        pathname: "../QR/Payment",
        params: { machineId },
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Scan Error", err.message || "Invalid QR code.");
      scannedRef.current = false;
    }
  };



  const handleRequestPermission = async () => {
    const result = await requestPermission();
    console.log("Permission result:", result);
  };


  // Permissions 
  // 1. Waiting for initial status
  if (!permission || permission.status === 'undetermined') {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Requesting Camera Permission...</Text>
      </View>
    );
  }

  // 2. Permanently denied
  if (!permission.granted && !permission.canAskAgain) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.heading}>Camera access is blocked</Text>
        <Text style={styles.infoText}>
          To scan QR codes, please enable camera access in your device settings.
        </Text>
        <TouchableOpacity onPress={() => Linking.openSettings()} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Denied but can still ask
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.heading}>Camera permission is required</Text>
        <TouchableOpacity onPress={handleRequestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
    </View>
  );
};

export default QrScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#1C3A7C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
  },
});
