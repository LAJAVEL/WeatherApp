import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Weather from './Weather';

const ForecastWeather = ({ data }) => {
  const [forecastsGrouped, setForecastsGrouped] = useState([]);

  useEffect(() => {
    if (data && data.list) {
      // Construire les données des prévisions
      const forecastsData = data.list.map((forecast) => {
        const forecastDate = new Date(forecast.dt_txt);
        return {
          date: forecastDate,
          hour: forecastDate.getHours(),
          day: forecastDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }),
          temp: forecast.main.temp,
          icon: forecast.weather[0].icon,
        };
      });

      // Regrouper par jour
      const daysGrouped = forecastsData
        .map((forecast) => forecast.day)
        .filter((day, index, array) => array.indexOf(day) === index);

      const grouped = daysGrouped.map((day) => {
        const forecasts = forecastsData.filter(
          (forecast) => forecast.day === day
        );
        return {
          day: day === forecastsData[0].day ? 'Aujourd’hui' : day,
          data: forecasts,
        };
      });

      setForecastsGrouped(grouped);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {forecastsGrouped.map((group, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{group.day}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {group.data.map((forecast, idx) => (
              <Weather key={idx} forecast={forecast} />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  dayContainer: {
    marginVertical: 5, // Réduit pour plus de compacité
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Arrière-plan blanc semi-transparent
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
});

export default ForecastWeather;
