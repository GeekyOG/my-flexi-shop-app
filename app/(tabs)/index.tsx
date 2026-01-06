import Banners from "@/components/home/Banners";
import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import HorizontalProductListSection from "@/components/ui/HorizontalProductListSection";
import ScrollableProductSection from "@/components/ui/ScrollableProductSection";
import { Image } from "expo-image";

import { FlatList, StyleSheet, Text, View } from "react-native";
import { useGetCategoriesQuery } from "../api/categoriesApi";
import {
  useGetMostViewedProductsQuery,
  useGetProductsQuery,
  useGetTopSellingProductsQuery,
} from "../api/productsApi";
import { storeStyles } from "./styles/store";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "#0b4688", // secondary
    width: 100,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  infoText: {
    color: "#fafafa", // neutral-50
    fontSize: 14,
    marginTop: 4,
  },

  scrollSections: {
    gap: 16,
  },
});

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

export default function Home() {
  // Fetch categories
  const { data: categoriesData } = useGetCategoriesQuery({
    page: 1,
    size: 1000,
    search: "",
  });

  // Fetch featured products
  const { data: featuredData } = useGetProductsQuery({
    page: 1,
    size: 30,
    search: "",
  });

  // Fetch top selling products
  const { data: topSellingData } = useGetTopSellingProductsQuery(10);

  // Fetch most viewed products
  const { data: mostViewedData } = useGetMostViewedProductsQuery(10);

  const displayTopSellingProducts = topSellingData?.data || [];
  const displayMostViewedProducts = mostViewedData?.data || [];
  const displayCategories = categoriesData?.data || categories;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <Search />
      <Banners />
      <View style={styles.row}>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/icons/trust.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text style={styles.infoText}>Trusted</Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/icons/shield.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text style={styles.infoText}>Secure</Text>
        </View>
        <View style={styles.infoBox}>
          <Image
            source={require("../../assets/icons/reliability.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text style={styles.infoText}>Reliable</Text>
        </View>
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 600 }}>Categories</Text>
          <Text style={{ color: "#DB3022" }}>View All</Text>
        </View>
        <View>
          <FlatList
            data={displayCategories}
            style={{ marginTop: 14 }}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  borderColor: "#e3e3e3",
                  borderWidth: 1,
                  marginRight: 12,
                  borderRadius: 6,
                  padding: 4,
                  paddingHorizontal: 12,
                }}
              >
                <Text style={storeStyles.categoryText}>{item.name}</Text>
              </View>
            )}
          />
        </View>
      </View>

      <View style={styles.scrollSections}>
        <ScrollableProductSection
          title="Most Viewed"
          products={displayMostViewedProducts}
        />
        <ScrollableProductSection
          title="Top Sellers"
          products={displayTopSellingProducts}
        />
        <HorizontalProductListSection
          title="Recent Added"
          products={displayMostViewedProducts}
        />
      </View>
    </ParallaxScrollView>
  );
}
