import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const Payment = () => {
  const { machineId } = useLocalSearchParams();

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(db, "users", user.uid, "scans"), {
        machineId,
        scannedAt: new Date().toISOString(),
      });

      Alert.alert("Success", `Machine ${machineId} logged, Payment recorded`);
      router.replace("/(dashboard)/homepage");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Could not log scan.");
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
}

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
