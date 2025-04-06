import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const API = 'http://localhost:3000';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API}/user/${id}`);
        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.error('Error:', data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>User not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.username}'s Profile</Text>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.joined}>Joined: {new Date(user.created_at).toLocaleDateString()}</Text>
      {/* Add map pins, followers, activity, etc here later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 18, marginBottom: 5 },
  joined: { fontSize: 16, color: 'gray' },
  error: { fontSize: 20, color: 'red' },
});