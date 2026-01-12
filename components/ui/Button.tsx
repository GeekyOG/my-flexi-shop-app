import React, { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Button = ({
  children,
  handleSubmit,
  disabled,
}: {
  children: ReactNode;
  handleSubmit: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handleSubmit as any}
      style={styles.button}
    >
      {<Text style={styles.buttonText}>{children}</Text>}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ec762c", // primary
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fafafa", // neutral-50
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
});
