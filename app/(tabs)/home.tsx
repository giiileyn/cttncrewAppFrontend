import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Navbottombar from "@/components/navigator/Navbottombar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.254.118:3000/api/v1/products";

const CATEGORIES = ['Men', 'Women', 'Kids', 'Oversized', 'Graphic']; 

// TypeScript interface for Product
interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: { url: string }[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.success) {
        console.log("Fetched Products:", data.data); 
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

  // ✅ Save product ID before navigation
  const handleProductPress = async (productId: string) => {
    await AsyncStorage.setItem("selectedProductId", productId);
    router.push("/page/singleProd");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.searchBar} placeholder="Search products..." placeholderTextColor="#555" />
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require("@/assets/icons/cart.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("@/assets/icons/menu.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <Image source={require("@/assets/illustrations/banner.png")} style={styles.bannerImage} />

      <ScrollView style={styles.productContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFC43D" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {products.length > 0 && renderProductSection("All Products", products, handleProductPress)}

            {CATEGORIES.map(category => {
              const categoryProducts = products.filter(product => {
                const trimmedCategory = (product.category || "").trim().toLowerCase();
                return trimmedCategory === category.toLowerCase();
              });

              return categoryProducts.length > 0 ? renderProductSection(category, categoryProducts, handleProductPress) : null;
            })}
          </>
        )}
      </ScrollView>

      <Navbottombar />
    </View>
  );
};

// ✅ Updated `renderProductSection` to use `handleProductPress`
const renderProductSection = (title: string, products: Product[], handleProductPress: (id: string) => void) => (
  <View style={styles.section} key={title}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity>
        <Text style={styles.seeMore}>See more</Text>
      </TouchableOpacity>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {products.map((product) => (
        <TouchableOpacity 
          key={product._id} 
          style={styles.productItem} 
          onPress={() => handleProductPress(product._id)}
        >
          <Image 
            source={{ uri: product.images?.[0]?.url || "https://via.placeholder.com/100" }} 
            style={styles.productImage} 
          />
          <Text style={styles.productName}>{product.name || "Unnamed Product"}</Text>
          <Text style={styles.productPrice}>₱{product.price ? product.price.toFixed(2) : "N/A"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
  },
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
  headerIcons: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
    marginTop: 30,
    resizeMode: 'contain',
  },
  bannerImage: {
    width: '105%',
    height: 70,
    resizeMode: 'cover', 
  },
  productContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  seeMore: {
    fontSize: 14,
    color: '#007BFF',
  },
  productItem: {
    width: 120,
    marginRight: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 12,
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
  },
});

export default Home;
