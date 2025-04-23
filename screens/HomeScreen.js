import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import CurrentWeather from '../components/CurrentWeather';
import backgroundImage from '../assets/background.jpg';

const HomeScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Accès à la localisation refusé');
          return;
        }

        let position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=fr&units=metric&appid=d6def4924ad5f9a9b59f3ae895b234cb`
        );
        setWeatherData(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des données');
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <CurrentWeather data={weatherData} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  error: {
    color: 'red',
    fontSize: 18,
  },
});

export default HomeScreen;
