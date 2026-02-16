// app/(profile)/kyc-verification.tsx
import KycVerification from "@/components/kyc/KycVerification";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function KycVerificationScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <KycVerification />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
});
