import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '@/app/(tabs)/home';
import Cart from '@/app/(tabs)/cart';
import Pie from '@/app/(tabs)/pie';
import Profile from '@/app/(tabs)/profile';

import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'Home') {
              icon = require('@/assets/icons/home.png');
            } else if (route.name === 'Profile') {
              icon = require('@/assets/icons/profile.png');
            } else if (route.name === 'Cart') {
              icon = require('@/assets/icons/cart.png');
            }
            return <Image source={icon} style={{ width: 24, height: 24, tintColor: focused ? '#FFC43D' : '#888' }} />;
          },
          tabBarStyle: { backgroundColor: '#FFF', height: 60 },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Cart" component={Cart} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
