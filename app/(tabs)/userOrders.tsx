import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const userRole = await AsyncStorage.getItem('userRole');

        if (!userId || !userRole) {
          setError('User information not found in storage');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://192.168.43.108:3000/api/v1/order/me', {
          headers: {
            'user-id': userId,
            'user-role': userRole,
          },
        });

        setOrders(response.data.orders || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>

      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId ? item.orderId.toString() : item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order ID: {item.orderId || item._id}</Text>
              {item.orderItems.map((orderItem: any, index: number) => {
                const product = orderItem.product;
                return (
                  <View key={index} style={styles.orderItem}>
                    {product ? (
                      <>
                        {product.image && (
                          <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="contain"
                          />
                        )}
                        <Text>Product: {product.name || 'No name available'}</Text>
                        <Text>Price: ${product.price || 'N/A'}</Text>
                        <Text>Quantity: {orderItem.quantity || 'N/A'}</Text>
                      </>
                    ) : (
                      <Text>Product details are unavailable</Text>
                    )}
                  </View>
                );
              })}

              {/* ✅ Write Review Button */}
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => {
                    const orderId = item.orderId || item._id;
                    router.push(`/page/reviews?orderId=${orderId}`);
                }}
                >
                <Text style={styles.buttonText}>Write Review</Text>
                </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderItem: {
    marginBottom: 6,
  },
  productImage: {
    width: 80,
    height: 80,
    marginVertical: 6,
    borderRadius: 8,
  },
  reviewButton: {
    marginTop: 12,
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserOrders;
