import AppBar from "@/components/ui/AppBar";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "../api/customersApi";

interface Address {
  id: string;
  label: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isDefault?: boolean;
}

export default function AddressScreen() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    label: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
  });

  const navigation = useRouter();

  // API Hooks
  const {
    data: addressesData,
    isLoading,
    refetch,
  } = useGetAddressesQuery({
    page: 1,
    size: 100,
  });

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  const addresses = addressesData?.data || [];

  // Set first address as selected by default
  useEffect(() => {
    if (addresses.length > 0 && !selected) {
      const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
      setSelected(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses, selected]);

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        label: address.label || "",
        address: address.address || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "Nigeria",
        postalCode: address.postalCode || "",
      });
    } else {
      setEditingAddress(null);
      setFormData({
        label: "",
        address: "",
        city: "",
        state: "",
        country: "Nigeria",
        postalCode: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      label: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
    });
  };

  const handleSaveAddress = async () => {
    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress({
          id: editingAddress.id,
          ...formData,
        }).unwrap();

        Toast.show({
          type: "success",
          text1: "Address Updated! ✅",
          text2: "Your address has been updated successfully",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 100,
        });
      } else {
        console.log(90);

        // Create new address
        const result = await createAddress(formData).unwrap();

        Toast.show({
          type: "success",
          text1: "Address Added! 📍",
          text2: "New address has been saved",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 100,
        });

        // Set newly created address as selected
        if (result?.data?.id) {
          setSelected(result.data.id);
        }
      }

      handleCloseModal();
      refetch();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: editingAddress ? "Update Failed" : "Creation Failed",
        text2: error?.data?.message || "Something went wrong",
        position: "bottom",
        visibilityTime: 4000,
        bottomOffset: 100,
      });
    }
  };

  const handleDeleteAddress = (addressId: string, addressLabel: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${addressLabel}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAddress(addressId).unwrap();

              Toast.show({
                type: "success",
                text1: "Address Deleted",
                text2: `${addressLabel} has been removed`,
                position: "bottom",
                visibilityTime: 3000,
                bottomOffset: 100,
              });

              // If deleted address was selected, select another one
              if (selected === addressId && addresses.length > 1) {
                const remainingAddresses = addresses.filter(
                  (addr: Address) => addr.id !== addressId,
                );
                setSelected(remainingAddresses[0]?.id || "");
              }

              refetch();
            } catch (error: any) {
              Toast.show({
                type: "error",
                text1: "Deletion Failed",
                text2: error?.data?.message || "Could not delete address",
                position: "bottom",
                visibilityTime: 4000,
                bottomOffset: 100,
              });
            }
          },
        },
      ],
    );
  };

  const handleContinue = () => {
    if (!selected) {
      Toast.show({
        type: "error",
        text1: "No Address Selected",
        text2: "Please select a delivery address",
        position: "bottom",
        bottomOffset: 100,
      });
      return;
    }

    navigation.push({
      pathname: "/checkout/PaymentScreen",
      params: { addressId: selected },
    });
  };

  const renderAddress = ({ item }: { item: Address }) => {
    const fullAddress = [
      item.address,
      item.city,
      item.state,
      "Nigeria",
      item.postalCode,
    ]
      .filter(Boolean)
      .join(", ");

    return (
      <TouchableOpacity
        style={[styles.card, selected === item.id && styles.activeCard]}
        onPress={() => setSelected(item.id)}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>{item.label}</Text>
              {item.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={() => handleOpenModal(item)}
                style={styles.iconButton}
              >
                <Icon name="create-outline" size={20} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteAddress(item.id, item.label)}
                style={styles.iconButton}
                disabled={isDeleting}
              >
                <Icon name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.address}>{fullAddress}</Text>
        </View>
        {selected === item.id && (
          <Icon name="checkmark-circle" size={24} color="#ff6600" />
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <AppBar title="Delivery Address" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6600" />
            <Text style={styles.loadingText}>Loading addresses...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppBar title="Delivery Address" />

        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="location-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Addresses Yet</Text>
            <Text style={styles.emptySubtext}>
              Add your first delivery address to continue
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => handleOpenModal()}
            >
              <Icon name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.emptyButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Address List */}
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={renderAddress}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />

            {/* Add Address Button */}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleOpenModal()}
            >
              <Icon name="add-circle-outline" size={22} color="#ff6600" />
              <Text style={styles.addText}>Add New Address</Text>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
              onPress={handleContinue}
              disabled={!selected}
            >
              <Text style={styles.nextText}>Continue to Payment</Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* Add/Edit Address Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Label *</Text>
                  <TextInput
                    placeholder="e.g., Home, Office, Mom's House"
                    style={styles.input}
                    value={formData.label}
                    onChangeText={(text) =>
                      setFormData({ ...formData, label: text })
                    }
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Street Address *</Text>
                  <TextInput
                    placeholder="Street, house number, apartment"
                    style={[styles.input, styles.textArea]}
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData({ ...formData, address: text })
                    }
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      placeholder="City"
                      style={styles.input}
                      value={formData.city}
                      onChangeText={(text) =>
                        setFormData({ ...formData, city: text })
                      }
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>State</Text>
                    <TextInput
                      placeholder="State"
                      style={styles.input}
                      value={formData.state}
                      onChangeText={(text) =>
                        setFormData({ ...formData, state: text })
                      }
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Country</Text>
                    <TextInput
                      placeholder="Country"
                      style={styles.input}
                      value={formData.country}
                      onChangeText={(text) =>
                        setFormData({ ...formData, country: text })
                      }
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <TextInput
                      placeholder="Postal Code"
                      style={styles.input}
                      value={formData.postalCode}
                      onChangeText={(text) =>
                        setFormData({ ...formData, postalCode: text })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    (isCreating || isUpdating) && styles.saveBtnDisabled,
                  ]}
                  onPress={handleSaveAddress}
                  disabled={isCreating || isUpdating}
                >
                  {isCreating || isUpdating ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.saveText}>
                      {editingAddress ? "Update" : "Save"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <Toast />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeCard: {
    borderColor: "#ff6600",
    backgroundColor: "#fff5f0",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  defaultBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  address: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  addText: {
    marginLeft: 6,
    color: "#ff6600",
    fontWeight: "bold",
    fontSize: 15,
  },
  nextBtn: {
    backgroundColor: "#ff6600",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#ff6600",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fafafa",
    color: "#111",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  saveBtnDisabled: {
    backgroundColor: "#FFA366",
    opacity: 0.7,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
