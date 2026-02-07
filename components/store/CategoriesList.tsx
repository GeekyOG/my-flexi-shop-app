import { storeStyles } from "@/app/(tabs)/styles/store";
import React from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";

export default function CategoryList({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: { name: string; id: string }[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}) {
  return (
    <FlatList
      style={storeStyles.categoryList}
      data={categories}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelectCategory?.(item.id)}
          style={[
            storeStyles.categoryItem,
            selectedCategory === item.id && {
              backgroundColor: "#111827",
            },
          ]}
        >
          <Text
            style={[
              storeStyles.categoryText,
              selectedCategory === item.name && {
                color: "#FFFFFF",
              },
            ]}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
