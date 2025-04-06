import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import React = require('react');

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.feed}>
        <Text style={styles.text}>Activity</Text>
        <Text>Hello</Text>
      </View>
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
  feed: {
    padding: 20,
    margin: 10,
    width: '90%',
    borderRadius: 10,
    color: 'green',
    flex: 1,
    backgroundColor: '#DBF0FF',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'Black',
    borderBottomWidth: 2,
    paddingBottom: 10,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
