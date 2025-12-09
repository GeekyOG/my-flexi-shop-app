import AppBar from "@/components/ui/AppBar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Woman Sweater",
      category: "Woman Fashion",
      price: 70,
      quantity: 1,
      image: "https://i.imgur.com/ep1Fd2t.png", // replace with your product image
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 55,
      quantity: 1,
      image: "https://i.imgur.com/zVaSzOu.png", // replace with your product image
    },
    {
      id: 3,
      name: "Wireless Headphone",
      category: "Electronics",
      price: 120,
      quantity: 1,
      image: "https://i.imgur.com/Hjq2z1p.png", // replace with your product image
    },
  ]);

  const [discountCode, setDiscountCode] = useState("");

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const navigation = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar title="My Cart" cartCount={cartItems.length} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>

            {/* Quantity + Delete */}
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => handleRemoveItem(item.id)}
                style={styles.deleteButton}
              >
                <Icon name="trash-outline" size={18} color="#FF6B00" />
              </TouchableOpacity>

              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, -1)}
                >
                  <Icon name="remove" size={18} color="#000" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, 1)}
                >
                  <Icon name="add" size={18} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Discount Code */}
        <View style={styles.discountContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Discount Code"
            placeholderTextColor="#9CA3AF"
            value={discountCode}
            onChangeText={setDiscountCode}
          />
          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.push("/checkout/AddressScreen")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 14,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  category: {
    color: "#6B7280",
    fontSize: 13,
    marginVertical: 2,
  },
  price: {
    fontWeight: "700",
    fontSize: 14,
    color: "#111",
  },
  actions: {
    alignItems: "flex-end",
  },
  deleteButton: {
    padding: 4,
    marginBottom: 6,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  applyButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
  },
  summaryContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 14,
  },
  summaryValue: {
    fontWeight: "700",
    color: "#111",
  },
  totalValue: {
    color: "#FF6B00",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
  },
  checkoutButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
