import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface AppBarProps {
  title: string;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 8,
  },
});

const AppBar = ({ title }: AppBarProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-back"
        size={24}
        color="#000"
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.iconRow}>
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
          style={styles.icon}
        />
      </View>
    </View>
  );
};

export default AppBar;
