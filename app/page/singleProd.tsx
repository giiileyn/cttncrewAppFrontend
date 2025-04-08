import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
// import { useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import FastImage from 'react-native-fast-image';
// import Navbottombar from "@/components/navigator/Navbottombar";

const SingleProd = () => {
    type RouteParams = {
        params: {
            id: string;
        };
    };

    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const loadProductId = async () => {
            const savedId = await AsyncStorage.getItem("selectedProductId");
            setId(savedId);
        };
        loadProductId();
    }, []);

    interface Product {
        name: string;
        description: string;
        ratings: number;
        numOfReviews: number;
        price: number;
        stock: number;
        images: { url: string }[];
    }

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const API_URL = `http://192.168.43.108:3000/api/v1/product/${id}`;

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                const response = await axios.get(`http://192.168.43.108:3000/api/v1/product/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <ActivityIndicator size="large" color="#FEC536" style={{ marginTop: 100 }} />;
    if (!product) return <Text style={{ textAlign: 'center', marginTop: 100 }}>Product not found</Text>;

    // Add to Cart functionality
    const addToCart = async () => {
        try {
            const existingCart = await AsyncStorage.getItem("cart");
            const cart = existingCart ? JSON.parse(existingCart) : [];
    
            const newItem = {
                id,
                name: product?.name,
                price: product?.price,
                image: product?.images[0]?.url,
                quantity
            };
    
            const updatedCart = [...cart, newItem];
            await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    
            console.log("Item added to cart:", newItem); // Log added item to the console
    
            alert("Item added to cart!");
        } catch (error) {
            console.error("Error saving to cart", error);
        }
    };
    
   
    // Clear cart after checkout
    const clearCart = async () => {
        try {
            await AsyncStorage.removeItem("cart");
            console.log("Cart cleared after checkout");
        } catch (error) {
            console.error("Failed to clear cart", error);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={{ backgroundColor: '#FEC536', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity>
                    <Image source={require('../../assets/icons/menu.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                <TextInput
                    placeholder={product.name}
                    style={{ flex: 1, backgroundColor: '#fff', marginLeft: 10, padding: 5, borderRadius: 5 }}
                />
                <TouchableOpacity>
                    <Image source={require('../../assets/icons/cart.png')} style={{ width: 25, height: 25, marginLeft: 10 }} />
                </TouchableOpacity>
            </View>

            {/* Product Image */}
            <Image
                source={{ uri: product.images[0].url }}
                style={{ width: '100%', height: 400 }}
                resizeMode="cover"
            />

            {/* Product Info */}
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{product.name}</Text>
                <Text style={{ color: '#777', textAlign: 'center' }}>{product.description}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FEC536' }}>{product.ratings} ★★★★★</Text>
                    <Text style={{ marginLeft: 5 }}>{product.numOfReviews} Rating | {product.numOfReviews} Sold</Text>
                </View>

                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#FEC536', textAlign: 'center' }}>₱ {product.price}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <Image source={require('../../assets/icons/shipping.png')} style={{ width: 20, height: 20 }} />
                    <Text>Shipping To: Tagkawayan Quezon</Text>
                    <Text>₱ 105</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text>Quantity</Text>
                    <TextInput 
                        style={{ borderWidth: 1, width: 50, textAlign: 'center' }}
                        value={String(quantity)} 
                        onChangeText={text => setQuantity(Number(text))} 
                        keyboardType='numeric'
                    />
                    <Text>{product.stock} pcs stocks available</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                    <TouchableOpacity 
                        style={{
                            backgroundColor: '#FEC536',
                            padding: 15,
                            borderRadius: 5,
                            flex: 1,
                            marginRight: 5,
                            alignItems: 'center'
                        }}
                        onPress={addToCart}
                    >
                        <Text style={{ color: '#000', fontWeight: 'bold' }}>Add To Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{
                            backgroundColor: '#FF9900',
                            padding: 15,
                            borderRadius: 5,
                            flex: 1,
                            marginLeft: 5,
                            alignItems: 'center'
                        }}
                        onPress={() => {
                            // Implement the checkout logic here (clear cart after checkout)
                            clearCart();
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default SingleProd;
