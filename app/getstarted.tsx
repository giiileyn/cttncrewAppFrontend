import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./GetStartedStyles"; 

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      <Image 
        source={require("../assets/illustrations/started1.png")} 
        style={styles.image}
      />

     
      <View style={styles.card}>
        
        <View style={styles.progressContainer}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        
        <Text style={styles.title}>Style & Comfort for Every Occasion</Text>

        
        <Text style={styles.description}>
          Discover a wide range of women’s t-shirts, from casual basics to trendy graphic designs.
          Find your perfect fit today!
        </Text>

        
        <TouchableOpacity onPress={() => router.push('/getstarted-one')} style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
