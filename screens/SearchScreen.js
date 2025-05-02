import React, { useState, useEffect } from 'react';
import {
  FlatList,
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
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
  const [suggestions, setSuggestions] = useState([]); // État pour les suggestions

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
      const updatedSearches = [newCity, ...searches.filter((c) => c !== newCity)].slice(0, 5);
      await AsyncStorage.setItem('searches', JSON.stringify(updatedSearches));
      setSearches(updatedSearches);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des recherches', err);
    }
  };

  const handleSearch = async () => {
    try {
      setError(null);
      setSuggestions([]); // Efface les suggestions après la recherche
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
    setSuggestions([]); // Efface les suggestions
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

  // Fonction pour récupérer les suggestions de villes
  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=d6def4924ad5f9a9b59f3ae895b234cb`
      );
      const cities = response.data.map((city) => ({
        name: city.name,
        country: city.country,
      }));
      setSuggestions(cities);
    } catch (err) {
      console.error('Erreur lors de la récupération des suggestions', err);
      setSuggestions([]);
    }
  };

  // Gérer les changements dans le champ de texte
  const handleCityChange = (text) => {
    setCity(text);
    fetchSuggestions(text);
  };

  // Gérer la sélection d'une suggestion
  const handleSuggestionSelect = (cityName) => {
    setCity(cityName);
    setSuggestions([]); // Efface les suggestions après la sélection
  };

  const data = [
    { type: 'input' },
    { type: 'suggestions' }, // Ajouté pour les suggestions
    { type: 'error' },
    { type: 'history' },
    { type: 'forecast' },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'input':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Entrez une ville"
              value={city}
              onChangeText={handleCityChange} // Modifié pour gérer les suggestions
            />
            <Button title="Rechercher" onPress={handleSearch} />
          </View>
        );
      case 'suggestions':
        return suggestions.length > 0 ? (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSuggestionSelect(item.name)}>
                  <Text style={styles.suggestionItem}>{`${item.name}, ${item.country}`}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null;
      case 'error':
        return error ? <Text style={styles.error}>{error}</Text> : null;
      case 'history':
        return <SearchHistory searches={searches} onSelect={handleHistorySearch} />;
      case 'forecast':
        return weatherData ? <ForecastWeather data={weatherData} /> : null;
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.type + index}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  error: {
    color: 'red',
    marginVertical: 10,
  },
  suggestionsContainer: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    marginBottom: 10,
    maxHeight: 150, // Limite la hauteur pour éviter que la liste soit trop longue
  },
  suggestionItem: {
    padding: 10,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default SearchScreen;