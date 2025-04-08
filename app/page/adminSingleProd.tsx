import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardTypeOptions } from 'react-native';

const AdminSingleProd = () => {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = await AsyncStorage.getItem('selectedProductId');
        if (productId) {
          const response = await axios.get(`http://192.168.43.108:3000/api/v1/product/${productId}`);
          setProduct(response.data.product);
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setProduct((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const productId = await AsyncStorage.getItem('selectedProductId');
      if (productId) {
        await axios.put(`http://192.168.43.108:3000/api/v1/product/${productId}`, product);
        alert('Product updated successfully');
      }
    } catch (err) {
      alert('Error updating product');
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#FEC536" style={{ marginTop: 100 }} />;
  if (!product) return <Text style={{ textAlign: 'center', marginTop: 100 }}>Product not found</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      
      {/* Product Image */}
      <Image
        source={{ uri: product.images[0]?.url }}
        style={{ width: 200, height: 250, borderRadius: 10 }}
        resizeMode="cover"
      />

      {/* Title + Description */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15, textAlign: 'center' }}>{product.name}</Text>
      <Text style={{ color: '#555', textAlign: 'center', marginBottom: 5 }}>{product.description}</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 20 }}>Price: ₱ {product.price}</Text>

      {/* Input Fields */}
      {[
        { label: 'Product Name', name: 'name' },
        { label: 'Price', name: 'price', keyboardType: 'numeric' },
        { label: 'Description', name: 'description' },
        { label: 'Category', name: 'category' },
        { label: 'Stock', name: 'stock', keyboardType: 'numeric' },
        { label: 'Seller', name: 'seller' },
      ].map(({ label, name, keyboardType }) => (
        <View key={name} style={{ width: '100%', marginBottom: 15 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
          <TextInput
            style={{
              backgroundColor: '#FDEFF4',
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#f3cddd',
            }}
            value={String(product[name] || '')}
            onChangeText={(text) => handleInputChange(name, text)}
            keyboardType={(keyboardType as KeyboardTypeOptions) || 'default'}
          />
        </View>
      ))}

      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#f8c0d4',
            padding: 15,
            marginRight: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#f8a6c2',
            padding: 15,
            marginLeft: 10,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AdminSingleProd;
