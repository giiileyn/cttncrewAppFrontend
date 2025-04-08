import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
// const API_URL = process.env.API_URL;


    

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        if (selectedImage) {
            const filename = selectedImage.split('/').pop() || "profile.jpg";
            const match = /\.(\w+)$/.exec(filename);
            const ext = match ? match[1] : 'jpg';

            formData.append("avatar", {
                uri: selectedImage,
                name: `profile.${ext}`,
                type: `image/${ext}`
            } as any);
        }

        try {
            const response = await fetch(`http://192.168.43.108:3000/api/v1/register`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const data = await response.json();
            if (data.success) {
                Alert.alert("Success", "Registration successful!");
                router.push("/auth/login");
            } else {
                Alert.alert("Error", data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/auth/login.png')} style={styles.headerImage} />

            <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Email" 
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput 
                style={styles.input} 
                placeholder="Password" 
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
                ) : (
                    <Text>Drag or Select Image Here</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupText}>Signup</Text>}
            </TouchableOpacity>

            <Text style={styles.accountText}>
                 Already Have an Account?{" "}
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text style={styles.link}>Signin</Text>
                </TouchableOpacity>
            </Text>

            <Text style={styles.orText}>--------- or access quickly ---------</Text>

            <View style={styles.socialIcons}>
                <Image source={require('../../assets/auth/facebook.png')} style={styles.icon} />
                <Image source={require('../../assets/auth/google.png')} style={styles.icon} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    headerImage: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 5,
        backgroundColor: '#F8E8E8',
        marginBottom: 10,
    },
    imagePicker: {
        width: '100%',
        height: 150,
        borderRadius: 5,
        backgroundColor: '#F8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
    },
    signupButton: {
        width: '100%',
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#F48FB1',
        alignItems: 'center',
        marginBottom: 10,
    },
    signupText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    accountText: {
        marginBottom: 10,
    },
    link: {
        color: '#F48FB1',
        fontWeight: 'bold',
    },
    orText: {
        marginVertical: 10,
        color: 'gray',
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
    },
});