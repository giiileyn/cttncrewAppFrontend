import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Navbottombar from "@/components/navigator/Navbottombar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.43.108:3000/api/v1/products";

const CATEGORIES = ['Men', 'Women', 'Kids', 'Oversized', 'Graphic']; 

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | string>(""); 
  const [maxPrice, setMaxPrice] = useState<number | string>(""); 
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

  // Filter products based on search, category, and price
  const filterProductsByPrice = (products: Product[], min: number | string, max: number | string) => {
    return products.filter(product => {
      const price = product.price;

      if (min && max) {
        return price >= Number(min) && price <= Number(max);
      } else if (min) {
        return price >= Number(min);
      } else if (max) {
        return price <= Number(max);
      }

      return true;
    });
  };

  const filteredProducts = filterProductsByPrice(
    products.filter(product => {
      const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? product.category.toLowerCase() === selectedCategory.toLowerCase() : true;
      return matchesSearchQuery && matchesCategory;
    }),
    minPrice,
    maxPrice
  );

  const handleProductPress = async (productId: string) => {
    await AsyncStorage.setItem("selectedProductId", productId);
    router.push("/page/singleProd");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search products..." 
          placeholderTextColor="#555" 
          value={searchQuery}
          onChangeText={setSearchQuery}  
        />
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

      <View style={styles.priceFilterContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min Price"
          keyboardType="numeric"
          value={minPrice.toString()}
          onChangeText={(text) => setMinPrice(Number(text))}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Max Price"
          keyboardType="numeric"
          value={maxPrice.toString()}
          onChangeText={(text) => setMaxPrice(Number(text))}
        />
      </View>

      <ScrollView style={styles.productContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFC43D" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.categoryFilter}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
                  onPress={() => setSelectedCategory(category === selectedCategory ? null : category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredProducts.length > 0 ? (
              <>
                {renderProductSection("All Products", filteredProducts, handleProductPress)}

                {CATEGORIES.map(category => {
                  const categoryProducts = filteredProducts.filter(product => product.category.toLowerCase() === category.toLowerCase());
                  return categoryProducts.length > 0 ? renderProductSection(category, categoryProducts, handleProductPress) : null;
                })}
              </>
            ) : (
              <Text style={styles.noResults}>No products found</Text>
            )}
          </>
        )}
      </ScrollView>

      <Navbottombar />
    </View>
  );
};

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
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
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
  categoryFilter: {
    flexDirection: 'row',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: '#FFC43D',
  },
  categoryText: {
    fontSize: 14,
  },
  priceFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  priceInput: {
    width: '45%',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default Home;