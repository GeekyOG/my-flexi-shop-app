import { Image } from "expo-image";
import React from "react";
import { Dimensions } from "react-native";

import Animated from "react-native-reanimated";
const { width } = Dimensions.get("window");

const ProductImages = () => {
  const AnimatedScrollView = Animated.ScrollView;

  return (
    <AnimatedScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={true}
    >
      <Image
        style={{ height: 260, width: width - 32 }}
        contentFit="contain"
        source={require("../../assets/images/image.png")}
      />
      <Image
        style={{ height: 260, width: width - 32 }}
        contentFit="contain"
        source={require("../../assets/images/image1.png")}
      />
    </AnimatedScrollView>
  );
};

export default ProductImages;
