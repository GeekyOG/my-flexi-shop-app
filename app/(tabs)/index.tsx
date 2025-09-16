import Banners from "@/components/home/Banners";
import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import HorizontalProductListSection from "@/components/ui/HorizontalProductListSection";
import ScrollableProductSection from "@/components/ui/ScrollableProductSection";
import { Image } from "expo-image";
import { Text, View } from "react-native";

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
      <View className="flex-row px-4 justify-between gap-2">
        <View className="bg-secondary w-[100px] text-neutral-50 rounded-md p-3 items-center">
          <Image
            source={require("../../assets/icons/trust.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text className="text-neutral-50 text-[0.865rem]">Trusted</Text>
        </View>
        <View className="bg-secondary w-[100px] text-neutral-50 rounded-md p-3 items-center">
          <Image
            source={require("../../assets/icons/shield.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text className="text-neutral-50 text-[0.865rem]">Secure</Text>
        </View>
        <View className="bg-secondary w-[100px] text-neutral-50 rounded-md p-3 items-center">
          <Image
            source={require("../../assets/icons/reliability.png")}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          <Text className="text-neutral-50 text-[0.865rem]">Reliable</Text>
        </View>
      </View>
      <ScrollableProductSection title="Featured" products={products} />
      <ScrollableProductSection title="Top Sellers" products={products} />
      <HorizontalProductListSection title="Recent Added" products={products} />
    </ParallaxScrollView>
  );
}
