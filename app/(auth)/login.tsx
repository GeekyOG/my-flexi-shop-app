import AppBar from "@/components/auth/AppBar";
import LoginForm from "@/components/auth/LoginForm";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Link, router } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    height: height - 50,
  },
  inner: {
    marginTop: 24,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: "#172554", // blue-950
    fontSize: 16,
    textAlign: "left",
  },
});

function Login() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View style={styles.container}>
        <View>
          <AppBar title="Login" />
          <View style={styles.inner}>
            <LoginForm />
            <Link href="/(auth)/register" style={styles.link}>
              <Text
                onPress={() => router.push("/(auth)/register")}
                style={styles.linkText}
              >
                Create Account.
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

export default Login;
