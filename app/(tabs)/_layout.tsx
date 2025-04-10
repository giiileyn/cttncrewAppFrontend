import { Tabs } from "expo-router";
import { Image } from "react-native";
import { styles } from "@/components/navigator/NavStyles";

const icons: Record<string, any> = {
  home: require("@/assets/navigation/home.png"),
  cart: require("@/assets/navigation/cart.png"),
  userOrders: require("@/assets/navigation/pie.png"),
  profile: require("@/assets/navigation/profile.png"),
};

export default function TabsLayout() {
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
      <Tabs.Screen name="home" options={{ headerShown: false }} />
      <Tabs.Screen name="cart" options={{ headerShown: false }} />
      <Tabs.Screen name="userOrders" options={{ headerShown: false }} />
      <Tabs.Screen name="profile" options={{ headerShown: false }} />
    </Tabs>
  );
}
