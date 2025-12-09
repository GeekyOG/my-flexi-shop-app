import AppBar from "@/components/ui/AppBar";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function OrderSummaryScreen({}) {
  const navigation = useRouter();
  return (
    <View style={styles.container}>
      <AppBar title="Order Successful" />
      <View style={styles.center}>
        <Icon name="checkmark-circle" size={100} color="#4CAF50" />
        <Text style={styles.thanks}>Thank You!</Text>
        <Text style={styles.message}>
          Your order has been placed successfully.
        </Text>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("/(tabs)")}
        >
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  thanks: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  message: { color: "#666", textAlign: "center", marginTop: 8 },
  homeBtn: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 30,
    width: "60%",
    alignItems: "center",
  },
  homeText: { color: "#fff", fontWeight: "bold" },
});
