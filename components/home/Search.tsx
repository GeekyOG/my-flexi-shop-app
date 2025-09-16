import React from "react";
import { TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

const Search = () => {
  return (
    <View className="border border-neutral-500 rounded-md items-center justify-between px-2 flex-row">
      <TextInput
        placeholderTextColor="#9CA3AF"
        placeholder="Search"
        className="w-[90%] py-3"
      />
      <Icon size={24} source="magnify" />
    </View>
  );
};

export default Search;
