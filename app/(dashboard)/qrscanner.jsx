import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const QrScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);

  useEffect(() => {
    if (permission?.status === 'undetermined') {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scannedRef.current) return;
    scannedRef.current = true;

    try {
      const parsed = JSON.parse(data);
      const machineId = parsed.machineId;
      if (!machineId) throw new Error("QR code missing 'machineId'");

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // === 0. Get machine document status
      const machineDocRef = doc(db, 'machines', machineId);
      const machineDocSnap = await getDoc(machineDocRef);
      if (!machineDocSnap.exists()) throw new Error('Machine not found');
      const machine = machineDocSnap.data();
      const isAvailable = machine.available !== false; // treat undefined as available

      // === 1. If machine is occupied/!available, only the user who started the current cycle can scan
      if (!isAvailable) {
        // Must check if user is the current user using the machine!
        // Assume you store current user's uid as `currentUserId` in the machine document
        if (machine.currentUserId !== user.uid) {
          throw new Error("This machine is currently in use by another user.");
        }
        // Allow scan to proceed to Collection page (not add log or remove from queue etc)
        // Try collection redirect if there is an unfinished scan
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
        // Otherwise, do nothing or prompt that cycle is ongoing and not in pickup state
        throw new Error('Cycle ongoing. Please wait for your machine to finish.');
      }

      // === 2. If available, check queue
      //    a. If queue exists -> only user with position 1 can scan
      //    b. If no queue  -> anyone may scan

      const queueRef = collection(db, "machines", machineId, "queue");
      const qQuery = query(queueRef, orderBy('position', 'asc'), limit(1));
      const queueSnap = await getDocs(qQuery);

      if (!queueSnap.empty) {
        // Queue exists -- user must be first in queue
        const firstInQueue = queueSnap.docs[0];
        if (firstInQueue.id !== user.uid) {
          throw new Error("It's not your turn yet. Please wait for your turn in the queue.");
        }
      }
      // else: queue is empty, any user can scan!

      // === Check if user has an existing uncollected scan for this machine
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
        if (!data.collectionTime) {
          // User has a pending collection, direct them there
          return router.push({
            pathname: '../(QR)/Collection',
            params: {
              machineId,
              scanId: docSnap.id,
            },
          });
        }
      }

      // === Allowed to start a new cycle, log scan and set machine unavailable
      const newScanRef = await addDoc(collection(db, 'users', user.uid, 'scans'), {
        machineId,
        scannedAt: serverTimestamp(),
      });

      // mark machine as unavailable and set currentUserId
      await setDoc(
        doc(db, 'machines', machineId),
        { available: false, currentUserId: user.uid },
        { merge: true }
      );

      // Reference to the user's queue document
      const userQueueDocRef = doc(db, "machines", machineId, "queue", user.uid);

      // 1. Get the user's position in queue before deletion
      const userQueueDocSnap = await getDoc(userQueueDocRef);
      let leavingPosition = null;
      if (userQueueDocSnap.exists()) {
        leavingPosition = userQueueDocSnap.data().position;
      }

      // 2. Delete the user's queue document
      await deleteDoc(userQueueDocRef);

      // 3. If position exists, update positions of users behind
      if (leavingPosition !== null) {
        const queueRef = collection(db, "machines", machineId, "queue");
        const q = query(queueRef, where("position", ">", leavingPosition));
        const queueSnap = await getDocs(q);

        // Update all affected queue entries
        const updates = queueSnap.docs.map((docSnap) =>
          setDoc(
            doc(db, "machines", machineId, "queue", docSnap.id),
            { position: docSnap.data().position - 1 },
            { merge: true }
          )
        );
        await Promise.all(updates);
      }

      

      // Redirect to payment
      router.push({
        pathname: '../(QR)/Payment',
        params: {
          machineId,
          scanId: newScanRef.id,
        },
      });

    } catch (err) {
      console.error('QR Scan Error:', err);

      Alert.alert(
        'Scan Error',
        err.message || 'Invalid QR code.',
        [
          {
            text: 'Retry',
            onPress: () => {
              scannedRef.current = false;
            },
          },
          {
            text: 'Cancel',
            onPress: () => {
              // user must manually restart scan
            },
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    }
  };

  // ... [rest of your component, unchanged] ...

  if (!permission || permission.status === 'undetermined') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.heading}>Requesting camera permission...</Text>
      </View>
    );
  }

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
