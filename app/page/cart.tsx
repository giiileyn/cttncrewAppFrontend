import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';

const Cart = () => {
  const products = Array(5).fill({
    name: "Lilac Oversized Back Graphic Printed Tshirt",
    price: 500,
    image: require('../../assets/illustrations/tshirt.png'),
    seller: "Seller Name"
  });

  const [quantities, setQuantities] = useState(Array(products.length).fill(1));
  const [checkedItems, setCheckedItems] = useState(Array(products.length).fill(false));
  const [selectAll, setSelectAll] = useState(false);

  const toggleCheck = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleSelectAll = () => {
    const newValue = !selectAll;
    setSelectAll(newValue);
    setCheckedItems(Array(products.length).fill(newValue));
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Number(value) || 1;
    setQuantities(newQuantities);
  };

  const totalAmount = products.reduce((total, product, index) => {
    if (checkedItems[index]) {
      return total + product.price * quantities[index];
    }
    return total;
  }, 0);

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
        {products.map((product, index) => (
          <View key={index} style={styles.row}>
            <Checkbox
              value={checkedItems[index]}
              onValueChange={() => toggleCheck(index)}
              color={checkedItems[index] ? '#FEC536' : undefined}
            />
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.details}>
              <Text>{product.name}</Text>
              <Text style={styles.seller}>🛍 {product.seller}</Text>
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
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={{ color: '#fff' }}>Check Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
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
    height: 25,
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
