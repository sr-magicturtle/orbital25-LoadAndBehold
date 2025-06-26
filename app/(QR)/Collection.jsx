import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const Collection = () => {
    const { scanId, machineId } = useLocalSearchParams();

    const handleConfirmCollection = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const scanRef = doc(db, 'users', user.uid, 'scans', scanId);

            await updateDoc(scanRef, {
                collectionTime: serverTimestamp(),
            });
            await updateDoc(doc(db, "machines", machineId), {
                available: true,
            });

            Alert.alert("Success", `Laundry collected for ${machineId}`);
            router.replace("/(dashboard)/homepage");
        } catch (err) {
            console.error(err);
            Alert.alert("Error", err.message || "Could not update collection time.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Collect Laundry</Text>
            <Text style={styles.machineText}>Machine: {machineId}</Text>
            <Text style={styles.note}>Please confirm you've collected your laundry.</Text>

            <TouchableOpacity onPress={handleConfirmCollection} style={styles.confirmButton}>
                <Text style={styles.confirmText}>Confirm Collection</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Collection;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    heading: { fontSize: 24, marginBottom: 20 },
    machineText: { fontSize: 18, marginBottom: 10 },
    note: { fontSize: 16, marginBottom: 40, textAlign: 'center', color: '#555' },
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
