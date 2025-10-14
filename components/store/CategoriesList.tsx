import { storeStyles } from "@/app/(tabs)/styles/store";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function CategoryList({
  categories,
}: {
  categories: { name: string }[];
}) {
  return (
    <FlatList
      style={storeStyles.categoryList}
      data={categories}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={storeStyles.categoryItem}>
          <Text style={storeStyles.categoryText}>{item.name}</Text>
        </View>
      )}
    />
  );
}
