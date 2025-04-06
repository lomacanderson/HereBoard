import { Tabs, Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React = require('react');
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem('user');
      setIsLoggedIn(!!user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/maps');
    }
  }, [isLoggedIn, segments]);

  if (loading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'Black',
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'list-sharp' : 'list-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'planet-sharp' : 'planet-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'people-sharp' : 'people-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}