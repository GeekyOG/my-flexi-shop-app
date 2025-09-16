import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface AppBarProps {
  title: string;
}
const AppBar = ({ title }: AppBarProps) => {
  const navigation = useNavigation();

  return (
    <View>
      <Icon
        name="chevron-left"
        size={16}
        color="#000"
        onPress={() => navigation.goBack()}
      />
      <View className="justify-center items-center">
        <Image
          source={require("../../assets/images/LOGO.png")}
          style={{ width: 100, height: 100 }}
          className="mx-auto"
        />
      </View>

      <Text className="font-[900] text-[2.5rem] mt-[50px]">{title}</Text>
    </View>
  );
};

export default AppBar;
