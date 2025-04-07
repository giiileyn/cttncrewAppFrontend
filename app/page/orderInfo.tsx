import { View, Text, StyleSheet } from "react-native";

export default function OrderInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>infos of ur orderr</Text>
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
