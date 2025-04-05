import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  card: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
    backgroundColor: '#F3A5C6',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dotActive: {
    width: 15,
    backgroundColor: '#fff',
  },
  dot: {
    width: 10,
    height: 4,
    backgroundColor: '#fff',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  nextButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
