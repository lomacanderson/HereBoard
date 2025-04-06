import React from 'react';
import { View, Text } from 'react-native';
import Map, { NavigationControl } from 'react-map-gl/dist/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg';

export default function MapScreen() {
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
        <NavigationControl position="top-left" />
      </Map>
    </View>
  );
}
