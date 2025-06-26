import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import app from '../../firebaseConfig';

// Firebase imports for ScannedAt timing 
import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp, where } from 'firebase/firestore';


const auth = getAuth(app);
const db = getFirestore(app);

const QrScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    try {
      const parsed = JSON.parse(data);
      const machineId = parsed.machineId;
      if (!machineId) throw new Error("QR code missing 'machineId'");

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // ✅ Get latest scan for this machine
      const scansRef = collection(db, 'users', user.uid, 'scans');
      const q = query(
        scansRef,
        where('machineId', '==', machineId),
        orderBy('scannedAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        // ❌ Not collected yet → go to Collection page
        if (!data.collectionTime) {
          return router.push({
            pathname: '../(QR)/Collection',
            params: {
              machineId,
              scanId: docSnap.id,
            },
          });
        }
      }

      // ✅ Otherwise: proceed to Payment (new cycle)
      // ✅ Log new scan for payment
      const newScanRef = await addDoc(collection(db, 'users', user.uid, 'scans'), {
        machineId,
        scannedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "machines", machineId), { //set machine as unavailable
        available: false,
      });

      // ✅ Navigate to payment and pass scanId
      router.push({
        pathname: "../(QR)/Payment",
        params: {
          machineId,
          scanId: newScanRef.id,
        },
      });

    } catch (err) {
      console.error("QR Scan Error:", err);
      Alert.alert("Scan Error", err.message || "Invalid QR code.");
      scannedRef.current = false;
    }
  };

  // Permissions: Waiting for initial status
  if (!permission || permission.status === 'undetermined') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.heading}>Requesting camera permission...</Text>
      </View>
    );
  }

  // Permissions: Permanently denied
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

  // Permissions: Denied but can still ask
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.heading}>Camera permission is required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
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
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
});

