// app/(tabs)/profile.tsx
import { useAuth } from "@/context/authProvider";
import { logout } from "@/context/authSlice";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  useDeleteMyAccountMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/app/api/customersApi";
import PasswordUpdateModal from "@/components/profile/PasswordUpdateModal";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuSection from "@/components/profile/ProfileMenuSection";
import ProfileUpdateModal from "@/components/profile/UpdateProfileModal";

const Profile = () => {
  const { token, user } = useAuth();
  const router = useRouter();

  const { data: profileData, isLoading } = useGetMyProfileQuery(undefined, {
    skip: !token,
  });
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateMyProfileMutation();
  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteMyAccountMutation();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const profile = profileData?.data;

  const stats = [
    { label: "Orders", value: "24" },
    { label: "Wishlist", value: "12" },
    { label: "Reviews", value: "8" },
  ];

  const handleKYCVerification = () => {
    router.push("/(profile)/kyc-verification");
  };

  const handleKYCDetails = () => {
    router.push("/(profile)/kyc-details");
  };

  const handleUpdateProfile = async (data: { name: string; email: string }) => {
    try {
      await updateProfile(data).unwrap();
      Alert.alert("Success", "Profile updated successfully");
      setShowProfileModal(false);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.data?.message || "Failed to update profile. Please try again.",
      );
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Second confirmation
            Alert.alert(
              "Final Confirmation",
              "This will permanently delete your account. Are you absolutely sure?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteAccount({}).unwrap();
                      await logout();
                      Alert.alert(
                        "Account Deleted",
                        "Your account has been permanently deleted",
                      );
                    } catch (error: any) {
                      Alert.alert(
                        "Error",
                        error.data?.message || "Failed to delete account",
                      );
                    }
                  },
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          Alert.alert("Logged out successfully");
        },
      },
    ]);
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: "person",
          label: "Edit Profile",
          action: () => setShowProfileModal(true),
        },
        {
          icon: "location",
          label: "Addresses",
          action: () => {
            router.push("/checkout/AddressScreen");
          },
        },
        {
          icon: "key",
          label: "Update Password",
          action: () => setShowPasswordModal(true),
        },
      ],
    },
    {
      title: "Verification",
      items: [
        {
          icon: "shield",
          label: "KYC Verification",
          action: handleKYCVerification,
          badge: profile?.kycStatus === "verified" ? "Verified" : "Pending",
        },
        { icon: "shield", label: "KYC Details", action: handleKYCDetails },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          icon: "cart",
          label: "My Orders",
          action: () => {
            router.push("/(profile)/MyOrdersScreen");
          },
        },

        {
          icon: "star",
          label: "Reviews",
          action: () => {
            router.push("/(profile)/ReviewsScreen");
          },
        },
      ],
    },
    {
      title: "Danger Zone",
      items: [
        {
          icon: "trash",
          label: "Delete Account",
          action: handleDeleteAccount,
          isDanger: true,
        },
        {
          icon: "log-out",
          label: "Logout",
          action: handleLogout,
          isDanger: true,
        },
      ],
    },
  ];

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader onSettingsPress={() => Alert.alert("Settings")} />

        <ProfileCard
          name={user?.name || "Loading..."}
          email={user?.email || ""}
          avatarUrl={profile?.avatar || "/images/avatar.jpeg"}
          stats={stats}
          onEditProfile={() => setShowProfileModal(true)}
          onAvatarChange={() => {}}
        />

        <View style={styles.menuContainer}>
          {menuSections.map((section, index) => (
            <ProfileMenuSection key={index} section={section} />
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <PasswordUpdateModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <ProfileUpdateModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentName={profile?.name || ""}
        currentEmail={profile?.email || ""}
        onUpdate={handleUpdateProfile}
        isLoading={isUpdating}
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default Profile;
