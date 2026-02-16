// components/kyc/KycStatusBadge.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface KycStatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  size?: "small" | "medium" | "large";
}

const KycStatusBadge: React.FC<KycStatusBadgeProps> = ({
  status,
  size = "medium",
}) => {
  const getStatusStyle = () => {
    switch (status) {
      case "approved":
        return {
          container: styles.approvedContainer,
          text: styles.approvedText,
          label: "Verified",
        };
      case "rejected":
        return {
          container: styles.rejectedContainer,
          text: styles.rejectedText,
          label: "Rejected",
        };
      case "pending":
      default:
        return {
          container: styles.pendingContainer,
          text: styles.pendingText,
          label: "Pending",
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case "small":
        return { padding: 4, fontSize: 10 };
      case "large":
        return { padding: 10, fontSize: 14 };
      case "medium":
      default:
        return { padding: 6, fontSize: 12 };
    }
  };

  const statusStyle = getStatusStyle();
  const sizeStyle = getSizeStyle();

  return (
    <View
      style={[
        styles.badge,
        statusStyle.container,
        { padding: sizeStyle.padding },
      ]}
    >
      <Text style={[statusStyle.text, { fontSize: sizeStyle.fontSize }]}>
        {statusStyle.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  pendingContainer: {
    backgroundColor: "#FEF3C7",
  },
  pendingText: {
    color: "#D97706",
    fontWeight: "600",
  },
  approvedContainer: {
    backgroundColor: "#D1FAE5",
  },
  approvedText: {
    color: "#059669",
    fontWeight: "600",
  },
  rejectedContainer: {
    backgroundColor: "#FEE2E2",
  },
  rejectedText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});

export default KycStatusBadge;
