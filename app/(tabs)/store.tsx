import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CategoriesGrid from "@/components/store/CategoriesGrid";
import CategoryList from "@/components/store/CategoriesList";
import * as React from "react";
import { ScrollView, Text, View } from "react-native";
import { IconButton } from "react-native-paper";
import { storeStyles } from "./styles/store";

export default function StoreScreen() {
  const categories = [
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
    { name: "Men’s Fashion" },
    { name: "Women’s Fashion" },
    { name: "Outerwear" },
  ];

  return (
    <ParallaxScrollView
      customStyle={{ paddingHorizontal: 0 }}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      {/* 🔍 Search */}
      <View style={storeStyles.searchWrapper}>
        <Search />
      </View>

      {/* 📦 Main Layout */}
      <View style={storeStyles.layoutContainer}>
        {/* 🧭 Category Sidebar */}
        <CategoryList categories={categories} />

        {/* 🛍️ Product Section */}
        <ScrollView style={storeStyles.contentScroll}>
          {/* Header Row */}
          <View style={storeStyles.sectionHeader}>
            <Text style={storeStyles.sectionHeaderText}>VIEW ALL PRODUCTS</Text>
            <IconButton icon="arrow-right" />
          </View>
          {/* Product Grid */}
          <CategoriesGrid />
          <CategoriesGrid />
          <CategoriesGrid />
          <CategoriesGrid />
          <CategoriesGrid />
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
}
