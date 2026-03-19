// components/profile/ProfileHeader.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
  onSettingsPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onSettingsPress }) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Manage your account</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
});

export default ProfileHeader;
