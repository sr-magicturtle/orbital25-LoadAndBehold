import { router } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Profile = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const firestore = getFirestore();
            const user = auth.currentUser;

            if (user) {
                const uid = user.uid;
                const userRef = doc(firestore, 'users', uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setName(userData.studentName || 'Unknown');
                    setStudentId(userData.studentId || '');
                }
            }
        };

        const computeLeaderboard = async () => {
            const db = getFirestore();
            const usersSnap = await getDocs(collection(db, 'users'));
            const results = [];

            for (const userDoc of usersSnap.docs) {
                const userId = userDoc.id;
                const scansSnap = await getDocs(collection(db, 'users', userId, 'scans'));
                let totalDelay = 0;
                let count = 0;

                scansSnap.forEach((scanDoc) => {
                    const data = scanDoc.data();
                    if (data.collectionTime && data.cycleEnd) {
                        const delay =
                            new Date(data.collectionTime).getTime() - new Date(data.cycleEnd).getTime();
                        totalDelay += delay;
                        count++;
                    }
                });

                if (count > 0) {
                    const avg = totalDelay / count / 1000; // seconds
                    results.push({
                        name: userDoc.data().studentName || userDoc.data().email,
                        avgDelay: avg,
                    });
                }
            }

            results.sort((a, b) => a.avgDelay - b.avgDelay);
            setLeaderboard(results.slice(0, 50));
        };

        fetchUserData();
        computeLeaderboard();
    }, []);

    const handleLogout = async () => {
        await signOut(getAuth());
        router.replace("/");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <ImageBackground
                    source={require('../../assets/images/checkers.png')}
                    style={styles.checkers}
                    resizeMode="cover"
                />
                <Image source={require('../../assets/portrait.jpg')} style={styles.pfp} />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.studentId}>{studentId}</Text>
            </View>

            <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <Text style={styles.subtitle}>for washing machine hoggers 😡</Text>

                <ScrollView style={styles.scrollArea}>
                    {leaderboard.map((entry, index) => (
                        <View
                            key={index}
                            style={[styles.rankCard, { backgroundColor: index === 0 ? '#FF0000' : index === 1 ? '#FF5A5A' : index === 2 ? '#FF8888' : '#D3D3D3' }]}
                        >
                            <Text style={styles.rankText}>
                                #{index + 1} {entry.name} - {entry.avgDelay.toFixed(1)}s
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerWrapper: {
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    checkers: {
        width: '100%',
        height: 180,
    },
    pfp: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: -50,
        zIndex: 1,
    },
    infoBox: {
        marginTop: 60,
        alignItems: 'center',
    },
    username: {
        fontSize: 20,
        fontWeight: '500',
    },
    studentId: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: '500',
        color: '#666',
    },
    leaderboardContainer: {
        marginTop: 40,
        width: '85%',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 12,
        padding: 15,
        alignItems: 'flex-start',
        maxHeight: 400,
    },
    leaderboardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: '#555',
        marginBottom: 15,
    },
    scrollArea: {
        width: '100%',
    },
    rankCard: {
        width: '100%',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    rankText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 30,
        padding: 12,
        backgroundColor: '#1C3A7C',
        borderRadius: 10,
        position: 'absolute',
        bottom: 30,
        width: '60%',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
