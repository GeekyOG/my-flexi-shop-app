// components/profile/ProfileCard.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  name: string;
  email: string;
  avatarUrl: string;
  stats: { label: string; value: string }[];
  onEditProfile: () => void;
  onAvatarChange: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  avatarUrl,
  stats,
  onEditProfile,
  onAvatarChange,
}) => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../../assets/images/avatar.jpg")}
          style={styles.avatar}
        />

        {/* <Image source={{ uri: avatarUrl }} style={styles.avatar} /> */}
      </View>

      <Text style={styles.profileName}>{name}</Text>
      <Text style={styles.profileEmail}>{email}</Text>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statItem}
            activeOpacity={0.7}
          >
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#F9FAFB",
  },

  profileName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 28,
    gap: 8,
  },
  editProfileButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default ProfileCard;
