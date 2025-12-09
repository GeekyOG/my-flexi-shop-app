import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CategoriesGrid from "@/components/store/CategoriesGrid";
import CategoryList from "@/components/store/CategoriesList";
import * as React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

export default function StoreScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  const categories = [
    { name: "All" },
    { name: "Gowns" },
    { name: "Tops" },
    { name: "Trousers" },
    { name: "Shoes" },
    { name: "Bags" },
    { name: "Accessories & gadgets" },
    { name: "Jackets" },
    { name: "Skirts" },
    { name: "Suits" },
    { name: "Watches" },
    { name: "Jewelry" },
    { name: "Sportswear" },
    { name: "Lingerie" },
    { name: "Swimwear" },
    { name: "Hats" },
    { name: "Belts" },
    { name: "Sunglasses" },
    { name: "Scarves" },
    { name: "Footwear" },
    { name: "Kids Wear" },
    { name: "Men's Fashion" },
    { name: "Women's Fashion" },
    { name: "Outerwear" },
  ];

  const productSections = [
    { title: "APPLIANCES", icon: "🏠" },
    { title: "FASHION", icon: "👗" },
    { title: "ELECTRONICS", icon: "📱" },
    { title: "BEAUTY", icon: "💄" },
  ];

  return (
    <ParallaxScrollView
      customStyle={{ paddingHorizontal: 0 }}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      {/* Search Section */}
      <View style={styles.searchWrapper}>
        <Search />
      </View>

      {/* Main Layout */}
      <View style={styles.layoutContainer}>
        {/* Category Sidebar - Only show on tablet/desktop */}
        {isTablet && (
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Product Section */}
        <ScrollView
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Mobile Category Chips */}
          {!isTablet && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mobileCategoryScroll}
              contentContainerStyle={styles.mobileCategoryContent}
            >
              {categories.map((category, index) => (
                <View
                  key={index}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.name &&
                      styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category.name &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Header Row */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionHeaderText}>ALL PRODUCTS</Text>
              <Text style={styles.sectionSubtext}>
                {selectedCategory === "All"
                  ? "Explore everything"
                  : selectedCategory}
              </Text>
            </View>
            <IconButton icon="tune-vertical" iconColor="#DB3022" size={24} />
          </View>

          {/* Product Grids */}
          {productSections.map((section, index) => (
            <CategoriesGrid
              key={index}
              title={section.title}
              icon={section.icon}
            />
          ))}
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  layoutContainer: {
    flexDirection: "row",
    flex: 1,
    gap: isDesktop ? 24 : 16,
    paddingHorizontal: isTablet ? 16 : 0,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: isTablet ? 0 : 16,
  },
  mobileCategoryScroll: {
    marginBottom: 20,
    maxHeight: 45,
  },
  mobileCategoryContent: {
    gap: 8,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#DB3022",
    borderColor: "#DB3022",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
  sectionSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
