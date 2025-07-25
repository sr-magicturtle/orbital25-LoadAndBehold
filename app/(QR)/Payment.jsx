import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, orderBy, writeBatch, deleteDoc, updateDoc, Timestamp, getFirestore, runTransaction } from 'firebase/firestore';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';
import { scheduleLaundryReminder } from '../utils/notifications'; 
// import { sendTestNotification } from '../utils/notifications'; // for testing 

const auth = getAuth(app);
const db = getFirestore(app);

const Payment = () => {
  const { machineId, scanId } = useLocalSearchParams();

  const handleConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      if (!scanId) throw new Error("Missing scan ID from QR");

      const machineRef = doc(db, 'machines', machineId);
      const queueRef = collection(db, 'machines', machineId, 'queue');
      const userDocRef = doc(queueRef, user.uid);

      const now = new Date();
      const durationMinutes = 60;
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

      await runTransaction(db, async (transaction) => {
        const queueSnapshot = await getDocs(query(queueRef, orderBy('position')));

        if (!queueSnapshot.empty) {
          const firstInQueue = queueSnapshot.docs[0];
          if (firstInQueue.id !== user.uid) {
            throw new Error("You’re not next in the queue for this machine.");
          }

          // Remove user from queue
          transaction.delete(userDocRef);

          // Shift others up
          queueSnapshot.docs.slice(1).forEach((docSnap) => {
            const docRef = doc(queueRef, docSnap.id);
            transaction.update(docRef, {
              position: docSnap.data().position - 1,
            });
          });
        }

        // Update machine state
        transaction.update(machineRef, {
          available: false,
          currentUserId: user.uid,
          cycleStartTime: Timestamp.fromDate(now),
          durationMinutes,
          lastUpdated: Timestamp.now(),
        });

        // Update user's scan
        const scanRef = doc(db, 'users', user.uid, 'scans', scanId);
        transaction.update(scanRef, {
          cycleStart: Timestamp.fromDate(now),
          cycleEnd: Timestamp.fromDate(oneHourLater),
        });
      });

      // Schedule notification after successful transaction
      const notificationId = await scheduleLaundryReminder(60);

      // Update notification ID separately (not critical to transaction)
      await updateDoc(machineRef, { notificationId });

      Alert.alert("Success", `Machine ${machineId} started. Payment confirmed.`);
      router.replace("/(dashboard)/homepage");

    } catch (err) {
      console.error("Payment Error:", err);
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  const handleBack = () => {
    router.back(); // or router.push('/(dashboard)/camera') if it's a named route
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Image
        source={require('../../assets/payment-icon.png')}
        style={styles.image}
      />
      <Text style={styles.heading}>Confirm $1 Payment</Text>
      <Text style={styles.machineLabel}>For Machine:</Text>
      <Text style={styles.machineId}>{machineId}</Text>

      <Text style={styles.note}>This payment logs your cycle and starts the 60-minute timer.</Text>

      <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
        <Text style={styles.confirmText}>💰 Confirm & Start</Text>
      </TouchableOpacity>
      {/* 
      for testing, linked to notifications.js 
      <TouchableOpacity onPress={sendTestNotification} style={styles.confirmButton}>
        <Text style={styles.confirmText}>🧪 Send Test Notification</Text>
      </TouchableOpacity>
      */}

    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FAFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 25,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1C3A7C',
    marginBottom: 10,
  },
  machineLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  machineId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 25,
  },
  note: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  confirmButton: {
    backgroundColor: '#1C3A7C',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
