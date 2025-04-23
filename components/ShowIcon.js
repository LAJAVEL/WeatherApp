import React from 'react';
import { Image, StyleSheet } from 'react-native';

const ShowIcon = ({ icon, resolution = '2x', size = 50 }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@${resolution}.png`;

  return (
    <Image
      source={{ uri: iconUrl }}
      style={[styles.icon, { width: size, height: size }]}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});

export default ShowIcon;
