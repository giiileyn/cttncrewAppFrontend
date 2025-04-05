import { Image } from 'react-native';
import { Tabs } from 'expo-router';
import { styles } from '@/components/navigator/NavStyles';

const icons: Record<string, any> = {
  home: require('@/assets/navigation/home.png'),
  cart: require('@/assets/navigation/cart.png'),
  pie: require('@/assets/navigation/pie.png'),
  profile: require('@/assets/navigation/profile.png'),
};

export default function Navbottombar() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <Image
            source={icons[route.name]}
            style={[
              styles.icon,
              focused ? styles.activeIcon : styles.inactiveIcon,
            ]}
          />
        ),
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tabs.Screen name="page/home" options={{ headerShown: false }} />
      <Tabs.Screen name="page/cart" options={{ headerShown: false }} />
      <Tabs.Screen name="page/pie" options={{ headerShown: false }} />
      <Tabs.Screen name="page/profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
