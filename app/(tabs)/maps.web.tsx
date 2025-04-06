import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Map, { NavigationControl, Marker } from 'react-map-gl';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function MapScreen() {
  // State to store the markers
  const staticMarkers = [
    {
      id: '1',
      coordinate: [-123.2786, 44.5647],
      name: 'Memorial Union',
      description: 'Bob H.        John L.',
      url: 'https://maps.app.goo.gl/X9AWC1bK6ForoVjx7',
    },
    {
      id: '2',
      coordinate: [-123.2767, 44.5650],
      name: 'Valley Library',
      description: 'Ethan O.',
      url: 'https://maps.app.goo.gl/sw8XSMnTmir5AoDQ6',
    },
    {
      id: '3',
      coordinate: [-123.2808, 44.5632],
      name: 'Dixon Recreation Center',
      description: 'Maria C.      Dylan K.',
      url: 'https://maps.app.goo.gl/cX34SQYe6D9mJtCw7',
    },
    {
      id: '4',
      coordinate: [-123.2796, 44.5658],
      name: 'Kelly Engineering Center',
      description: 'AJ P.       Bella U.',
      url: 'https://maps.app.goo.gl/AbLGkmML4WLNwmnw7',
    },
    {
      id: '5',
      coordinate: [-123.2813, 44.5658],
      name: 'Weatherford Hall',
      description: 'Trinity A.     Sophia M.',
      url: 'https://maps.app.goo.gl/wmPNRyu6K3bKdsjZ8',
    },
    {
      id: '6',
      coordinate: [-123.2816, 44.5594],
      name: 'Reser Stadium',
      description: 'Hunter S. ',
      url: 'https://maps.app.goo.gl/9a43jMgoW1osDabQ6',
    },
    {
      id: '7',
      coordinate: [-123.2738, 44.5635],
      name: 'International Living–Learning',
      description: 'Logan A.',
      url: 'https://maps.app.goo.gl/4i4CCCYqLSMMihsV6',
    },
    {
      id: '8',
      coordinate: [-123.2781, 44.5649],
      name: 'MU Quad Lawn',
      description: 'Emily R.',
      url: 'https://maps.app.goo.gl/iUxuiyqV6RPMD7P9A',
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
          longitude: -123.2781,
          latitude: 44.5649,
          zoom: 15,
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
    fontSize: 10,
    textAlign: 'center',
  },
  markerDescription: {
    fontSize: 8,
    textAlign: 'center',
  },
});
