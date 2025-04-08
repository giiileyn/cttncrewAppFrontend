import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      const response = await fetch("http://192.168.43.108:3000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.success) {
        const { token, user } = data;

        // ✅ Save token and user info in AsyncStorage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", user._id);
        await AsyncStorage.setItem("userRole", user.role);
        console.log("Stored token:", token);
        
        // ✅ Role-based redirect
        if (user.role === "admin") {
          router.replace("/page/admin");
        } else {
          router.replace("/(tabs)/home");
        }
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/auth/login.png")}
        style={styles.illustration}
      />

      <View style={styles.form}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="jdelacruz@gmail.com"
          placeholderTextColor="#BFA5A5"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="***********"
          placeholderTextColor="#BFA5A5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signinButton} onPress={handleLogin}>
          <Text style={styles.signinText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account?
          <TouchableOpacity onPress={() => router.replace("/auth/register")}>
            <Text style={styles.signupLink}> Signup</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  illustration: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    backgroundColor: "#FCE9EB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
  },
  signinButton: {
    backgroundColor: "#F7A9C4",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  signinText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    textAlign: "center",
    color: "#777",
    marginTop: 15,
    fontSize: 14,
  },
  signupLink: {
    color: "#F7A9C4",
    fontWeight: "bold",
  },
});
