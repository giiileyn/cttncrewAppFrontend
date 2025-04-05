// import { useRouter } from "expo-router";
// import { View, Text, Image, TouchableOpacity } from "react-native";
// import styles from "./GetStartedStyles"; 

// export default function GetStartedOne() {
//   const router = useRouter();

//   return (
//     <View style={styles.container}>
      
//       <Image 
//         source={require("../assets/illustrations/started2.png")} 
//         style={styles.image}
//       />

    
//       <View style={styles.card}>
       
//         <View style={styles.progressContainer}>
//           <View style={styles.dot} />
//           <View style={styles.dotActive} /> 
//           <View style={styles.dot} />
//         </View>

        
//         <Text style={styles.title}>Effortless Style, Maximum Comfort</Text>

        
//         <Text style={styles.description}>
//           Shop premium men’s t-shirts designed for everyday wear, sports, and street fashion. 
//           Elevate your wardrobe now!
//         </Text>

        
//         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
//           <Text style={styles.backText}>Back</Text>
//         </TouchableOpacity>

        
//         <TouchableOpacity onPress={() => router.push('/getstarted-one')} style={styles.nextButton}>
//           <Text style={styles.nextText}>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
