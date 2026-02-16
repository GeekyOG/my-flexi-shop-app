// components/kyc/KycDetails.tsx
import { useGetMyKycQuery } from "@/app/api/kycApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import KycStatusBadge from "./kycStatusBadge";

const KycDetails = () => {
  const { data, isLoading, error } = useGetMyKycQuery({});
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (data?.data) {
      // Create image URL from API endpoint
      const url = `${process.env.EXPO_PUBLIC_API_URL}/kyc/my-kyc/image`;
      setImageUrl(url);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (error || !data?.data) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-outline" size={64} color="#D1D5DB" />
        <Text style={styles.emptyText}>No KYC submission found</Text>
        <Text style={styles.emptySubtext}>
          Please submit your KYC documents for verification
        </Text>
      </View>
    );
  }

  const kyc = data.data;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>KYC Details</Text>
          <KycStatusBadge status={kyc.status} size="medium" />
        </View>

        {/* Document Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Document Type:</Text>
            <Text style={styles.infoValue}>
              {kyc.docType || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Submitted:</Text>
            <Text style={styles.infoValue}>
              {new Date(kyc.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {kyc.updatedAt !== kyc.createdAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>
                {new Date(kyc.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
          )}
        </View>

        {/* Document Preview */}
        {imageUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Preview</Text>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => setShowImageModal(true)}
            >
              <Image
                source={{
                  uri: imageUrl,
                  headers: {
                    // Add auth token if needed
                  },
                }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Ionicons name="expand-outline" size={24} color="#FFFFFF" />
                <Text style={styles.imageOverlayText}>
                  Tap to view full size
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Status Message */}
        {kyc.status === "pending" && (
          <View style={styles.statusMessage}>
            <Ionicons name="time-outline" size={20} color="#D97706" />
            <Text style={styles.statusMessageText}>
              Your KYC is under review. You'll be notified once it's verified.
            </Text>
          </View>
        )}

        {kyc.status === "approved" && (
          <View style={[styles.statusMessage, styles.successMessage]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#059669"
            />
            <Text style={[styles.statusMessageText, styles.successText]}>
              Your KYC has been verified successfully!
            </Text>
          </View>
        )}

        {kyc.status === "rejected" && (
          <View style={[styles.statusMessage, styles.errorMessage]}>
            <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
            <Text style={[styles.statusMessageText, styles.errorText]}>
              Your KYC was rejected. Please resubmit with correct documents.
            </Text>
          </View>
        )}
      </View>

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setShowImageModal(false)}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  imageOverlayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  statusMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  statusMessageText: {
    flex: 1,
    fontSize: 14,
    color: "#D97706",
    lineHeight: 20,
  },
  successMessage: {
    backgroundColor: "#D1FAE5",
  },
  successText: {
    color: "#059669",
  },
  errorMessage: {
    backgroundColor: "#FEE2E2",
  },
  errorText: {
    color: "#DC2626",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});

export default KycDetails;
