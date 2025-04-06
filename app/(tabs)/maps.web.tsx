import React, {useState} from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Map, { NavigationControl, Marker, MapEvent } from 'react-map-gl/dist/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function MapScreen() {
  // State to store the markers
  const [markers, setMarkers] = useState<{ id: string; coordinate: [number, number] }[]>([]);
  const [editingMarker, setEditingMarker] = useState<string | null>(null); // To track which marker is being edited

  // Handle map click event
  const handleMapClick = (event: any) => {
      // Access coordinates from event.lngLat
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
          >
            <View style={styles.marker}></View> {/* Render a custom marker */}
          </Marker>
        ))}
        <NavigationControl position="top-left" />
      </Map>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    height: 15,
    width: 10,
    backgroundColor: 'red',
    borderRadius: 15,
  },
});
