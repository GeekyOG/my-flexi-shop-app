import { Link } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
const LoginForm = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Form Data", values);
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
        <View className="flex gap-4 flex-col">
          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="border py-3 border-gray-300 px-2 rounded-md outline-none bg-white shadow-gray-50"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <Text className="text-red-500 text-[0.865rem] mb-[10px]">
                {errors.email}
              </Text>
            )}
          </View>

          <View>
            <TextInput
              placeholderTextColor="#9CA3AF"
              className="border py-3 px-2 border-gray-300 rounded-md outline-none bg-white shadow-gray-50"
              placeholder="Enter Password"
              autoCapitalize="none"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
            />
            {touched.password && errors.password && (
              <Text className="text-red-500 text-[0.865rem] mb-[10px]">
                {errors.password}
              </Text>
            )}
          </View>

          <Link href="/(auth)/forgot-password" className="w-full">
            <View
              className="flex items-center justify-end gap-2
      flex-row"
            >
              <Text>Forgot your password?</Text>
              <Icon
                name="arrow-right"
                color="#ec762c"
                className="text-primary"
              />
            </View>
          </Link>

          <TouchableOpacity
            onPress={handleSubmit as any}
            className="bg-primary p-4 rounded-xl"
          >
            <Text className="text-neutral-50 font-[900] text-xl text-center">
              Login
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default LoginForm;
