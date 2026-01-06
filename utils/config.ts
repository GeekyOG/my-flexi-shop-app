import { Platform } from "react-native";

export const getApiBaseUrl = (): string => {
  // For web/simulator development:
  if (Platform.OS === "web") {
    return "http://192.168.1.132/:8000/api/v1";
  }

  // For now, try localhost (works in Android emulator/iOS simulator)
  return "http://192.168.1.132/:8000/api/v1";
};

/**
 * Test network connectivity
 */
export const testNetworkConnectivity = async (): Promise<boolean> => {
  try {
    console.log("🔌 Testing network connectivity...");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/categories?page=1&size=20",
      {
        method: "HEAD",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    console.log("✅ Network test passed");
    return response.ok;
  } catch (error) {
    console.error("❌ Network test failed:", error);
    return false;
  }
};

/**
 * Test API connectivity
 */
export const testApiConnectivity = async (
  baseUrl: string
): Promise<boolean> => {
  try {
    console.log(`🔌 Testing API connectivity at ${baseUrl}...`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${baseUrl}/categories?page=1&size=1`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    console.log("✅ API test passed", response.status);
    return response.ok;
  } catch (error) {
    console.error("❌ API test failed:", error);
    return false;
  }
};
