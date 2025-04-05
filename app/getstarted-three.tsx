import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function GetStartedThree() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <View style={styles.logoContainer}>
        <Image 
          source={require("../assets/illustrations/started4.png")} 
          style={styles.logo}
        />
        {/* <Text style={styles.brand}>Cottoncrew</Text> */}
      </View>

      
      <View style={styles.card}>
        
        <View style={styles.navButtons}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <Text style={styles.navText}>Back</Text>
          </TouchableOpacity>

          
          {/* <View style={styles.progressContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dotActive} />
          </View> */}

          <TouchableOpacity onPress={() => router.push("/auth/login")} style={styles.navButton}>
            <Text style={styles.navText}>Next</Text>
          </TouchableOpacity>
        </View>

        
        <Text style={styles.description}>
          Discover stylish and comfortable t-shirts for everyone—women, men, 
          and kids. From casual basics to trendy designs, we’ve got it all. 
          Start shopping now!
        </Text>

        
        <TouchableOpacity onPress={() => router.push("../auth/login")} style={styles.startButton}>
          <Text style={styles.startText}>Get Started</Text>
        </TouchableOpacity>
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
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 180,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  brand: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E0A850",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#F7A9C4",
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: "#FFF",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
//   dot: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#FFF",
//     borderRadius: 4,
//     marginHorizontal: 5,
//     opacity: 0.5,
//   },
//   dotActive: {
//     width: 8,
//     height: 8,
//     backgroundColor: "#FFF",
//     borderRadius: 4,
//     marginHorizontal: 5,
//   },
  description: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  startButton: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  startText: {
    color: "#F7A9C4",
    fontSize: 18,
    fontWeight: "bold",
  },
});
