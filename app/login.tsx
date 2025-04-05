import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
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
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>

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

      <Button title={isSignUp ? 'Sign Up' : 'Log In'} onPress={handleAuth} />

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
  container: { padding: 20, marginTop: 100 },
  input: { borderBottomWidth: 1, marginBottom: 20, padding: 10 },
  switch: { marginTop: 20, textAlign: 'center', color: 'blue' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});
