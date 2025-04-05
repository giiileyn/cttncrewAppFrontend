import { Stack } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { styles } from '@/components/navigator/NavStyles';

const icons: Record<string, any> = {
  home: require('@/assets/navigation/home.png'),
  cart: require('@/assets/navigation/cart.png'),
  pie: require('@/assets/navigation/pie.png'),
  profile: require('@/assets/navigation/profile.png'),
};

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />

      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
