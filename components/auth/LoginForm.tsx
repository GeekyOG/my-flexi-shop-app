import { useLoginCustomerMutation } from "@/app/api/authApi";
// import { useAuth } from "@/context/authContext";
import { useAuth } from "@/context/authProvider";
import { Link, useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Yup from "yup";
import Button from "../ui/Button";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
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

const LoginForm = () => {
  const { login, skip, user, token } = useAuth();

  console.log(token);

  const router = useRouter();
  const [loginCustomer, { isLoading, error }] = useLoginCustomerMutation();
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const res = await loginCustomer(values).unwrap();

          login(res.token, res.data);

          router.replace("/(tabs)");
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

          <Link href="/(auth)/forgot-password" style={styles.forgotLink}>
            <View style={styles.forgotRow}>
              <Text>Forgot your password?</Text>
              <Icon name="arrow-right" size={16} style={styles.forgotIcon} />
            </View>
          </Link>
          <Button handleSubmit={handleSubmit}>Login</Button>
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
