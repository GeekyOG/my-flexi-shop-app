import React from "react";
import { Dimensions, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import ProductCard from "./ProductCard";

const { width } = Dimensions.get("window");

const itemWidth = width / 3;

interface ScrollableProductSectionProps {
  products: {
    name: string;
    price: string;
    image: string;
    description: string;
  }[];
  title: string;
}

const ScrollableProductSection = ({
  products,
  title,
}: ScrollableProductSectionProps) => {
  const AnimatedScrollView = Animated.ScrollView;

  return (
    <View>
      <View className="bg-primary px-2">
        <Text className="text-[1rem] font-[500] py-2 text-dark-200">
          {title}
        </Text>
      </View>
      <AnimatedScrollView
        className="mt-2"
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
