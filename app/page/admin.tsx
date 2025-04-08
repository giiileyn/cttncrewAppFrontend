import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import Admin from "../page/adminSingleProd";
import AdminSingleProd from "./adminSingleProd";
import UserList from "../page/userList"; // Import UserList from the correct path
import CreateProduct from "../page/createProduct";
import OrderInfo from "../page/orderInfo";

const { width } = Dimensions.get("window");
const API_URL = "http://192.168.43.108:3000/api/v1/products";

const CATEGORIES = ['Men', 'Women', 'Kids', 'Oversized', 'Graphic'];

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: { url: string }[]; 
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useNavigation();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = async (productId: string) => {
    try {
      // Store only the product ID in AsyncStorage
      await AsyncStorage.setItem('selectedProductId', productId);
      // Navigate to the "AdminSingleProd" page (product details page)
      router.navigate("AdminSingleProd");
    } catch (error) {
      console.error('Error storing product ID: ', error);
      alert('Error navigating to product details page');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://192.168.43.108:3000/api/v1/product/${productId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
      } else {
        alert(result.message || 'Failed to delete product');
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.searchBar} placeholder="Search products..." placeholderTextColor="#555" />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require("@/assets/icons/cart.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.openDrawer()}>
          <Image source={require("@/assets/icons/menu.png")} style={styles.icon} />
        </TouchableOpacity>

        </View>
      </View>

      <ScrollView style={styles.productContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFC43D" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {products.length > 0 && renderProductSection("All Products", products, handleProductPress, deleteProduct)}
            {CATEGORIES.map(category => {
              const categoryProducts = products.filter(product => {
                const trimmedCategory = (product.category || "").trim().toLowerCase();
                return trimmedCategory === category.toLowerCase();
              });
              return categoryProducts.length > 0
                ? renderProductSection(category, categoryProducts, handleProductPress, deleteProduct)
                : null;
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const renderProductSection = (
  title: string,
  products: Product[],
  handleProductPress: (id: string) => void,
  deleteProduct: (id: string) => void
) => (
  <View style={styles.section} key={title}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeMore}>See more</Text>
      </TouchableOpacity>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {products.map((product) => (
        <View key={product._id} style={styles.productItemWrapper}>
          <TouchableOpacity onPress={() => handleProductPress(product._id)} style={styles.productItem}>
            <Image
              source={{ uri: product.images?.[0]?.url || "https://via.placeholder.com/100" }}
              style={styles.productImage}
            />
            <Text style={styles.productName}>{product.name || "Unnamed Product"}</Text>
            <Text style={styles.productPrice}>₱{product.price ? product.price.toFixed(2) : "N/A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteProduct(product._id)} style={styles.deleteIcon}>
            <Image source={require("@/assets/icons/delete.png")} style={styles.deleteImage} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </View>
);

// Drawer Content
const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Image source={require("@/assets/icons/user.png")} style={styles.drawerUserIcon} />
      <Text style={styles.welcomeText}>Welcome, Admin !</Text>
      <Text style={styles.emailText}>gelain@gmail.com</Text>
    </View>
    <DrawerItemList {...props} />
  </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName="Admin"
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#FFD676' },
      }}
    >
      <Drawer.Screen name="Admin" component={Admin} />
      <Drawer.Screen name="UserList" component={UserList} />
      <Drawer.Screen name="CreateProduct" component={CreateProduct} />
      <Drawer.Screen name="OrderInfo" component={OrderInfo} />
      <Drawer.Screen name="AdminSingleProd" component={AdminSingleProd} options={{ drawerItemStyle: { display: 'none' } }} />
  </Drawer.Navigator>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  errorText: { color: 'red', fontSize: 14, textAlign: 'center', marginVertical: 10 },
  header: {
    backgroundColor: '#FFC43D',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 14,
    color: '#FDC959',
  },
  headerIcons: { flexDirection: 'row', marginLeft: 10 },
  icon: { width: 24, height: 24, marginHorizontal: 8, marginTop: 30, resizeMode: 'contain' },
  productContainer: { flex: 1, paddingHorizontal: 15 },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  seeMore: { fontSize: 14, color: '#007BFF' },
  productItem: { width: 120, marginRight: 10, alignItems: 'center' },
  productImage: { width: 100, height: 100, resizeMode: 'contain' },
  productName: { fontSize: 12, marginVertical: 5 },
  productPrice: { fontSize: 14, color: '#555' },
  productItemWrapper: { marginRight: 10, position: 'relative', alignItems: 'center' },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    zIndex: 10,
  },
  deleteImage: { width: 18, height: 18, tintColor: 'red' },

  // Drawer Styles
  drawerHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    paddingBottom: 20,
    marginBottom: 20,
  },
  drawerUserIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  emailText: {
    fontSize: 14,
    color: '#fff',
  },
});

