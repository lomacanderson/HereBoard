import React = require('react');
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoibG9nYW5hbmRlcnNvbiIsImEiOiJjbTkzaWV0bGowbnRhMmlwcTZ0Z2o3MWxuIn0.tDgesYhh3uoP2LFnGhkqMg');
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('Mapbox')

export default function MapScreen() {
  return (
    <View style={styles.container}>
        <MapboxGL.MapView 
        style={styles.map} 
        zoomEnabled={true}
        styleURL='mapbox://styles/logananderson/cm93ihuug003401sz8l0obh60'
        rotateEnabled={true}
        >
        <MapboxGL.Camera
        zoomLevel={15}
        centerCoordinate={[10.181667, 36.806389]}
        pitch={60}
        animationMode='flyTo'
        animationDuration={6000}
        />
        <MapboxGL.PointAnnotation
        id="marker"
        coordinate={[10.181667, 36.806389]}
        >
          <View/>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  map: {
    flex: 1
  }
});