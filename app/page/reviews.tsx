import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewPage = () => {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userRole = await AsyncStorage.getItem('userRole');

        const response = await axios.get('http://192.168.43.108:3000/api/v1/order/me', {
          headers: {
            'user-id': userId,
            'user-role': userRole,
          },
        });

        const allOrders = response.data.orders;
        const matchedOrder = allOrders.find((o: any) => (o.orderId || o._id) === orderId);

        if (matchedOrder) {
          setOrder(matchedOrder);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Something went wrong'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Write a Review</Text>
      {order.orderItems.map((item: any, index: number) => {
        const product = item.product;
        return (
          <View key={index} style={styles.card}>
            {product?.image && (
              <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            )}
            <Text style={styles.name}>{product?.name || 'No product name'}</Text>
            <Text style={styles.detail}>Price: ${product?.price || 'N/A'}</Text>
            <Text style={styles.detail}>Quantity: {item.quantity}</Text>
            <Text style={styles.detail}>Color: {product?.color || 'Not specified'}</Text>
            {/* Future: Add input fields for rating and comment here */}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1', // light yellow background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63', // pink
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFEB3B', // yellow card
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D81B60',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    marginBottom: 2,
    color: '#333',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ReviewPage;
