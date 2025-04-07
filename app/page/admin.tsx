import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from "react-native";
import Navbottombar from "@/components/navigator/Navbottombar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const API_URL = "http://192.168.254.118:3000/api/v1/products";

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerAnim = useState(new Animated.Value(-width))[0];
  const router = useRouter();

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
    await AsyncStorage.setItem("selectedProductId", productId);
    router.push("/page/singleProd");
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://192.168.254.118:3000/api/v1/product/${productId}`, {
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

  const toggleDrawer = () => {
    const toValue = drawerOpen ? -width : 0;
    setDrawerOpen(!drawerOpen);
    Animated.timing(drawerAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.searchBar} placeholder="Search products..." placeholderTextColor="#555" />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require("@/assets/icons/cart.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDrawer}>
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

      <Navbottombar />

      {/* Drawer Overlay */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: drawerAnim }] }]}>
        <View style={styles.drawerHeader}>
          <Image source={require("@/assets/icons/user.png")} style={styles.drawerUserIcon} />
          <Text style={styles.welcomeText}>Welcome, Admin !</Text>
          <Text style={styles.emailText}>gelain@gmail.com</Text>
        </View>

        <View style={styles.drawerItemList}>
          <TouchableOpacity onPress={() => router.push("/page/userList")}>
            <View style={styles.drawerItem}>
              <Image source={require("@/assets/icons/userlist.png")} style={styles.drawerIcon} />
              <Text style={styles.drawerLabel}>View Users</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/page/createProduct")}>
            <View style={styles.drawerItem}>
              <Image source={require("@/assets/icons/createproduct.png")} style={styles.drawerIcon} />
              <Text style={styles.drawerLabel}>Create New Products</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/page/orderInfo")}>
            <View style={styles.drawerItem}>
              <Image source={require("@/assets/icons/orderinfo.png")} style={styles.drawerIcon} />
              <Text style={styles.drawerLabel}>Orders Informations</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
  drawerContainer: {
    position: 'absolute',
    width: '80%',
    height: '100%',
    backgroundColor: '#FFD676',
    zIndex: 1000,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
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
  drawerItemList: {
    gap: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  drawerIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  drawerLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default Admin;
