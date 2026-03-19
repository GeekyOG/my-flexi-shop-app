// components/kyc/KycVerification.tsx

import {
  useGetMyKycQuery,
  useSubmitKycMutation,
  useUpdateMyKycMutation,
} from "@/app/api/kycApi";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Types ────────────────────────────────────────────────────

type KycStatus = "pending" | "approved" | "rejected";

interface SelectedDocument {
  uri: string;
  mimeType: string;
  fileName: string;
  sizeKb?: number;
}

// ── Constants ────────────────────────────────────────────────

const DOCUMENT_TYPES = [
  { label: "National ID", value: "national_id" },
  { label: "Passport", value: "passport" },
  { label: "Driver's License", value: "drivers_license" },
  { label: "Voter's Card", value: "voters_card" },
] as const;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Max short edge — keeps file size small while text stays legible
const MAX_DIMENSION = 1200;
// JPEG quality after compression (0–1)
const COMPRESS_QUALITY = 0.75;
// Warn user if still above this after compression
const WARN_SIZE_KB = 4096; // 4 MB

// ── Image compressor ─────────────────────────────────────────
//
// Install: npx expo install expo-image-manipulator
//
const compressImage = async (
  uri: string,
  originalWidth?: number,
  originalHeight?: number,
): Promise<{ uri: string; mimeType: string; fileName: string }> => {
  const actions: ImageManipulator.Action[] = [];

  if (originalWidth && originalHeight) {
    const maxDim = Math.max(originalWidth, originalHeight);
    if (maxDim > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / maxDim;
      actions.push({
        resize: {
          width: Math.round(originalWidth * scale),
          height: Math.round(originalHeight * scale),
        },
      });
    }
  } else {
    actions.push({ resize: { width: MAX_DIMENSION } });
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: COMPRESS_QUALITY,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    mimeType: "image/jpeg",
    fileName: `kyc_doc_${Date.now()}.jpg`,
  };
};

// ── Sub-components ───────────────────────────────────────────

const StatusCard = ({
  status,
  onResubmit,
}: {
  status: KycStatus;
  onResubmit?: () => void;
}) => {
  const config = {
    approved: {
      icon: "checkmark-circle" as const,
      color: "#059669",
      bg: "#ECFDF5",
      title: "KYC Verified",
      text: "Your identity has been successfully verified.",
    },
    pending: {
      icon: "time" as const,
      color: "#D97706",
      bg: "#FFFBEB",
      title: "Under Review",
      text: "We're reviewing your documents. You'll be notified once complete.",
    },
    rejected: {
      icon: "close-circle" as const,
      color: "#DC2626",
      bg: "#FEF2F2",
      title: "Verification Failed",
      text: "Your documents were not accepted. Please resubmit with a clearer image.",
    },
  }[status];

  return (
    <View style={[styles.statusCard, { backgroundColor: config.bg }]}>
      <View style={styles.statusIconWrap}>
        <Ionicons name={config.icon} size={56} color={config.color} />
      </View>
      <Text style={[styles.statusTitle, { color: config.color }]}>
        {config.title}
      </Text>
      <Text style={styles.statusText}>{config.text}</Text>

      {status === "rejected" && onResubmit && (
        <TouchableOpacity
          style={styles.resubmitButton}
          onPress={onResubmit}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.resubmitButtonText}>Resubmit Documents</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DocumentTypePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const label =
    DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? "Select Document";

  const showIOSPicker = () => {
    const options = [...DOCUMENT_TYPES.map((t) => t.label), "Cancel"];
    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex: options.length - 1 },
      (idx) => {
        if (idx < DOCUMENT_TYPES.length) onChange(DOCUMENT_TYPES[idx].value);
      },
    );
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>Document Type</Text>

      {Platform.OS === "ios" ? (
        <TouchableOpacity
          style={styles.iosPickerButton}
          onPress={showIOSPicker}
          activeOpacity={0.7}
        >
          <Text style={styles.iosPickerText}>{label}</Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </TouchableOpacity>
      ) : (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={styles.picker}
            mode="dropdown"
          >
            {DOCUMENT_TYPES.map((t) => (
              <Picker.Item key={t.value} label={t.label} value={t.value} />
            ))}
          </Picker>
        </View>
      )}
    </View>
  );
};

// ── Main Component ───────────────────────────────────────────

const KycVerification = () => {
  const {
    data: kycResponse,
    isLoading: isLoadingKyc,
    refetch,
  } = useGetMyKycQuery({});

  const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();
  const [updateMyKyc, { isLoading: isUpdating }] = useUpdateMyKycMutation();

  const [selectedDoc, setSelectedDoc] = useState<SelectedDocument | null>(null);
  const [docType, setDocType] = useState<string>("national_id");
  const [isCompressing, setIsCompressing] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const isBusy = isSubmitting || isUpdating || isCompressing;
  const kycData = kycResponse?.data;
  const kycStatus: KycStatus | null = kycData?.status ?? null;

  // ── Permissions ─────────────────────────────────────────────

  const requestPermission = async (type: "camera" | "library") => {
    if (Platform.OS === "web") return true;
    const { status } =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        type === "camera"
          ? "Please allow camera access to take a photo."
          : "Please allow photo library access to upload documents.",
      );
      return false;
    }
    return true;
  };

  // ── Process & compress ───────────────────────────────────────

  const processImage = async (uri: string, width?: number, height?: number) => {
    setIsCompressing(true);
    try {
      const compressed = await compressImage(uri, width, height);

      // Estimate file size — warn if still large
      try {
        const response = await fetch(compressed.uri);
        const blob = await response.blob();
        const sizeKb = Math.round(blob.size / 1024);

        if (sizeKb > WARN_SIZE_KB) {
          Alert.alert(
            "Large File",
            `The image is ${(sizeKb / 1024).toFixed(1)} MB after compression. ` +
              "Consider using a smaller photo for faster upload.",
          );
        }

        setSelectedDoc({ ...compressed, sizeKb });
      } catch {
        setSelectedDoc(compressed);
      }
    } catch {
      Alert.alert("Error", "Failed to process image. Please try another.");
    } finally {
      setIsCompressing(false);
    }
  };

  // ── Image selection ─────────────────────────────────────────

  const handlePickImage = async () => {
    if (!(await requestPermission("library"))) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1, // We compress ourselves — don't double-compress
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (!ALLOWED_MIME_TYPES.includes(asset.mimeType ?? "")) {
          Alert.alert(
            "Unsupported Format",
            "Please choose a JPEG, PNG, or WEBP image.",
          );
          return;
        }
        await processImage(asset.uri, asset.width, asset.height);
      }
    } catch {
      Alert.alert("Error", "Could not open photo library. Please try again.");
    }
  };

  const handleTakePhoto = async () => {
    if (!(await requestPermission("camera"))) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await processImage(asset.uri, asset.width, asset.height);
      }
    } catch {
      Alert.alert("Error", "Could not open camera. Please try again.");
    }
  };

  // ── Build FormData ──────────────────────────────────────────

  const buildFormData = (): FormData => {
    const fd = new FormData();
    fd.append("image", {
      uri: selectedDoc!.uri,
      type: selectedDoc!.mimeType,
      name: selectedDoc!.fileName,
    } as any);
    fd.append("docType", docType);
    return fd;
  };

  // ── Submit ──────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!selectedDoc) {
      Alert.alert(
        "Missing Document",
        "Please select or take a photo of your document.",
      );
      return;
    }

    try {
      const isUpdate = kycStatus === "rejected" && isResubmitting;

      if (isUpdate) {
        await updateMyKyc(buildFormData()).unwrap();
        Alert.alert(
          "Resubmitted",
          "Your documents have been resubmitted for review.",
        );
        setIsResubmitting(false);
      } else {
        await submitKyc(buildFormData()).unwrap();
        Alert.alert(
          "Submitted",
          "Your KYC has been submitted. We'll review it shortly.",
        );
      }

      setSelectedDoc(null);
      refetch();
    } catch (err: any) {
      Alert.alert(
        "Submission Failed",
        err?.data?.message ?? "Something went wrong. Please try again.",
      );
    }
  };

  // ── Loading ─────────────────────────────────────────────────

  if (isLoadingKyc) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading KYC status…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Status screen ───────────────────────────────────────────

  if (kycStatus && !(kycStatus === "rejected" && isResubmitting)) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Identity Verification</Text>
          <StatusCard
            status={kycStatus}
            onResubmit={
              kycStatus === "rejected"
                ? () => {
                    setDocType(kycData?.docType ?? "national_id");
                    setIsResubmitting(true);
                  }
                : undefined
            }
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Upload form ─────────────────────────────────────────────

  const isResubmitFlow = kycStatus === "rejected" && isResubmitting;

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Identity Verification</Text>

        {isResubmitFlow && (
          <View style={styles.resubmitBanner}>
            <Ionicons name="alert-circle" size={18} color="#92400E" />
            <Text style={styles.resubmitBannerText}>
              Please upload a clearer photo of your document.
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isResubmitFlow ? "Resubmit Documents" : "Upload Document"}
          </Text>
          <Text style={styles.cardSubtitle}>
            Provide a clear photo of a valid government-issued ID.
          </Text>

          <DocumentTypePicker value={docType} onChange={setDocType} />

          {/* Compressing indicator */}
          {isCompressing && (
            <View style={styles.compressingWrap}>
              <ActivityIndicator color="#111827" />
              <Text style={styles.compressingText}>Optimising image…</Text>
            </View>
          )}

          {/* Preview */}
          {!isCompressing && selectedDoc && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedDoc.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.previewTag}>
                <Ionicons name="document" size={12} color="#FFFFFF" />
                <Text style={styles.previewTagText} numberOfLines={1}>
                  {selectedDoc.fileName}
                  {selectedDoc.sizeKb
                    ? `  ·  ${
                        selectedDoc.sizeKb < 1024
                          ? `${selectedDoc.sizeKb} KB`
                          : `${(selectedDoc.sizeKb / 1024).toFixed(1)} MB`
                      }`
                    : ""}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedDoc(null)}
                hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <Ionicons name="close-circle" size={30} color="#DC2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* Upload buttons */}
          {!isCompressing && !selectedDoc && (
            <View style={styles.uploadRow}>
              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handleTakePhoto}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="camera" size={28} color="#111827" />
                </View>
                <Text style={styles.uploadOptionText}>Take Photo</Text>
              </TouchableOpacity>

              <View style={styles.uploadDivider} />

              <TouchableOpacity
                style={styles.uploadOption}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <View style={styles.uploadIconWrap}>
                  <Ionicons name="images" size={28} color="#111827" />
                </View>
                <Text style={styles.uploadOptionText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!selectedDoc || isBusy) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!selectedDoc || isBusy}
            activeOpacity={0.8}
          >
            {isSubmitting || isUpdating ? (
              <>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.submitButtonText}>Uploading…</Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {isResubmitFlow
                    ? "Resubmit for Review"
                    : "Submit for Verification"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {isResubmitFlow && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedDoc(null);
                setIsResubmitting(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          <View style={styles.tipsBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#6B7280"
            />
            <View style={styles.tipsContent}>
              <Text style={styles.tipsTitle}>
                Tips for a successful submission
              </Text>
              <Text style={styles.tipItem}>
                • Ensure all text is clearly readable
              </Text>
              <Text style={styles.tipItem}>
                • Avoid glare, shadows, or blurring
              </Text>
              <Text style={styles.tipItem}>
                • The entire document must be visible
              </Text>
              <Text style={styles.tipItem}>
                • Images are auto-compressed before upload
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F3F4F6" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#6B7280" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  statusCard: { borderRadius: 20, padding: 32, alignItems: "center", gap: 12 },
  statusIconWrap: { marginBottom: 4 },
  statusTitle: { fontSize: 22, fontWeight: "700" },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  resubmitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  resubmitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  resubmitBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  resubmitBannerText: {
    flex: 1,
    fontSize: 13,
    color: "#92400E",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: 20,
  },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: -12,
    lineHeight: 20,
  },
  fieldGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  picker: { height: 50 },
  iosPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FAFAFA",
  },
  iosPickerText: { fontSize: 15, color: "#111827" },
  compressingWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
  },
  compressingText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  uploadRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
  },
  uploadOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 24,
    gap: 10,
    backgroundColor: "#F9FAFB",
  },
  uploadDivider: { width: 1, backgroundColor: "#E5E7EB" },
  uploadIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadOptionText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  previewContainer: {
    borderRadius: 14,
    overflow: "hidden",
    height: 220,
    backgroundColor: "#F3F4F6",
  },
  previewImage: { width: "100%", height: "100%" },
  previewTag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
    maxWidth: "85%",
  },
  previewTagText: { color: "#FFFFFF", fontSize: 11 },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  submitButtonDisabled: { backgroundColor: "#9CA3AF" },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  cancelButton: { alignItems: "center", paddingVertical: 12, marginTop: -8 },
  cancelButtonText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  tipsBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  tipsContent: { flex: 1, gap: 4 },
  tipsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  tipItem: { fontSize: 12, color: "#6B7280", lineHeight: 20 },
});

export default KycVerification;
