import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const db = getFirestore(app);

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createUserDocIfNeeded = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        createdAt: new Date().toISOString(),
      });
      console.log('User document created!');
    }
  };


  async function login() {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const response = await signInWithEmailAndPassword(auth, email, password);

      // create user doc in firestore if it doesnt exist
      await createUserDocIfNeeded(response.user);

      setLoading(false);
      Alert.alert('Success', `Welcome back, ${response.user.email}`);
      router.replace('../(dashboard)/homepage');
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail}
      />
      
      <TextInput 
        style={[styles.input, { marginTop: 15 }]} 
        placeholder="Password" 
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={login}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color="white" 
            animating={loading} 
          />
        ) : (
          <Text style={{ color: 'white' }}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default Login;
