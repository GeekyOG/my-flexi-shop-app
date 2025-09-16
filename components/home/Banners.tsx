import { Image } from "expo-image";
import React from "react";
import { Dimensions } from "react-native";

import Animated from "react-native-reanimated";
const { width } = Dimensions.get("window");

const Banners = () => {
  const AnimatedScrollView = Animated.ScrollView;

  return (
    <AnimatedScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={true}
    >
      <Image
        style={{ height: 170, width: width - 32 }}
        contentFit="cover"
        source={require("../../assets/images/banner1.png")}
      />
      <Image
        style={{ height: 170, width: width - 32 }}
        contentFit="cover"
        source={require("../../assets/images/banner2.png")}
      />
    </AnimatedScrollView>
  );
};

export default Banners;
