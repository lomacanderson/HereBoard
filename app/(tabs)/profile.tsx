import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API = 'http://localhost:3000';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };


  useEffect(() => {
    const loadUserData = async () => {
      const stored = await AsyncStorage.getItem('user');
      if (!stored) {
        console.warn('No user found in AsyncStorage');
        return;
      }
    
      let parsed;
      try {
        parsed = JSON.parse(stored);
      } catch (err) {
        console.error('Invalid JSON in AsyncStorage "user":', stored);
        return;
      }


      setUser(parsed);
    
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`${API}/users/${parsed.id}/followers`),
          fetch(`${API}/users/${parsed.id}/following`)
        ]);
    
        const followersData = await followersRes.json();
        const followingData = await followingRes.json();
    
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (err) {
        console.error('Error fetching followers/following:', err);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Image
            source={{ uri: user.profile_picture || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{user.username}</Text>

          <View style={styles.countRow}>
            <TouchableOpacity onPress={() => setShowFollowers(true)}>
              <Text style={styles.count}>{followers.length} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFollowing(true)}>
              <Text style={styles.count}>{following.length} Following</Text>
            </TouchableOpacity>
          </View>

          {/* Followers Modal */}
          <Modal visible={showFollowers} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Followers</Text>
              <FlatList
                data={followers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.modalItem}>{item.username}</Text>}
              />
              <TouchableOpacity onPress={() => setShowFollowers(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Following Modal */}
          <Modal visible={showFollowing} animationType="slide">
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Following</Text>
              <FlatList
                data={following}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.modalItem}>{item.username}</Text>}
              />
              <TouchableOpacity onPress={() => setShowFollowing(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}

      {/* Just padding */}
      <Text style={styles.username}></Text>

      <Text style={styles.username}>User's MAP</Text>

      <Text style={styles.username}>User's Activity (comments/likes) in list view</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 80 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  countRow: { flexDirection: 'row', gap: 20 },
  count: { fontSize: 18, color: '#007AFF', marginHorizontal: 10 },
  modalContainer: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  modalItem: { fontSize: 18, paddingVertical: 10 },
  closeButton: { fontSize: 18, color: 'blue', textAlign: 'center', marginTop: 20 },
  logoutButton: { backgroundColor: '#FF3B30', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 20 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});