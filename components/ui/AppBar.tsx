import { useNavigation } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
interface AppBarProps {
  title: string;
}
const AppBar = ({ title }: AppBarProps) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between mt-2">
      <Icon
        name="chevron-back"
        size={24}
        color="#000"
        onPress={() => navigation.goBack()}
      />

      <Text className="font-[700] text-[1.5rem]">{title}</Text>

      <View className="flex-row items-center gap-2">
        <Icon
          name="search"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />

        <Icon
          name="cart"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default AppBar;
