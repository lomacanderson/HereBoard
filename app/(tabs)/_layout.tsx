import { Stack } from 'expo-router';
import React = require('react');

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="maps" options={{ title: 'About' }} />
    </Stack>
  );
}
