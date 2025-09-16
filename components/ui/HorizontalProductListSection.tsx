import React from "react";
import { Dimensions, Text, View } from "react-native";
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

const HorizontalProductListSection = ({
  title,
  products,
}: HorizontalProductListSectionProps) => {
  const AnimatedScrollView = Animated.ScrollView;

  return (
    <View>
      <View className="bg-primary px-2">
        <Text className="text-[1rem] font-[500] py-2">{title}</Text>
      </View>
      <AnimatedScrollView
        className="mt-2"
        contentContainerStyle={{ gap: 12, paddingHorizontal: 8 }}
      >
        <View className="flex-row gap-3 flex-wrap justify-between">
          {products?.map((product, i) => (
            <ProductCard product={product} key={i} itemWidth={itemWidth} />
          ))}
        </View>
      </AnimatedScrollView>
    </View>
  );
};

export default HorizontalProductListSection;
