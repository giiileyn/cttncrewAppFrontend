import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PieScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is the Pie Screen</Text>
    </View>
  );
};

export default PieScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' },
});
