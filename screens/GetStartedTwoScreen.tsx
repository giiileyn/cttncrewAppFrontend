import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./GetStartedStyles"; 

export default function GetStartedTwo() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image 
        source={require("D:/cttncrwApp/frontend/assets/illustrations/started3.png")} 
        style={styles.image}
      />

      {/* Bottom Card */}
      <View style={styles.card}>
        {/* Navigation Buttons */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dotActive} /> 
        </View>

        {/* Next Button */}
        <TouchableOpacity onPress={() => router.push('/#')} style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>T-Shirts for Everyone, Every Style!</Text>

        {/* Description */}
        <Text style={styles.description}>
          From kids' tees to oversized, vintage, and sportswear—find the perfect t-shirt 
          that matches your vibe! Let me know if you'd like any tweaks!
        </Text>
      </View>
    </View>
  );
}
