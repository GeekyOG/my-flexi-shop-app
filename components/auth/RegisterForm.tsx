import { useRegisterCustomerMutation } from "@/app/api/authApi";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Yup from "yup";
import Button from "../ui/Button";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string().required("Confirm Password"),
});

const styles = StyleSheet.create({
  form: {
    flexDirection: "column",
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db", // gray-300
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#f9fafb", // shadow-gray-50
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 0,
  },
  errorText: {
    color: "#ef4444", // red-500
    fontSize: 14,
    marginBottom: 10,
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
  forgotIcon: {
    color: "#ec762c", // primary
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#ec762c", // primary
    padding: 16,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fafafa", // neutral-50
    fontWeight: "900",
    fontSize: 20,
    textAlign: "center",
  },
});

const RegisterForm = () => {
  const router = useRouter();
  const [registerCustomer, { isLoading, error }] =
    useRegisterCustomerMutation();
  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await registerCustomer(values).unwrap();
          console.log(res);

          await SecureStore.setItemAsync("token", res.token);
          router.replace("/(auth)/login");
        } catch (err) {
          console.log("Login error:", err);
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
              placeholder="Enter your full name"
              autoCapitalize="none"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>
          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              value={values.phone}
              onChangeText={handleChange("phone")}
              onBlur={handleBlur("phone")}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>
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

          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              placeholder="Enter Password"
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
              placeholder="Confirm Password"
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

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            <View style={styles.forgotRow}>
              <Text>Forgot your password?</Text>
              <Icon name="arrow-right" size={16} style={styles.forgotIcon} />
            </View>
          </Link>
          <Button disabled={isLoading} handleSubmit={handleSubmit}>
            Create Account
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default RegisterForm;
