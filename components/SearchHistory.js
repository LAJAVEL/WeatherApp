import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SearchHistory = ({ searches, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dernières recherches</Text>
      <FlatList
        data={searches}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <Text style={styles.searchItem}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  searchItem: {
    fontSize: 16,
    color: '#fff',
    padding: 5,
  },
});

export default SearchHistory;
