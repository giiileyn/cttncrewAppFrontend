import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

const OrderConfirmationScreen = () => {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text>Your order has been successfully placed!</Text>
      <Button title="Go to Home" onPress={() => router.push('/home')} />
    </View>
  );
};

export default OrderConfirmationScreen;
