// app/(profile)/kyc-details.tsx
import KycDetails from "@/components/kyc/KycDetails";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function KycDetailsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <View style={styles.container}>
        <KycDetails />
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
