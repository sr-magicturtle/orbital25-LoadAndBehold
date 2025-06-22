import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
// import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';
import { doc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';


const auth = getAuth(app);
const db = getFirestore(app);

const Payment = () => {
  const { machineId, scanId } = useLocalSearchParams();


  // const handleConfirm = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     if (!user) throw new Error("User not authenticated");

  //     await addDoc(collection(db, "users", user.uid, "scans"), {
  //       machineId,
  //       scannedAt: serverTimestamp(),
  //     });

  //     Alert.alert("Success", `Machine ${machineId} logged, Payment recorded`);
  //     router.replace("/(dashboard)/homepage");
  //   } catch (err) {
  //     console.error(err);
  //     Alert.alert("Error", err.message || "Could not log scan.");
  //   }
  // };

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      if (!scanId) throw new Error("Missing scan ID from QR");

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // add 1 hour

      const scanRef = doc(db, 'users', user.uid, 'scans', scanId);

      await updateDoc(scanRef, {
        cycleStart: Timestamp.fromDate(now),
        cycleEnd: Timestamp.fromDate(oneHourLater),
      });

      Alert.alert("Success", `Machine ${machineId} logged. Payment confirmed.`);
      router.replace("/(dashboard)/homepage");

    } catch (err) {
      console.error("Payment Error:", err);
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Confirm payment of $1</Text>
      <Text style={styles.machineText}>Machine: {machineId}</Text>

      <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 24, marginBottom: 20 },
  machineText: { fontSize: 18, marginBottom: 40 },
  confirmButton: {
    backgroundColor: '#1C3A7C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
  },
});

