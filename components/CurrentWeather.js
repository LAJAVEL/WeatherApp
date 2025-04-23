import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShowIcon from './ShowIcon';

const CurrentWeather = ({ data }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (data && data.list && data.list.length > 0) {
      const current = data.list[0];
      const date = new Date(current.dt_txt);
      setWeatherData({
        city: data.city.name,
        day: date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }),
        temp: Math.round(current.main.temp),
        icon: current.weather[0].icon,
        description: current.weather[0].description,
      });
    }
  }, [data]);

  if (!weatherData) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weatherData.city}</Text>
      <Text style={styles.day}>{weatherData.day}</Text>
      <ShowIcon icon={weatherData.icon} size={80} />
      <Text style={styles.temp}>{weatherData.temp}°C</Text>
      <Text style={styles.description}>{weatherData.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  day: {
    fontSize: 16,
    color: '#333',
  },
  temp: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default CurrentWeather;
