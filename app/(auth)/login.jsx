import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import app from '../../firebaseConfig';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /*
  async function registerAndLogin() {
    setLoading(true);
    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      Alert.alert('Success', response.user.uid);
      return;
    } catch (error) {
      setLoading(false);
      Alert.alert('Ooops', 'something went wrong');
    }
  }
  */

  async function login() {
    setLoading(true);
    try {
      const auth = getAuth(app);
      const response = await signInWithEmailAndPassword(auth, email, password);
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
