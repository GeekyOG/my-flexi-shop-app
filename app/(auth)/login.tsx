import AppBar from "@/components/auth/AppBar";
import LoginForm from "@/components/auth/LoginForm";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Link, router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

function Login() {
  return (
    <>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <View className="justify-between flex h-[calc(100vh-[50px])]">
          <View>
            <AppBar title="Login" />

            <View className="mt-6">
              <LoginForm />
              <Link href="/(auth)/register" className="mt-2">
                <Text
                  onPress={() => router.push("/(auth)/register")}
                  className="text-neutral text-blue-950"
                >
                  Create Account.
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ParallaxScrollView>
    </>
  );
}

export default Login;
