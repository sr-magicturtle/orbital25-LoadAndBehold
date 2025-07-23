import { router } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
} from 'firebase/firestore';
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
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState({ totalWash: 0, avgWait: 0 });

    useEffect(() => {
        const loadData = async () => {
            const auth = getAuth();
            const firestore = getFirestore();
            const user = auth.currentUser;
            if (!user) return;
            const uid = user.uid;

            // Load user profile
            const userRef = doc(firestore, 'users', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                setName(data.studentName || 'Unknown');
                setStudentId(data.studentId || '');
            }

            // Compute leaderboard
            const usersSnap = await getDocs(collection(firestore, 'users'));
            const results = [];
            for (const userDoc of usersSnap.docs) {
                const uId = userDoc.id;
                const scansSnap = await getDocs(
                    collection(firestore, 'users', uId, 'scans')
                );
                let totalDelay = 0;
                let count = 0;
                scansSnap.forEach(scan => {
                    const d = scan.data();
                    if (d.collectionTime && d.cycleEnd) {
                        totalDelay += new Date(d.collectionTime).getTime() - new Date(d.cycleEnd).getTime();
                        count++;
                    }
                });
                if (count > 0) {
                    results.push({
                        name: userDoc.data().studentName || userDoc.data().email,
                        avgDelay: totalDelay / count / 1000,
                    });
                }
            }
            results.sort((a, b) => a.avgDelay - b.avgDelay);
            setLeaderboard(results.slice(0, 50));

            // Load stats
            const scans = await getDocs(
                collection(firestore, 'users', user.uid, 'scans')
            );
            let sumDelay = 0;
            scans.forEach(scan => {
                const d = scan.data();
                if (d.collectionTime && d.cycleEnd) {
                    sumDelay += new Date(d.collectionTime).getTime() - new Date(d.cycleEnd).getTime();
                }
            });
            const totalCount = scans.size;
            setStats({
                totalWash: totalCount,
                avgWait: totalCount > 0 ? sumDelay / totalCount / 1000 : 0,
            });
        };
        loadData();
    }, []);

    const handleLogout = async () => {
        await signOut(getAuth());
        router.replace('/');
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
                <TouchableOpacity
                    style={styles.statsButton}
                    onPress={() => setShowStats(v => !v)}
                >
                    <Text style={styles.statsButtonText}>Statistics</Text>
                </TouchableOpacity>
                {showStats && (
                    <View style={styles.statsDropdown}>
                        <Text style={styles.statText}>Total Washes: {stats.totalWash}</Text>
                        <Text style={styles.statText}>Average Wait: {stats.avgWait.toFixed(1)}s</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.studentId}>{studentId}</Text>
            </View>

            <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <Text style={styles.subtitle}>for washing machine hoggers 😡</Text>
                <ScrollView style={styles.scrollArea}>
                    {leaderboard.map((entry, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.rankCard,
                                { backgroundColor: idx === 0 ? '#FF0000' : idx === 1 ? '#FF5A5A' : idx === 2 ? '#FF8888' : '#D3D3D3' },
                            ]}
                        >
                            <Text style={styles.rankText}>#{idx + 1} {entry.name} - {entry.avgDelay.toFixed(1)}s</Text>
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
    container: { flex: 1, alignItems: 'center', backgroundColor: '#fff' },
    headerWrapper: { width: '100%', alignItems: 'center', position: 'relative' },
    checkers: { width: '100%', height: 180 },
    pfp: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff', backgroundColor: '#fff', position: 'absolute', bottom: -50, zIndex: 1 },
    statsButton: { position: 'absolute', top: 40, right: 20, padding: 8, backgroundColor: '#1C3A7C', borderRadius: 6, zIndex: 2 },
    statsButtonText: { color: '#fff', fontWeight: '500' },
    statsDropdown: { position: 'absolute', top: 80, right: 20, width: 160, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, zIndex: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
    statText: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
    infoBox: { marginTop: 60, alignItems: 'center' },
    username: { fontSize: 20, fontWeight: '500' },
    studentId: { marginTop: 5, fontSize: 15, fontWeight: '500', color: '#666' },
    leaderboardContainer: { marginTop: 40, width: '85%', borderWidth: 1, borderColor: '#000', borderRadius: 12, padding: 15, alignItems: 'flex-start', maxHeight: 400 },
    leaderboardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { color: '#555', marginBottom: 15 },
    scrollArea: { width: '100%' },
    rankCard: { width: '100%', padding: 10, borderRadius: 8, marginBottom: 10 },
    rankText: { color: '#fff', fontWeight: 'bold' },
    logoutButton: { marginTop: 30, padding: 12, backgroundColor: '#1C3A7C', borderRadius: 10, position: 'absolute', bottom: 30, width: '60%', alignItems: 'center' },
    logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
