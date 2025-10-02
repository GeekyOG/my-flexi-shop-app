// app/(tabs)/store.tsx
import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import * as React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

export default function StoreScreen() {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <Search />
      <View
        style={{ backgroundColor: "#fafafa", flexDirection: "row", gap: 8 }}
      >
        <FlatList
          style={{
            width: "30%",
            backgroundColor: "#fff",
          }}
          data={[
            { name: "Gowns" },
            { name: "Tops" },
            { name: "Trousers" },
            { name: "Shoes" },
            { name: "Bags" },
            { name: "Accessories" },
            { name: "Jackets" },
            { name: "Skirts" },
            { name: "Suits" },
            { name: "Watches" },
            { name: "Jewelry" },
            { name: "Sportswear" },
            { name: "Lingerie" },
            { name: "Swimwear" },
            { name: "Hats" },
            { name: "Belts" },
            { name: "Sunglasses" },
            { name: "Scarves" },
            { name: "Footwear" },
            { name: "Kids Wear" },
            { name: "Men’s Fashion" },
            { name: "Women’s Fashion" },
            { name: "Outerwear" },
          ]}
          renderItem={({ item }) => (
            <View
              style={{
                paddingVertical: 16,
              }}
            >
              <Text>{item.name}</Text>{" "}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ width: "70%", gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingHorizontal: 8,
            }}
          >
            <Text>All Products</Text>
            <IconButton icon="arrow-right" />
          </View>

          <View
            style={{
              justifyContent: "space-between",
              backgroundColor: "#fff",
              paddingHorizontal: 8,
            }}
          >
            <Text>All Products</Text>
            <IconButton icon="arrow-right" />
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: -40,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sizes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sizeBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "28%",
  },
  addToCart: {
    borderRadius: 30,
    paddingVertical: 5,
  },
});
