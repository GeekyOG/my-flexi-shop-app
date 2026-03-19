import { useForgotPasswordMutation } from "@/app/api/authApi";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Yup from "yup";
import Button from "../ui/Button";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const styles = StyleSheet.create({
  form: {
    flexDirection: "column",
    gap: 16,
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
    marginBottom: 0,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 10,
  },
  forgotLink: {
    width: "100%",
  },
  forgotRow: {
    color: "#ec762c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  forgotIcon: {
    color: "#ec762c",
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#ec762c",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fafafa",
    fontWeight: "900",
    fontSize: 20,
    textAlign: "center",
  },
});

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await forgotPassword(values).unwrap();

          // Save credentials

          // Show success toast

          Toast.show({
            type: "success",
            text1: res.data.message ?? "Check your email for otp to proceed",
            position: "top",
            visibilityTime: 3000,
          });

          // Navigate to home
          router.replace("/(auth)/reset-password");
        } catch (err: any) {
          console.log("Login error:", err);

          // Show error toast
          Toast.show({
            type: "error",
            text1: "Reset Password Failed",
            text2: err?.data?.message || "Invalid email",
            position: "top",
            visibilityTime: 4000,
          });
          router.replace("/(auth)/reset-password");
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

          <Button handleSubmit={handleSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>

          <Link href="/(auth)/login" style={styles.forgotLink}>
            <View style={styles.forgotRow}>
              <Text style={{ color: "#33718D" }}>Already have account?</Text>
            </View>
          </Link>
        </View>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
