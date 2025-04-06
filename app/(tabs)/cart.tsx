import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Alert
} from 'react-native';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    phoneNo: ''
  });

  useFocusEffect(
    useCallback(() => {
      const loadCart = async () => {
        const storedCart = await AsyncStorage.getItem('cart');
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        setCart(parsedCart);
        setQuantities(parsedCart.map((item: any) => item.quantity || 1));
        setCheckedItems(parsedCart.map(() => false));
      };
      loadCart();
    }, [])
  );

  const toggleCheck = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setCheckedItems(cart.map(() => newValue));
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Number(value) || 1;
    setQuantities(newQuantities);
  };

  const totalAmount = cart.reduce((total, product, index) => {
    if (checkedItems[index]) {
      return total + product.price * quantities[index];
    }
    return total;
  }, 0);

  const handleCheckout = async () => {
    if (!showShippingForm) {
      setShowShippingForm(true);
      return;
    }

    const selectedItems = cart
      .map((item, index) => checkedItems[index] ? { ...item, quantity: quantities[index] } : null)
      .filter(item => item !== null);

    if (selectedItems.length === 0) {
      Alert.alert('Error', 'Please select at least one item.');
      return;
    }

    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phoneNo) {
      Alert.alert('Missing Info', 'Please complete all shipping fields.');
      return;
    }

    const itemsPrice = totalAmount;
    const totalPrice = itemsPrice;

    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        'http://192.168.254.118:3000/api/v1/order/new',
        {
          orderItems: selectedItems,
          shippingInfo,
          itemsPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Order placed successfully!');
        setCart([]);
        setShowShippingForm(false);
        await AsyncStorage.removeItem('cart');
      } else {
        Alert.alert('Error', 'Failed to place order.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput style={styles.search} placeholder="Search" />
        <Image source={require('../../assets/icons/cart.png')} style={styles.icon} />
        <Image source={require('../../assets/icons/menu.png')} style={styles.icon} />
      </View>

      {/* Sub-header */}
      <View style={styles.subHeader}>
        <Text style={styles.cartText}>🛒 Shopping Cart</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Product</Text>
        <Text style={styles.cell}>Unit Price</Text>
        <Text style={styles.cell}>Quantity</Text>
        <Text style={styles.cell}>Total Price</Text>
        <Text style={styles.cell}>Actions</Text>
      </View>

      {/* Product List */}
      <ScrollView>
        {cart.map((product, index) => (
          <View key={index} style={styles.row}>
            <Checkbox
              value={checkedItems[index]}
              onValueChange={() => toggleCheck(index)}
              color={checkedItems[index] ? '#FEC536' : undefined}
            />
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.details}>
              <Text>{product.name}</Text>
              <Text style={styles.seller}>🛍 Seller</Text>
            </View>
            <Text style={styles.price}>₱ {product.price}</Text>
            <TextInput
              style={styles.qtyInput}
              keyboardType="numeric"
              value={String(quantities[index])}
              onChangeText={(text) => handleQuantityChange(index, text)}
            />
            <Text style={styles.price}>₱ {product.price * quantities[index]}</Text>
            <TouchableOpacity>
              <Text style={styles.delete}>🗑</Text>
            </TouchableOpacity>
          </View>
        ))}

        {showShippingForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Shipping Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={shippingInfo.address}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, address: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={shippingInfo.city}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, city: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={shippingInfo.postalCode}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, postalCode: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={shippingInfo.phoneNo}
              onChangeText={(text) => setShippingInfo({ ...shippingInfo, phoneNo: text })}
            />
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Checkbox
          value={selectAll}
          onValueChange={handleSelectAll}
          color={selectAll ? '#FEC536' : undefined}
        />
        <Text>Select All</Text>
        <Text style={{ flex: 1, textAlign: 'center' }}>Total Item : ₱ {totalAmount}</Text>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={{ color: '#fff' }}>Check Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: '#fff'
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FEC536',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  search: {
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 35
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 5
  },
  subHeader: {
    backgroundColor: '#FFECAA',
    padding: 10,
  },
  cartText: {
    color: '#FEC536',
    fontWeight: 'bold'
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#eee',
    paddingVertical: 5,
  },
  cell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  productImage: {
    width: 45,
    height: 45,
    marginHorizontal: 5
  },
  details: {
    flex: 2,
    paddingLeft: 5
  },
  seller: {
    fontSize: 10,
    color: '#888'
  },
  price: {
    flex: 1,
    textAlign: 'center'
  },
  qtyInput: {
    width: 40,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    textAlign: 'center',
    marginHorizontal: 5
  },
  delete: {
    fontSize: 18,
    color: '#000',
    marginHorizontal: 5
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 10
  },
  checkoutBtn: {
    backgroundColor: '#F9C6CE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5
  }
});
