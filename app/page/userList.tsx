import { View, Text, StyleSheet } from "react-native";

export default function UserList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>list of userrrrr</Text>
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
