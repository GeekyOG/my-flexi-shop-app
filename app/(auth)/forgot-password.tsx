import AppBar from "@/components/auth/AppBar";
import LoginForm from "@/components/auth/LoginForm";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ForgotPassword = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View className="justify-between flex h-[calc(100vh-[250px])]">
        <View>
          <AppBar title="Forgot Password" />
          <View className="mt-6">
            <LoginForm />
            <Link href="/(auth)/register" className="mt-2">
              {" "}
              <TouchableOpacity className="bg-secondary p-4 rounded-xl w-full">
                <Text className="text-neutral-50 font-[900] text-xl text-center">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </ParallaxScrollView>
  );
};

export default ForgotPassword;
