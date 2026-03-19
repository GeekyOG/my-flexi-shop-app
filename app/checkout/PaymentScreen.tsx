// app/checkout/PaymentScreen.tsx
//
// Receives params from AddressScreen:
//   authorizationUrl  – Paystack hosted payment page
//   reference         – transaction reference
//   totalAmount       – string (for display)
//   paymentAmount     – string (for display)
//   saleIds           – JSON stringified number[]

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useVerifyPaymentQuery } from "../api/salesApi";

// Paystack redirects to these URLs on completion
const PAYSTACK_SUCCESS_URL = "https://standard.paystack.co/close";
const PAYSTACK_CANCEL_URL = "https://paystack.com/close";

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    authorizationUrl: string;
    reference: string;
    totalAmount: string;
    paymentAmount: string;
    saleIds: string;
  }>();

  const { authorizationUrl, reference, totalAmount, paymentAmount } = params;

  const [paymentDone, setPaymentDone] = useState(false);
  const [webViewLoading, setWebViewLoading] = useState(true);

  // Only fires once paymentDone = true
  const {
    data: verifyData,
    isLoading: isVerifying,
    error: verifyError,
  } = useVerifyPaymentQuery(reference, { skip: !paymentDone });

  const formatCurrency = (val: string | undefined) => {
    if (!val) return "—";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  // Watch WebView URL changes to detect Paystack redirect
  const handleNavigationChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    if (
      url.startsWith(PAYSTACK_SUCCESS_URL) ||
      url.startsWith(PAYSTACK_CANCEL_URL) ||
      url.includes("paystack.co/close") ||
      url.includes("callback")
    ) {
      setPaymentDone(true);
    }
  };

  // ── Verification result screen ─────────────────────────────

  if (paymentDone) {
    if (isVerifying) {
      return (
        <SafeAreaView
          style={styles.safe}
          edges={["top", "bottom", "left", "right"]}
        >
          <View style={styles.resultCenter}>
            <ActivityIndicator size="large" color="#ff6600" />
            <Text style={styles.verifyingText}>Confirming your payment…</Text>
          </View>
        </SafeAreaView>
      );
    }

    const success = verifyData?.success;
    const failed = verifyError || !success;

    return (
      <SafeAreaView
        style={styles.safe}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.resultCenter}>
          {/* Icon */}
          <View
            style={[
              styles.resultIcon,
              failed ? styles.failIcon : styles.successIcon,
            ]}
          >
            <Ionicons
              name={failed ? "close" : "checkmark"}
              size={40}
              color="#fff"
            />
          </View>

          <Text style={styles.resultTitle}>
            {failed ? "Payment Failed" : "Payment Successful!"}
          </Text>

          <Text style={styles.resultSubtitle}>
            {failed
              ? "We couldn't confirm your payment. Please check your order history or contact support."
              : `₦${formatCurrency(paymentAmount)} paid successfully.`}
          </Text>

          {/* Summary */}
          {!failed && (
            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Reference</Text>
                <Text style={styles.summaryValue}>{reference}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(paymentAmount)}
                </Text>
              </View>
              {totalAmount !== paymentAmount && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Order Total</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(totalAmount)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace("/(profile)/MyOrdersScreen")}
          >
            <Text style={styles.primaryBtnText}>
              {failed ? "View Orders" : "Track My Order"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── WebView payment screen ─────────────────────────────────

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top", "bottom", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <Text style={styles.headerSub}>{formatCurrency(paymentAmount)}</Text>
        </View>
        {/* Paystack lock badge */}
        <View style={styles.secureBadge}>
          <Ionicons name="lock-closed" size={12} color="#059669" />
          <Text style={styles.secureText}>SSL</Text>
        </View>
      </View>

      {/* WebView */}
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: authorizationUrl }}
          onNavigationStateChange={handleNavigationChange}
          onLoadStart={() => setWebViewLoading(true)}
          onLoadEnd={() => setWebViewLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.webLoading}>
              <ActivityIndicator size="large" color="#ff6600" />
              <Text style={styles.webLoadingText}>Loading payment page…</Text>
            </View>
          )}
          style={{ opacity: webViewLoading ? 0 : 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  headerSub: { fontSize: 13, color: "#9CA3AF" },
  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secureText: { fontSize: 11, fontWeight: "700", color: "#059669" },

  // WebView loading overlay
  webLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    gap: 12,
  },
  webLoadingText: { fontSize: 14, color: "#9CA3AF" },

  // Result screen
  resultCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  successIcon: { backgroundColor: "#059669" },
  failIcon: { backgroundColor: "#DC2626" },
  resultTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  resultSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  summaryBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    marginTop: 8,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, color: "#9CA3AF" },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#111827" },
  verifyingText: { fontSize: 15, color: "#6B7280", marginTop: 12 },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#6B7280", fontSize: 15, fontWeight: "500" },
});
