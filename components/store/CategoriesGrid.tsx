import { storeStyles } from "@/app/(tabs)/styles/store";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const CategoriesGrid = () => {
  return (
    <View style={storeStyles.gridContainer}>
      <View style={storeStyles.gridHeaderRow}>
        <Text style={storeStyles.gridHeaderText}>APPLIANCES</Text>
        <Link style={storeStyles.gridViewAll} href={"/(auth)/forgot-password"}>
          View All
        </Link>
      </View>

      {[1, 2, 3, 4, 5, 6].map((item, index) => (
        <View key={index} style={storeStyles.gridItem}>
          <Image
            source={require("../../assets/icons/shield.png")}
            style={{ width: 50, height: 50 }}
            contentFit="contain"
          />
          <Text style={{ fontSize: 10 }}>Appliances</Text>
        </View>
      ))}
    </View>
  );
};

export default CategoriesGrid;
