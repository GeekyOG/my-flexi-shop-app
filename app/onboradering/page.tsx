import { Image } from "expo-image";
import React from "react";
import { Dimensions, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");

const OnboardingScreen = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: height,
        width: width,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/LOGO.png")}
          style={{
            width: 150,
            height: 150,
            alignSelf: "center",
          }}
        />
        <Text>My Flexi Shop</Text>
      </View>
    </View>
  );
};

export default OnboardingScreen;
