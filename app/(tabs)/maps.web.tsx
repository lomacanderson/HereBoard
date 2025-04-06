import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Map, { NavigationControl, Marker } from 'react-map-gl/dist/mapbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function MapScreen() {
  // State to store the markers
  const staticMarkers = [
    {
      id: '1',
      coordinate: [-123, 44],
      name: 'Corvallis',
      description: 'A major city in the United States.',
      url: 'https://www.nyc.gov/',
    },
  ];

  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  // Handle marker click event
  const handleMarkerClick = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
  };

  return (
    <View style={{ flex: 1 }}>
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 12,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/logananderson/cm93ihuug003401sz8l0obh60"
      >
        {staticMarkers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.coordinate[0]}
            latitude={marker.coordinate[1]}
          >
            <TouchableOpacity
              onPress={() => handleMarkerClick(marker.url)} 
              onMouseEnter={() => setHoveredMarker(marker.id)} 
              onMouseLeave={() => setHoveredMarker(null)} 
              style={[
                styles.markerContainer,
                hoveredMarker === marker.id ? styles.markerHover : {},
              ]}
            >
              <Ionicons name="location-sharp" size={30} color="red" />
              <View style={styles.markerInfo}>
                <Text style={styles.markerName}>{marker.name}</Text>
                <Text style={styles.markerDescription}>{marker.description}</Text>
              </View>
            </TouchableOpacity>
          </Marker>
        ))}
        <NavigationControl position="top-left" />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerHover: {
    transform: [{ scale: 1.5 }], 
  },
  markerInfo: {
    position: 'absolute',
    top: 35, 
    left: -25, 
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    width: 100, 
    textAlign: 'center',
  },
  markerName: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  markerDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});
