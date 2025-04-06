import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React = require('react');

export default function RootLayout() {
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      
    </Stack>
  );
}