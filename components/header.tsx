import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { getAuth } from 'firebase/auth'; // get current auth-ed user 
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // read from firestore  

export default function Header() {
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        const fetchName = async () => {
            const auth = getAuth(); 
            const firestore = getFirestore(); 
            const user = auth.currentUser;

            if (user) {
                const uid = user.uid;
                const userDocRef = doc(firestore, 'users', uid); // path: users/{uid}
                const userSnapshot = await getDoc(userDocRef);

                if (userSnapshot.exists()) {
                    const userData = userSnapshot.data();
                    setStudentName(userData.studentName); // get studentName from firestore
                    setStudentId(userData.studentId);
                } else {
                    console.log('User document not found.');
                }
            }
        };

        fetchName(); 
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.studentId}>{studentId}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E9F5FF",
        height: 135,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
    studentName: {
        fontSize: 20,
        fontWeight: 500,
    },
    studentId: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: 500,
        color:"#666"
    },
})
