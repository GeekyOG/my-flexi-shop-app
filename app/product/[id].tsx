import ParallaxScrollView from "@/components/ParallaxScrollView";
import ProductImages from "@/components/product/ProductImages";
import AppBar from "@/components/ui/AppBar";
import React from "react";
import { Text } from "react-native";

const ProductDetails = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <AppBar title="Details" />
      <ProductImages />
      <Text> ProductDetails</Text>
    </ParallaxScrollView>
  );
};

export default ProductDetails;
