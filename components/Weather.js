import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

const Weather = ({ forecast }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.hour}>{forecast.hour}:00</Text>
      <ShowIcon icon={forecast.icon} size={30} />
      <Text style={styles.temp}>{Math.round(forecast.temp)}°C</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Arrière-plan blanc
    borderRadius: 8, // Coins arrondis
    width: 60,
  },
  hour: {
    fontSize: 14,
    color: '#333',
  },
  temp: {
    fontSize: 14,
    color: '#333',
  },
});

export default Weather;
