import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

            await updateDoc(doc(db, 'machines', machineId), {
                available: true,
            });

            Alert.alert('Success', `Laundry collected for ${machineId}`);
            router.replace('/(dashboard)/homepage');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.message || 'Could not update collection time.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/laundry-icon.png')} // Replace with your own image asset if needed
                style={styles.image}
            />
            <Text style={styles.heading}>Collect Laundry</Text>
            <Text style={styles.machineId}>Machine: <Text style={styles.machineHighlight}>{machineId}</Text></Text>
            <Text style={styles.instruction}>Please ensure you've collected all your laundry before confirming.</Text>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCollection}>
                <Text style={styles.confirmText}>✅ Confirm Collection</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Collection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FAFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 25,
    },
    heading: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1C3A7C',
    },
    machineId: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    machineHighlight: {
        color: '#007AFF',
    },
    instruction: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 40,
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
