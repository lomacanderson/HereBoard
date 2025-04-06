import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import Map, { NavigationControl } from 'react-map-gl/dist/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const API = 'http://localhost:3000';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function Profile() {
  // State variables for user, followers, following, modals and loading status
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logs out the user by clearing async storage and redirecting to login
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  // Loads user data and their followers/following from AsyncStorage and API
  useEffect(() => {
    const loadUserData = async () => {
      console.log('[loadUserData] Running...');

      // Get stored user info
      const stored = await AsyncStorage.getItem('user');
      console.log('[AsyncStorage] stored:', stored);

      // If not found, show warning and stop loading
      if (!stored) {
        console.warn('[AsyncStorage] No user found');
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(stored); // Parse stored user JSON
      setUser(parsed); // Set user state

      try {
        // Fetch followers and following lists in parallel
        const [followersRes, followingRes] = await Promise.all([
          fetch(`${API}/users/${parsed.id}/followers`),
          fetch(`${API}/users/${parsed.id}/following`)
        ]);

        console.log('[Fetch] followersRes:', followersRes.status);
        console.log('[Fetch] followingRes:', followingRes.status);

        // Parse the results as JSON
        const followersData = await followersRes.json();
        const followingData = await followingRes.json();

        // Update states with fetched data
        setFollowers(followersData);
        setFollowing(followingData);
      } catch (err) {
        console.error('[Fetch Error]', err);
      }

      console.log('[loadUserData] Finished');
      setLoading(false); // End loading
    };

    loadUserData(); // Trigger the load function
  }, []);

  // Display loading state if data hasn't finished loading
  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.username}>Loading...</Text>
      </View>
    );
  } else {
    // Main render once loading is complete and user data is available
    return (
      <View style={styles.container}>
        <>
          {/* Profile picture */}
          <Image
            source={{ uri: user.profile_picture || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          {/* Username */}
          <Text style={styles.username}>{user.username}</Text>

          {/* Followers and Following counts */}
          <View style={styles.countRow}>
            <TouchableOpacity onPress={() => setShowFollowers(true)}>
              <Text style={styles.count}>{followers.length} Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowFollowing(true)}>
              <Text style={styles.count}>{following.length} Following</Text>
            </TouchableOpacity>
          </View>

          {/* Followers modal */}
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

          {/* Following modal */}
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

        {/* Padding & placeholder content */}
        <Text style={styles.username}></Text>
        <Text style={styles.username}>user's MAP</Text>
        <Text style={styles.username}>users's Activity (comments/likes) in list view</Text>

         <View style={{ flex: 1, width: '50%', height: '50%' }}>
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                  longitude: -122.4,
                  latitude: 37.8,
                  zoom: 12,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
              >
                <NavigationControl position="top-left" />
              </Map>
            </View>
            
        {/* Logout button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Styles for the component
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