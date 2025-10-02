import ParallaxScrollView from "@/components/ParallaxScrollView";
import ProductImages from "@/components/product/ProductImages";
import AppBar from "@/components/ui/AppBar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
});

const ProductDetails = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <AppBar title="" />
      <ProductImages />

      <Text style={styles.title}>Affordable quality gown</Text>
      <View>
        <Text>
          {" "}
          From: <Text style={styles.bold}>H & M</Text>
        </Text>
        {/* <ShieldCheck /> */}
      </View>
    </ParallaxScrollView>
  );
};

export default ProductDetails;
