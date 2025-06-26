import { useFocusEffect } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/header';
import { db } from '../../firebaseConfig';
import { fetchUserQueues } from '../Queue/fetchUserQueues';

const Queue = () => {
    const [queues, setQueues] = useState([]);

    const fetchQueues = async () => {
        try {
            const queueData = await fetchUserQueues();
            setQueues(queueData);
        } catch (err) {
            console.error('Failed to fetch queues', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchQueues();
        }, [])
    );

    const handleLeaveQueue = async (machineId) => {
        const user = getAuth().currentUser;
        if (!user) return;

        try {
            const queueRef = doc(db, 'machines', machineId, 'queue', user.uid);
            await deleteDoc(queueRef);
            Alert.alert('Removed', 'You’ve left the queue.');
            fetchQueues(); // Refresh
        } catch (err) {
            console.error('Leave Queue Error:', err);
            Alert.alert('Error', err.message || 'Failed to leave queue.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.machineName}>{item.displayName}</Text>
                <Text style={styles.machineType}>{item.model}</Text>
            </View>

            <View style={styles.positionRow}>
                <Text style={styles.label}>You’re</Text>
                <View style={styles.positionBox}>
                    <Text style={styles.position}>{item.position}</Text>
                </View>
                <Text style={styles.label}>in queue!</Text>
            </View>

            <TouchableOpacity
                style={styles.leaveButton}
                onPress={() => handleLeaveQueue(item.machineId)}
            >
                <Text style={styles.leaveText}>Leave Queue</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <Text style={styles.heading}>
                    Current Queues <Text style={styles.subText}>(max 2 queues)</Text>
                </Text>

                <FlatList
                    data={queues}
                    keyExtractor={(item, index) => `${item.machineId}_${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            </View>
        </View>
    );
};

export default Queue;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6FAFF',
        padding: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1C3A7C',
    },
    subText: {
        fontSize: 14,
        color: '#777',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        marginBottom: 10,
    },
    location: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C3A7C',
    },
    machineName: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
    },
    machineType: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    positionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
    },
    positionBox: {
        backgroundColor: '#FAD9A1',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginHorizontal: 6,
    },
    position: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    leaveButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFEEEE',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    leaveText: {
        color: '#B22222',
        fontWeight: 'bold',
    },
});
