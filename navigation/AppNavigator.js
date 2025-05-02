import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faCloudRain,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import HomeScreen from '../screens/HomeScreen';
import RainForecastScreen from '../screens/RainForecastScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Définition du Tab Navigator pour la barre de navigation en bas
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Accueil') icon = faHome;
          else if (route.name === 'Pluie') icon = faCloudRain;
          else if (route.name === 'Recherche') icon = faSearch;
          return <FontAwesomeIcon icon={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Pluie" component={RainForecastScreen} />
      <Tab.Screen name="Recherche" component={SearchScreen} />
    </Tab.Navigator>
  );
};

// Définition du Drawer Navigator pour le menu burger
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Accueil" component={TabNavigator} />
        <Drawer.Screen name="Pluie" component={RainForecastScreen} />
        <Drawer.Screen name="Recherche" component={SearchScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;