import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Icon } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#737373", // neutral-500
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  input: {
    width: "90%",
    paddingVertical: 12,
  },
});

const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(e) => onSearch(e)}
        placeholderTextColor="#9CA3AF"
        placeholder="Search"
        style={styles.input}
      />
      <Icon size={24} source="magnify" />
    </View>
  );
};

export default Search;
