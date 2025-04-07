import { View, Text, StyleSheet } from "react-native";

export default function CreateProduct() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add new productImage</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
