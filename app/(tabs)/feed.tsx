import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = 'http://localhost:3000';

export default function Index() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Load current user ID once
  useEffect(() => {
    AsyncStorage.getItem('user').then(stored => {
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUserId(parsed.id);
      }
    });
  }, []);

  // Search users from backend
  const handleSearch = async (text: string) => {
    setSearch(text);
  
    if (text.length < 2 || !currentUserId) {
      setResults([]);
      return;
    }
  
    try {
      const res = await fetch(`${API}/users/search?query=${text}&currentUserId=${currentUserId}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // toggle a user
  const toggleFollow = async (userId: string, currentlyFollowing: boolean) => {
    try {
      const endpoint = currentlyFollowing ? '/unfollow' : '/follow';
  
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          follower_id: currentUserId,
          followed_id: userId,
        }),
      });
  
      if (!res.ok) throw new Error('Toggle follow failed');
  
      // Refresh the search list
      handleSearch(search);
    } catch (error) {
      console.error('Toggle follow error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.feed}>
        <Text style={styles.text}>Activity</Text>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={search}
          onChangeText={handleSearch}
        />

        {/* Render search results */}
        {results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.resultItem}>
                <Link href={`/user/${item.id}`}>
                  <Text style={[styles.resultText, { color: 'blue' }]}>
                    {item.username}
                  </Text>
                </Link>
                <TouchableOpacity onPress={() => toggleFollow(item.id, item.isFollowing)}>
                  <Text style={styles.followButton}>
                    {item.isFollowing ? 'Unfollow' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Example content */}
        <Link href="/login" style={styles.feedBox}>
          Friend Example
        </Link>
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
  feedBox: {
    padding: 20,
    margin: 10,
    width: '70%',
    height: '20%',
    borderRadius: 15,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feed: {
    padding: 20,
    margin: 10,
    width: '90%',
    borderRadius: 10,
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    fontSize: 18,
  },
  followButton: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
