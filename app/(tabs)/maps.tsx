import React = require('react');
import { Button, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function MapScreen() {

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map Screen</Text>
      <Button title="Log out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});