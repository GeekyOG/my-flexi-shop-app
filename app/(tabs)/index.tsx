import Banners from "@/components/home/Banners";
import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import HorizontalProductListSection from "@/components/ui/HorizontalProductListSection";
import ScrollableProductSection from "@/components/ui/ScrollableProductSection";
import { Image } from "expo-image";

import { StyleSheet, Text, View } from "react-native";

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

export default function Home() {
  const products = [
    {
      name: "Affordable quality gown",
      price: "2,000,000",
      image: "../../assets/images/image.png",
      description:
        "Elegant evening gown made with premium fabric, perfect for special occasions. Elegant evening gown made with premium fabric, perfect for special occasions.Elegant evening gown made with premium fabric, perfect for special occasions.Elegant evening gown made with premium fabric, perfect for special occasions.",
    },
    {
      name: "Affordable quality gown",
      price: "2,000,000",
      image: "../../assets/images/image1.png",
      description:
        "Stylish modern gown with a flattering fit, designed for comfort and class.",
    },
    {
      name: "Affordable quality gown",
      price: "2,000,000",
      image: "../../assets/images/image2.png",
      description:
        "Lightweight gown with a timeless look, suitable for both casual and formal wear.",
    },
    {
      name: "Affordable quality gown",
      price: "2,000,000",
      image: "../../assets/images/image1.png",
      description:
        "Classic gown with a chic silhouette, crafted for everyday elegance.",
    },
    {
      name: "Affordable quality gown",
      price: "2,000,000",
      image: "../../assets/images/image2.png",
      description:
        "Graceful gown designed with fine details, ideal for weddings and parties.",
    },
  ];

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

      <View style={styles.scrollSections}>
        <ScrollableProductSection title="Featured" products={products} />
        <ScrollableProductSection title="Top Sellers" products={products} />
        <HorizontalProductListSection
          title="Recent Added"
          products={products}
        />
      </View>
    </ParallaxScrollView>
  );
}
