import { Link } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

const getNumColumns = () => {
  if (isDesktop) return 6;
  if (isTablet) return 4;
  return 3;
};

const CategoriesGrid = ({
  title = "APPLIANCES",
  icon = "🏠",
}: {
  title?: string;
  icon?: string;
}) => {
  const numColumns = getNumColumns();

  const items = [
    { name: "Refrigerators", icon: "❄️" },
    { name: "Washing Machines", icon: "🧺" },
    { name: "Microwaves", icon: "🍽️" },
    { name: "Air Conditioners", icon: "❄️" },
    { name: "Televisions", icon: "📺" },
    { name: "Vacuum Cleaners", icon: "🧹" },
  ];

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.iconText}>{icon}</Text>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <Link style={styles.viewAllLink} href={"/(auth)/forgot-password"}>
          <Text style={styles.viewAllText}>View All →</Text>
        </Link>
      </View>

      {/* Grid of Items */}
      <View style={styles.gridContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.gridItem, { width: `${100 / numColumns - 3}%` }]}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.itemText} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: isTablet ? 20 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconText: {
    fontSize: 24,
  },
  headerText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
  viewAllLink: {
    padding: 4,
  },
  viewAllText: {
    color: "#DB3022",
    fontSize: 14,
    fontWeight: "600",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: isTablet ? 16 : 12,
    justifyContent: "flex-start",
    paddingBottom: 16,
  },
  gridItem: {
    aspectRatio: 1,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemIcon: {
    fontSize: isTablet ? 28 : 24,
  },
  itemText: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 14,
  },
});

export default CategoriesGrid;
