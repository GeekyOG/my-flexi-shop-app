import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface AppBarProps {
  title: string;
  cartCount?: number;
}

const AppBar = ({ title, cartCount = 0 }: AppBarProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="chevron-back" size={26} color="#111" />
      </TouchableOpacity>

      {/* Title */}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {/* Right Icons */}
      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search-outline" size={24} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconButton, { marginLeft: 8 }]}>
          <Icon name="cart-outline" size={24} color="#111" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount > 9 ? "9+" : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    flex: 1,
    textAlign: "center",
    color: "#111",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
