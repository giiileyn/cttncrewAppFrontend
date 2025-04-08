import { useEffect, useState } from 'react';
import { Alert, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Please log in', 'You need to be logged in to proceed with checkout.');
          // Redirect to login page, if needed
          // router.replace('/auth/login');
        } else {
          setUserId(storedUserId); // Set valid userId in state
        }
      } catch (error) {
        console.error("Error checking userId from AsyncStorage:", error);
      }
    };

    checkUserLoggedIn();
  }, []);

  // If userId is not found or is invalid, show loading or error message
  if (userId === null) {
    return <Text>Loading...</Text>; // Or display an error message if needed
  }

  // Proceed with checkout logic here
  return (
    <View>
      {/* Your checkout UI */}
      <Text>Proceeding with checkout for User ID: {userId}</Text>
    </View>
  );
};

export default CheckoutScreen;
