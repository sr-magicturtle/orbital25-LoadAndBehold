import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const leaderboard = Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    name: 'XXX',
    color:
        i === 0 ? '#FF0000'
            : i === 1 ? '#FF5A5A'
                : i === 2 ? '#FF8888'
                    : i === 3 ? '#FFBBBB'
                        : '#D3D3D3',
}));

const Profile = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');

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
                } else {
                    console.log('No such document!');
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Checkered background + profile picture */}
            <View style={styles.headerWrapper}>
                <ImageBackground
                    source={require('../../assets/images/checkers.png')}
                    style={styles.checkers}
                    resizeMode="cover"
                />
                <Image source={require('../../assets/portrait.jpg')} style={styles.pfp} />
            </View>

            {/* Name + ID */}
            <View style={styles.infoBox}>
                <Text style={styles.username}>{name}</Text>
                <Text style={styles.studentId}>{studentId}</Text>
            </View>

            {/* Leaderboard */}
            <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <Text style={styles.subtitle}>for washing machine hoggers 😡</Text>

                <ScrollView style={styles.scrollArea}>
                    {leaderboard.map((entry, index) => (
                        <View
                            key={index}
                            style={[styles.rankCard, { backgroundColor: entry.color }]}
                        >
                            <Text style={styles.rankText}>#{entry.rank} {entry.name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
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
        marginTop: 60, // push name + ID below the profile picture
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
});
