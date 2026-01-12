import AppBar from "@/components/ui/AppBar";
import { formatCurrency } from "@/utils/storage";
import { Image } from "expo-image";
import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useGetCartQuery } from "../api/cartApi";

const CartScreen = () => {
  const { data: cartData } = useGetCartQuery({});

  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    if (cartData) {
      setCartItems(cartData?.data?.items);
    }
  }, cartData);

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

  const subtotal = cartItems?.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const navigation = useRouter();

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <AppBar title="My Cart" cartCount={cartData?.data?.itemCount ?? 0} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems?.length > 0 &&
          cartItems?.map((item: any) => (
            <TouchableOpacity
              onPress={() => router.push(`/product/${item.product.id}`)}
              key={item.id}
              style={styles.card}
            >
              <Image
                source={`https://flexi.aoudit.com/api/v1/product-images/product/${item.product?.id}/display`}
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.product.name}</Text>
                <Text style={styles.category}>
                  {item.product.category.name}
                </Text>
                <Text style={styles.price}>
                  N{formatCurrency(Number(item.product.price))}
                </Text>
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
            </TouchableOpacity>
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
            <Text style={styles.summaryValue}>N{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              N{formatCurrency(subtotal)}
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
    </SafeAreaProvider>
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
