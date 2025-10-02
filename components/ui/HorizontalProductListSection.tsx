import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import ProductCard from "./ProductCard";
const { width } = Dimensions.get("window");

const itemWidth = width / 2.5;

interface HorizontalProductListSectionProps {
  products: {
    name: string;
    price: string;
    image: string;
    description: string;
  }[];
  title: string;
}

const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: "#0b4688", // primary
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
    color: "#fff",
  },
  scrollView: {
    marginTop: 8,
  },
  productRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});

const HorizontalProductListSection = ({
  title,
  products,
}: HorizontalProductListSectionProps) => {
  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}
      >
        <View style={styles.productRow}>
          {products?.map((product, i) => (
            <ProductCard product={product} key={i} itemWidth={itemWidth} />
          ))}
        </View>
      </AnimatedScrollView>
    </View>
  );
};

export default HorizontalProductListSection;
