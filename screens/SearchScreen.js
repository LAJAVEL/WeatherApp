import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForecastWeather from '../components/ForecastWeather';
import SearchHistory from '../components/SearchHistory';
import backgroundImage from '../assets/background.jpg';

const SearchScreen = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [searches, setSearches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = async () => {
    try {
      const savedSearches = await AsyncStorage.getItem('searches');
      if (savedSearches) {
        setSearches(JSON.parse(savedSearches));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des recherches', err);
    }
  };

  const saveSearch = async (newCity) => {
    try {
      const updatedSearches = [
        newCity,
        ...searches.filter((c) => c !== newCity),
      ].slice(0, 5);
      await AsyncStorage.setItem('searches', JSON.stringify(updatedSearches));
      setSearches(updatedSearches);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des recherches', err);
    }
  };

  const handleSearch = async () => {
    try {
      setError(null);
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city},fr&limit=1&appid=d6def4924ad5f9a9b59f3ae895b234cb`
      );
      if (geoResponse.data.length === 0) {
        setError('Ville non trouvée');
        return;
      }

      const { lat, lon } = geoResponse.data[0];
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=d6def4924ad5f9a9b59f3ae895b234cb`
      );
      setWeatherData(weatherResponse.data);
      saveSearch(city);
      setCity('');
    } catch (err) {
      setError('Erreur lors de la récupération des données');
    }
  };

  const handleHistorySearch = async (selectedCity) => {
    setCity(selectedCity);
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${selectedCity},fr&limit=1&appid=d6def4924ad5f9a9b59f3ae895b234cb`
      );
      if (geoResponse.data.length === 0) {
        setError('Ville non trouvée');
        return;
      }

      const { lat, lon } = geoResponse.data[0];
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&lang=fr&units=metric&appid=d6def4924ad5f9a9b59f3ae895b234cb`
      );
      setWeatherData(weatherResponse.data);
      saveSearch(selectedCity);
    } catch (err) {
      setError('Erreur lors de la récupération des données');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Entrez une ville"
          value={city}
          onChangeText={setCity}
        />
        <Button title="Rechercher" onPress={handleSearch} />
        {error && <Text style={styles.error}>{error}</Text>}
        <SearchHistory searches={searches} onSelect={handleHistorySearch} />
        {weatherData && <ForecastWeather data={weatherData} />}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
});

export default SearchScreen;
