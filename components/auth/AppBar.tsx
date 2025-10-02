import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

interface AppBarProps {
  title: string;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  title: {
    fontWeight: "900",
    fontSize: 40,
    marginTop: 50,
    textAlign: "center",
  },
});

const AppBar = ({ title }: AppBarProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Icon
        name="chevron-left"
        size={16}
        color="#000"
        onPress={() => navigation.goBack()}
      />
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/LOGO.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default AppBar;
