import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API = 'http://localhost:3000';

export default function LandingScreen() {
  // Local state for determining if user is signing up or logging in
  const [isSignUp, setIsSignUp] = useState(true);
  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  // For displaying any error that occurs during form submission
  const [formError, setFormError] = useState('');

  // Function to handle sign up or login based on current mode
  const handleAuth = async () => {
    // Choose endpoint and payload based on auth mode
    const endpoint = isSignUp ? '/signup' : '/login';
    const payload = isSignUp
      ? { username, email, password } // Sign up requires username
      : { email, password }; // Login requires only email and password

    // Make API call to backend
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    // If server responds with an error, display it
    if (!res.ok) {
      setFormError(data.error || 'Something went wrong');
      return;
    }

    // If login/signup is successful and user ID is returned, store user in AsyncStorage
    if (data?.id) {
      await AsyncStorage.setItem('user', JSON.stringify(data));
    }

    // Redirect user to the maps screen
    router.replace('/maps');
  };

  return (
    <View style={styles.container}>
      {/* App name */}
      <Text style={styles.title}>SpotShare</Text>
      {/* Dynamic subtitle */}
      <Text style={styles.subtitle}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>

      {/* Username input only appears for Sign Up */}
      {isSignUp && (
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      )}

      {/* Email input */}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      {/* Password input */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {/* Show form error message if exists */}
      {formError.length > 0 && <Text style={styles.error}>{formError}</Text>}

      {/* Submit button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAuth}>
        <Text style={styles.submitText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
      </TouchableOpacity>

      {/* Toggle between Sign Up and Log In modes */}
      <Text
        style={styles.switch}
        onPress={() => {
          setIsSignUp(!isSignUp);
          setFormError(''); // Clear error when switching modes
        }}
      >
        {isSignUp ? 'Already have an account? Log In' : 'New here? Sign Up'}
      </Text>
    </View>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: { backgroundColor: '#a6daff', padding: 20, height: '100%', paddingTop: 100 },
  input: {
    alignSelf: 'center',
    fontStyle: 'italic',
    width: 300,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  switch: { marginTop: 20, textAlign: 'center', color: 'blue' },
  title: { color: 'black', fontSize: 65, textAlign: 'center', marginBottom: 80 },
  subtitle: { color: 'black', fontSize: 23, textAlign: 'center', marginBottom: 25 },
  submitButton: {
    alignSelf: 'center',
    backgroundColor: '#101411',
    width: 300,
    borderRadius: 25,
    marginBottom: 20,
    padding: 10,
  },
  submitText: { alignSelf: 'center', color: 'white', fontWeight: 'bold' },
  error: { color: 'maroon', textAlign: 'center', marginBottom: 10 },
});