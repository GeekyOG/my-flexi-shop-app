import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  wrapper: {
    height: height,
    width: width,
    backgroundColor: "#fff",
    flexDirection: "column",
    paddingBottom: 200,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF7A00",
    width: 16,
  },
  button: {
    backgroundColor: "#FF7A00",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    position: "absolute",
    bottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
