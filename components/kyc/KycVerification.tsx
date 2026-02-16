// components/kyc/KycVerification.tsx
import { useGetMyKycQuery, useSubmitKycMutation } from "@/app/api/kycApi";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const KycVerification = () => {
  const [submitKyc, { isLoading: isSubmitting }] = useSubmitKycMutation();
  const { data: kycData, refetch } = useGetMyKycQuery({});

  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [docType, setDocType] = useState("national_id");
  const [showPicker, setShowPicker] = useState(false);

  const documentTypes = [
    { label: "National ID", value: "national_id" },
    { label: "Passport", value: "passport" },
    { label: "Driver's License", value: "drivers_license" },
    { label: "Voter's Card", value: "voters_card" },
  ];

  const requestPermissions = async (type: "camera" | "library") => {
    if (Platform.OS !== "web") {
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant camera permissions to take photos.",
          );
          return false;
        }
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant photo library permissions to upload documents.",
          );
          return false;
        }
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions("library");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedDocument({
          uri: result.assets[0].uri,
          type: "image",
          mimeType: result.assets[0].type || "image/jpeg",
          fileName: result.assets[0].fileName || "document.jpg",
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions("camera");
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedDocument({
          uri: result.assets[0].uri,
          type: "image",
          mimeType: "image/jpeg",
          fileName: "camera_photo.jpg",
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDocument) {
      Alert.alert("Error", "Please select a document to upload");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", {
        uri: selectedDocument.uri,
        type: selectedDocument.mimeType,
        name: selectedDocument.fileName,
      } as any);

      formData.append("docType", docType);

      const result = await submitKyc(formData).unwrap();

      Alert.alert("Success", "KYC submitted successfully. It's under review.");
      setSelectedDocument(null);
      refetch();
    } catch (error: any) {
      Alert.alert("Error", error.data?.message || "Failed to submit KYC");
      console.error(error);
    }
  };

  const getDocumentLabel = () => {
    return (
      documentTypes.find((type) => type.value === docType)?.label ||
      "Select Document"
    );
  };

  const showIOSPicker = () => {
    if (Platform.OS === "ios") {
      const options = [...documentTypes.map((t) => t.label), "Cancel"];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
        },
        (buttonIndex) => {
          if (buttonIndex < documentTypes.length) {
            setDocType(documentTypes[buttonIndex].value);
          }
        },
      );
    } else {
      setShowPicker(true);
    }
  };

  // If user already has KYC, show status instead
  if (kycData?.data && kycData.data.status !== "rejected") {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.container}>
          <View style={styles.statusCard}>
            <Ionicons
              name={
                kycData.data.status === "approved" ? "checkmark-circle" : "time"
              }
              size={64}
              color={kycData.data.status === "approved" ? "#059669" : "#D97706"}
            />
            <Text style={styles.statusTitle}>
              {kycData.data.status === "approved"
                ? "KYC Verified"
                : "KYC Under Review"}
            </Text>
            <Text style={styles.statusText}>
              {kycData.data.status === "approved"
                ? "Your account has been verified"
                : "We're reviewing your documents. You'll be notified soon."}
            </Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>KYC Verification</Text>
          <Text style={styles.subtitle}>
            Upload a government-issued ID for verification
          </Text>

          {/* Document Type Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Document Type</Text>

            {Platform.OS === "ios" ? (
              // iOS: ActionSheet
              <TouchableOpacity
                style={styles.iosPickerButton}
                onPress={showIOSPicker}
              >
                <Text style={styles.iosPickerButtonText}>
                  {getDocumentLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </TouchableOpacity>
            ) : (
              // Android: Native Picker
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={docType}
                  onValueChange={(value) => setDocType(value)}
                  style={styles.picker}
                  mode="dropdown"
                >
                  {documentTypes.map((type) => (
                    <Picker.Item
                      key={type.value}
                      label={type.label}
                      value={type.value}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Document Preview */}
          {selectedDocument && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: selectedDocument.uri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedDocument(null)}
              >
                <Ionicons name="close-circle" size={28} color="#DC2626" />
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Buttons */}
          {!selectedDocument && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="#111827" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Ionicons name="images" size={24} color="#111827" />
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          {selectedDocument && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    Submit for Verification
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Info */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#6B7280" />
            <Text style={styles.infoText}>
              Make sure your document is clear and all details are visible
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  pickerContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
  },
  // iOS Picker Styles
  iosPickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  iosPickerButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  previewContainer: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default KycVerification;
