import RenderMenuItem from "@/components/profile/menuItems";
import { useAuth } from "@/context/authProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import React, { useState } from "react";

import { logout } from "@/context/authSlice";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Profile = () => {
  const { token } = useAuth();

  console.log(token);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const stats = [
    { label: "Orders", value: "24" },
    { label: "Wishlist", value: "12" },
    { label: "Reviews", value: "8" },
  ];

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Navigate to edit profile screen");
    // navigation.navigate('EditProfile');
  };

  const handleAddresses = () => {
    Alert.alert("Addresses", "Navigate to addresses screen");
    // navigation.navigate('Addresses');
  };

  const handlePaymentMethods = () => {
    Alert.alert("Payment Methods", "Navigate to payment methods screen");
    // navigation.navigate('PaymentMethods');
  };

  const handleMyOrders = () => {
    Alert.alert("My Orders", "Navigate to orders screen");
    // navigation.navigate('Orders');
  };

  const handleReturns = () => {
    Alert.alert("Returns", "Navigate to returns screen");
    // navigation.navigate('Returns');
  };

  const handleReviews = () => {
    Alert.alert("Reviews", "Navigate to reviews screen");
    // navigation.navigate('Reviews');
  };

  const handleLanguage = () => {
    Alert.alert("Language", "Open language selection");
    // navigation.navigate('Language');
  };

  const handlePrivacy = () => {
    Alert.alert("Privacy", "Navigate to privacy settings");
    // navigation.navigate('Privacy');
  };

  const handleHelp = () => {
    Alert.alert("Help Center", "Navigate to help center");
    // navigation.navigate('HelpCenter');
  };

  const handleContact = () => {
    Alert.alert("Contact Us", "Open contact form");
    // navigation.navigate('Contact');
  };

  const handleTerms = () => {
    Alert.alert("Terms & Conditions", "Navigate to terms");
    // navigation.navigate('Terms');
  };

  const handleKYCVerification = () => {
    Alert.alert("KYC Verification", "Navigate to KYC verification process");
    // navigation.navigate('KYCVerification');
  };

  const handleKYCDetails = () => {
    Alert.alert("KYC Details", "View your KYC details and status");
    // navigation.navigate('KYCDetails');
  };

  const handleUpdatePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords don't match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    // API call to update password
    Alert.alert("Success", "Password updated successfully");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          // Clear token and navigate to login
          Alert.alert("Logged out successfully");
        },
      },
    ]);
  };

  const handleAvatarChange = () => {
    Alert.alert("Change Avatar", "Open image picker");
    // Open image picker
  };

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: "user", label: "Edit Profile", action: handleEditProfile },
        { icon: "location", label: "Addresses", action: handleAddresses },

        { icon: "key", label: "Update Password", action: handleUpdatePassword },
      ],
    },
    {
      title: "Verification",
      items: [
        {
          icon: "shield",
          label: "KYC Verification",
          action: handleKYCVerification,
          badge: "Pending",
        },
        { icon: "file", label: "KYC Details", action: handleKYCDetails },
      ],
    },
    {
      title: "Orders",
      items: [
        { icon: "store", label: "My Orders", action: handleMyOrders },
        { icon: "refresh", label: "Returns", action: handleReturns },
        { icon: "star", label: "Reviews", action: handleReviews },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          icon: "bell",
          label: "Notifications",
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help", label: "Help Center", action: handleHelp },
        { icon: "message", label: "Contact Us", action: handleContact },
        { icon: "file", label: "Terms & Conditions", action: handleTerms },
      ],
    },
  ];

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Alert.alert("Settings", "Open settings")}
          >
            <Ionicons name="settings" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleAvatarChange}
            >
              {/* <Icon name="camera" size={16} color="#FFFFFF" /> */}
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Sarah Johnson</Text>
          <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            {/* <Icon name="user" size={16} color="#FFFFFF" /> */}
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Stats */}
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

        {/* Menu Sections */}
        <View style={styles.menuContainer}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <React.Fragment key={itemIndex}>
                    <RenderMenuItem item={item} index={itemIndex} />
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          {/* <Icon name="logout" size={20} color="#DC2626" /> */}
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Password Update Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Password</Text>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePasswordUpdate}
            >
              <Text style={styles.modalButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
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
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
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
  editAvatarButton: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#111827",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  menuSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  badgePending: {
    backgroundColor: "#FEF3C7",
  },
  badgePendingText: {
    color: "#D97706",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 72,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 28,
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 40,
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
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
  },
  modalCloseText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  modalButton: {
    marginBottom: 10,
  },
  modalButtonText: {
    marginBottom: 10,
  },
});
