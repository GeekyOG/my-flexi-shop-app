import React, { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Wireless Headphones",
      price: 520.0,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      color: "#A5071A",
      inStock: true,
    },
    {
      id: "2",
      name: "Smart Watch Pro",
      price: 350.0,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      color: "#000",
      inStock: true,
    },
    {
      id: "3",
      name: "Leather Backpack",
      price: 129.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      color: "#9F5A23",
      inStock: false,
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <View style={styles.headerRight}>
          <Text style={styles.cartCount}>{cartItems.length} items</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart Items */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.itemMeta}>
                  <View style={styles.colorIndicator}>
                    <View
                      style={[styles.colorDot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.colorLabel}>Color</Text>
                  </View>
                  {!item.inStock && (
                    <View style={styles.stockBadge}>
                      <Text style={styles.stockText}>Out of Stock</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, -1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityIcon}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityIcon}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoContainer}>
          <Text style={styles.promoIcon}>🎟️</Text>
          <Text style={styles.promoText}>Apply Promo Code</Text>
          <Text style={styles.promoChevron}>›</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (8%)</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🚚</Text>
            <Text style={styles.infoText}>
              Free shipping on orders over $100
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoText}>Secure checkout guaranteed</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>↩️</Text>
            <Text style={styles.infoText}>30-day return policy</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Checkout Button */}
      <View style={styles.checkoutContainer}>
        <View style={styles.checkoutLeft}>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          <Text style={styles.checkoutIcon}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#111",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  headerRight: {
    width: 40,
  },
  cartCount: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    flex: 1,
    marginRight: 8,
  },
  removeIcon: {
    fontSize: 18,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  colorIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  colorLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  stockBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 10,
    color: "#DC2626",
    fontWeight: "600",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B00",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityIcon: {
    fontSize: 18,
    color: "#111",
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: "center",
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FF6B00",
    borderStyle: "dashed",
  },
  promoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  promoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#FF6B00",
  },
  promoChevron: {
    fontSize: 24,
    color: "#FF6B00",
    fontWeight: "300",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FF6B00",
  },
  infoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#92400E",
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutLeft: {
    flex: 1,
  },
  checkoutLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  checkoutTotal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B00",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginRight: 8,
  },
  checkoutIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
