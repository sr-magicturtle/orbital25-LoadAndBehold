import { router } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !name || !studentId) {
            return Alert.alert('Missing fields', 'Please fill in all details.');
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, 'users', uid), {
                email,
                studentName: name,
                studentId,
                createdAt: serverTimestamp(),
            });

            Alert.alert('Success', 'Account created!');
            router.replace('/login');
        } catch (err) {
            console.error(err);
            Alert.alert('Registration Error', err.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={60}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Create Visitor Account</Text>

                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Jane Doe"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.label}>Student/Visitor ID</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. A0123456Z"
                    placeholderTextColor="#888"
                    value={studentId}
                    onChangeText={setStudentId}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. you@example.com"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginLink}>
                    <Text style={styles.loginText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        padding: 30,
        backgroundColor: '#F4F9FF',
        justifyContent: 'center',
        flexGrow: 1,
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: '#1C3A7C',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 25,
        textAlign: 'center',
        color: '#1C3A7C',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 15,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 12,
        fontSize: 16,
    },
    registerButton: {
        backgroundColor: '#1C3A7C',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#1C3A7C',
    },
});
