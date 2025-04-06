import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Map, { NavigationControl, Marker, MapEvent } from 'react-map-gl/dist/mapbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function MapScreen() {
  // State to store the markers
  const [markers, setMarkers] = useState<{ id: string; coordinate: [number, number]; text: string }[]>([]);
  const [editingMarker, setEditingMarker] = useState<string | null>(null); // To track which marker is being edited

  // Handle map click event
  const handleMapClick = (event: any) => {
      // Access coordinates from event.lngLat
      // If a marker is being edited, prevent adding a new one

      const { lng: longitude, lat: latitude } = event.lngLat;

    // Ensure longitude and latitude are valid numbers
    if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
      console.error("Invalid coordinates:", longitude, latitude);
      return; // Prevent adding a marker if coordinates are invalid
    }

    // Add a new marker to the state
    setMarkers((prevMarkers) => [
      ...prevMarkers,
      {
        id: `${longitude}-${latitude}`,
        coordinate: [longitude, latitude],
        text: '', // Initialize the marker with an empty text field
      },
    ]);
  };
   // Handle text change for a marker
   const handleTextChange = (id: string, text: string) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, text } : marker
      )
    );
  };

  // Handle marker click (start editing)
  const handleMarkerClick = (id: string) => {
    setEditingMarker(id);
  };
  // Handle blur (stop editing)
  const handleBlur = () => {
    setEditingMarker(null);
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
        onClick={handleMapClick} // Attach onClick even
      >
        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
          key={marker.id}
          longitude={marker.coordinate[0]}
          latitude={marker.coordinate[1]}
          onClick={() => handleMarkerClick(marker.id)}
        >
          <View style={styles.markerContainer}>
            {/* Use Ionicons as the custom marker */}
            <Ionicons name="location-sharp" size={30} color="red" />
            {/* Conditionally render TextInput if editing the marker */}
            {editingMarker === marker.id && (
              <TextInput
                style={styles.textInput}
                value={marker.text}
                onChangeText={(text) => handleTextChange(marker.id, text)}
                onBlur={handleBlur}
                placeholder="Enter text"
              />
            )}
            {/* Display text if not editing */}
            {editingMarker !== marker.id && marker.text !== '' && (
              <View style={styles.textContainer}>
                <Text style={styles.text}>{marker.text}</Text>
              </View>
            )}
          </View>
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
  },
  textInput: {
    position: 'absolute',
    top: 35, // Adjust the position to be above the marker
    left: -15, // Adjust the position to center it
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    width: 70, // Fixed width
    textAlign: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 35, // Adjust the position to be above the marker
    left: -15, // Adjust the position to center it
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});
