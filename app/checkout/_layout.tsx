import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="AddressScreen" options={{ headerShown: false }} />
      <Stack.Screen name="PaymentScreen" options={{ headerShown: false }} />
      <Stack.Screen name="CartScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
