import AppBar from "@/components/auth/AppBar";
import LoginForm from "@/components/auth/LoginForm";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Link, router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
    height: height - 250,
  },
  inner: {
    marginTop: 24,
  },
  link: {
    marginTop: 8,
  },
  button: {
    backgroundColor: "#0b4688", // secondary
    padding: 16,
    borderRadius: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fafafa", // neutral-50
    fontWeight: "900",
    fontSize: 20,
    textAlign: "center",
  },
});

const Register = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View style={styles.container}>
        <View>
          <AppBar title="Sign Up" />
          <View style={styles.inner}>
            <LoginForm />
            <Link href="/(auth)/register" style={styles.link}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/(auth)/register")}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default Register;
