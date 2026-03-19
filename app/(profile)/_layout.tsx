import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="kyc-verification" options={{ headerShown: false }} />
      <Stack.Screen name="kyc-details" options={{ headerShown: false }} />
      <Stack.Screen name="MyOrdersScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ReviewsScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
