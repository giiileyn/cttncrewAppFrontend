import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.43.108:3000/api/v1/products'; // Replace with your actual API URL

const EditProfileScreen = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(API_URL);
      setUser({
        username: response.data.username,
        email: response.data.email,
        password: '', // don't prefill for security
        confirmPassword: '',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (user.password !== user.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      await axios.put(API_URL, {
        username: user.username,
        email: user.email,
        password: user.password,
      });
      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#F9A8D4" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={{ uri: 'https://i.ibb.co/vdkfS1s/logo-icon.png' }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Text>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text>≡</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={{ uri: 'https://i.ibb.co/0j6Cv3g/profile-pic.jpg' }}
        style={styles.avatar}
      />

      {/* Form */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={user.username}
          onChangeText={(text) => setUser({ ...user, username: text })}
        />

        <Text style={styles.label}>Gmail</Text>
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={user.confirmPassword}
          onChangeText={(text) => setUser({ ...user, confirmPassword: text })}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdate}
          disabled={!editing}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;

// Same styles from previous message
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FCD34D',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 28, height: 28, marginRight: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
  iconRow: { flexDirection: 'row' },
  iconButton: { marginLeft: 12 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 16,
  },
  formGroup: { marginTop: 10 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    backgroundColor: '#FCE7F3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    color: '#1F2937',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#F9A8D4',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#F9A8D4',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
  },
});
