import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import ProductCard from "./ProductCard";

const { width } = Dimensions.get("window");
const itemWidth = width / 3;

interface ScrollableProductSectionProps {
  products: {
    id: string;
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
    color: "#fff", // dark-200
  },
  scrollView: {
    marginTop: 8,
  },
});

const ScrollableProductSection = ({
  products,
  title,
}: ScrollableProductSectionProps) => {
  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <AnimatedScrollView
        style={styles.scrollView}
        horizontal
        contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}
      >
        {products?.map((product, i) => (
          <ProductCard product={product} key={i} itemWidth={itemWidth} />
        ))}
      </AnimatedScrollView>
    </View>
  );
};

export default ScrollableProductSection;
