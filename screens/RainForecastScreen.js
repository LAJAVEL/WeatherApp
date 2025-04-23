import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { UrlTile } from 'react-native-maps';

const RainForecastScreen = () => {
  const tileUrl =
    'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=d6def4924ad5f9a9b59f3ae895b234cb';

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.2276, // Centre de la France
          longitude: 2.2137,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
      >
        <UrlTile urlTemplate={tileUrl} zIndex={1} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default RainForecastScreen;
