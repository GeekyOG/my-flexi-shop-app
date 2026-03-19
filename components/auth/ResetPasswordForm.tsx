import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/app/api/authApi";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import Button from "../ui/Button";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const resetSchema = Yup.object().shape({
  token: Yup.string()
    .length(6, "OTP must be 6 characters")
    .required("OTP is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const styles = StyleSheet.create({
  form: {
    flexDirection: "column",
    gap: 16,
  },
  stepLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: -8,
  },
  hint: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#f9fafb",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 4,
  },
  forgotLink: {
    width: "100%",
  },
  forgotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 4,
  },
  backText: {
    color: "#ec762c",
    fontSize: 14,
  },
});

const ResetPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  // Step 1 — Email submission
  if (step === "email") {
    return (
      <Formik
        initialValues={{ email: "" }}
        validationSchema={emailSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await forgotPassword({ email: values.email }).unwrap();
            setSubmittedEmail(values.email);
            setStep("reset");
            Toast.show({
              type: "success",
              text1: "OTP sent",
              text2: "Check your email for the reset code",
              position: "top",
              visibilityTime: 3000,
            });
          } catch (err: any) {
            setStep("reset");
            Toast.show({
              type: "error",
              text1: "Failed to send OTP",
              text2: err?.data?.message || "Please try again",
              position: "top",
              visibilityTime: 4000,
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <Text style={styles.stepLabel}>Step 1 of 2</Text>
            <View>
              <TextInput
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <Button handleSubmit={handleSubmit} disabled={isSendingEmail}>
              {isSendingEmail ? "Sending..." : "Send OTP"}
            </Button>

            <Link href="/(auth)/login" style={styles.forgotLink}>
              <View style={styles.forgotRow}>
                <Text style={{ color: "#33718D" }}>Back to login</Text>
              </View>
            </Link>
          </View>
        )}
      </Formik>
    );
  }

  // Step 2 — OTP + new password
  return (
    <Formik
      initialValues={{ token: "", password: "", confirmPassword: "" }}
      validationSchema={resetSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await resetPassword({
            token: values.token,
            password: values.password,
            confirmPassword: values.confirmPassword,
          }).unwrap();

          Toast.show({
            type: "success",
            text1: "Password reset successful",
            text2: "You can now log in with your new password",
            position: "top",
            visibilityTime: 3000,
          });

          router.replace("/(auth)/login");
        } catch (err: any) {
          Toast.show({
            type: "error",
            text1: "Reset failed",
            text2: err?.data?.message || "Invalid or expired OTP",
            position: "top",
            visibilityTime: 4000,
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.form}>
          <Text style={styles.stepLabel}>Step 2 of 2</Text>

          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              placeholder="Enter OTP from email"
              keyboardType="number-pad"
              autoCapitalize="none"
              value={values.token}
              onChangeText={handleChange("token")}
              onBlur={handleBlur("token")}
            />
            <Text style={styles.hint}>OTP sent to {submittedEmail}</Text>
            {touched.token && errors.token && (
              <Text style={styles.errorText}>{errors.token}</Text>
            )}
          </View>

          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              placeholder="New password"
              autoCapitalize="none"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              placeholder="Confirm new password"
              autoCapitalize="none"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          <Button handleSubmit={handleSubmit} disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset Password"}
          </Button>

          {/* Go back to re-enter email / resend OTP */}
          <Text
            style={[styles.backText, { textAlign: "center" }]}
            onPress={() => setStep("email")}
          >
            Didn&apos;t receive OTP? Go back
          </Text>
        </View>
      )}
    </Formik>
  );
};

export default ResetPasswordForm;
