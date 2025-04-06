import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React = require('react');

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Friends</Text>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: 'red',
    },
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: '#fff',
    },
  });