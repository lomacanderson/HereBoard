import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API = 'http://localhost:3000';

export default function LandingScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleAuth = async () => {
    const endpoint = isSignUp ? '/signup' : '/login';
    const payload = isSignUp ? { username, email, password } : { email, password };

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Something went wrong');
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      router.replace('/maps');
    } catch (err) {
      console.error(err);
      setFormError('Server error. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SpotShare</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>

      {isSignUp && (
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      )} 

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {formError.length > 0 && <Text style={styles.error}>{formError}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
        <Text style={styles.submitText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
      </TouchableOpacity>


      <Text style={styles.switch} onPress={() => {
        setIsSignUp(!isSignUp);
        setFormError(''); // clear error when switching modes
      }}>
        {isSignUp ? 'Already have an account? Log In' : 'New here? Sign Up'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor : '#a6daff', padding: 20, height : '100%', paddingTop : 180},
  input: { alignSelf : 'center', fontStyle : 'italic', width : 300, borderRadius: 25, borderWidth: 1, marginBottom: 20, padding: 10 },
  switch: { marginTop: 20, textAlign: 'center', color: 'blue' },
  title: { color: 'black', fontSize: 65, textAlign: 'center', marginBottom: 80, },
  subtitle: {color: 'black', fontSize: 23, textAlign: 'center', marginBottom: 25,},
  submitButton: {alignSelf : 'center', backgroundColor: '#101411', width : 300, borderRadius: 25, marginBottom: 20, padding: 10},
  submitText: {alignSelf : 'center', color : 'white', fontWeight : 'bold'},
  error: { color: 'maroon', textAlign: 'center', marginBottom: 10 },
});
