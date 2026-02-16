// components/profile/PasswordUpdateModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface PasswordUpdateModalProps {
  visible: boolean;
  onClose: () => void;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  visible,
  onClose,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }
    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
  };

  const handlePasswordUpdate = async () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Reset errors
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validation
    let hasError = false;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
      hasError = true;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      hasError = true;
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      // API call to update password
      // Replace with your actual API call
      // await updatePassword({ currentPassword, newPassword }).unwrap();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert("Success", "Password updated successfully", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.data?.message || "Failed to update password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleClose = () => {
    Keyboard.dismiss();
    resetForm();
    onClose();
  };

  const getPasswordStrength = (password: string): string => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(
      Boolean,
    ).length;

    if (strength <= 2) return "weak";
    if (strength === 3) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#DC2626";
      case "medium":
        return "#D97706";
      case "strong":
        return "#059669";
      default:
        return "#E5E7EB";
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case "weak":
        return "33%";
      case "medium":
        return "66%";
      case "strong":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Update Password</Text>
                    <Text style={styles.modalSubtitle}>
                      Choose a strong password for your account
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.modalCloseButton}
                    disabled={isLoading}
                  >
                    <Ionicons name="close" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Current Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.currentPassword && styles.inputError,
                        ]}
                        value={currentPassword}
                        onChangeText={(text) => {
                          setCurrentPassword(text);
                          if (errors.currentPassword) {
                            setErrors({ ...errors, currentPassword: "" });
                          }
                        }}
                        secureTextEntry={!showCurrentPassword}
                        placeholder="Enter your current password"
                        placeholderTextColor="#9CA3AF"
                        editable={!isLoading}
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <Ionicons
                          name={
                            showCurrentPassword
                              ? "eye-off-outline"
                              : "eye-outline"
                          }
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.currentPassword ? (
                      <Text style={styles.errorText}>
                        {errors.currentPassword}
                      </Text>
                    ) : null}
                  </View>

                  {/* New Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.newPassword && styles.inputError,
                        ]}
                        value={newPassword}
                        onChangeText={(text) => {
                          setNewPassword(text);
                          if (errors.newPassword) {
                            setErrors({ ...errors, newPassword: "" });
                          }
                        }}
                        secureTextEntry={!showNewPassword}
                        placeholder="Enter your new password"
                        placeholderTextColor="#9CA3AF"
                        editable={!isLoading}
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Ionicons
                          name={
                            showNewPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Password Strength Indicator */}
                    {newPassword.length > 0 && (
                      <View style={styles.strengthContainer}>
                        <View style={styles.strengthBar}>
                          <View
                            style={[
                              styles.strengthFill,
                              {
                                width: getStrengthWidth(),
                                backgroundColor: getStrengthColor(),
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[
                            styles.strengthText,
                            { color: getStrengthColor() },
                          ]}
                        >
                          {passwordStrength.charAt(0).toUpperCase() +
                            passwordStrength.slice(1)}
                        </Text>
                      </View>
                    )}

                    {errors.newPassword ? (
                      <Text style={styles.errorText}>{errors.newPassword}</Text>
                    ) : null}

                    {/* Password Requirements */}
                    {newPassword.length > 0 && (
                      <View style={styles.requirementsContainer}>
                        <RequirementItem
                          met={newPassword.length >= 8}
                          text="At least 8 characters"
                        />
                        <RequirementItem
                          met={/[A-Z]/.test(newPassword)}
                          text="One uppercase letter"
                        />
                        <RequirementItem
                          met={/[a-z]/.test(newPassword)}
                          text="One lowercase letter"
                        />
                        <RequirementItem
                          met={/[0-9]/.test(newPassword)}
                          text="One number"
                        />
                      </View>
                    )}
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <View style={styles.passwordInputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.confirmPassword && styles.inputError,
                        ]}
                        value={confirmPassword}
                        onChangeText={(text) => {
                          setConfirmPassword(text);
                          if (errors.confirmPassword) {
                            setErrors({ ...errors, confirmPassword: "" });
                          }
                        }}
                        secureTextEntry={!showConfirmPassword}
                        placeholder="Confirm your new password"
                        placeholderTextColor="#9CA3AF"
                        editable={!isLoading}
                        autoCapitalize="none"
                        returnKeyType="done"
                        onSubmitEditing={handlePasswordUpdate}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Ionicons
                          name={
                            showConfirmPassword
                              ? "eye-off-outline"
                              : "eye-outline"
                          }
                          size={20}
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword ? (
                      <Text style={styles.errorText}>
                        {errors.confirmPassword}
                      </Text>
                    ) : null}
                  </View>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        isLoading && styles.modalButtonDisabled,
                      ]}
                      onPress={handlePasswordUpdate}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons
                            name="lock-closed"
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.modalButtonText}>
                            Update Password
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleClose}
                      disabled={isLoading}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Requirement Item Component
interface RequirementItemProps {
  met: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ met, text }) => (
  <View style={styles.requirementItem}>
    <Ionicons
      name={met ? "checkmark-circle" : "ellipse-outline"}
      size={16}
      color={met ? "#059669" : "#9CA3AF"}
    />
    <Text style={[styles.requirementText, met && styles.requirementTextMet]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "90%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  passwordInputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
    color: "#111827",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 6,
    marginLeft: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
  requirementsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    color: "#6B7280",
  },
  requirementTextMet: {
    color: "#059669",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  modalButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PasswordUpdateModal;
