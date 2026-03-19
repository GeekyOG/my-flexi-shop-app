// app/checkout/AddressScreen.tsx
import AppBar from "@/components/ui/AppBar";
import { City, Country, State } from "country-state-city";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useGetCartQuery } from "../api/cartApi";
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "../api/customersApi";
import { useInitializePaymentMutation } from "../api/salesApi";

// ── Types ─────────────────────────────────────────────────────

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

interface PickerItem {
  label: string;
  value: string;
}

// ── Picker Modal ──────────────────────────────────────────────

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
}

const PickerModal: React.FC<PickerModalProps> = ({
  visible,
  title,
  items,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.sheet}>
          <View style={pickerStyles.header}>
            <Text style={pickerStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <View style={pickerStyles.searchWrap}>
            <Icon name="search-outline" size={18} color="#999" />
            <TextInput
              style={pickerStyles.searchInput}
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Icon name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={pickerStyles.item}
                onPress={() => {
                  onSelect(item);
                  setSearch("");
                  onClose();
                }}
              >
                <Text style={pickerStyles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={pickerStyles.empty}>No results found</Text>
            }
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </Modal>
  );
};

// ── Selector Button ───────────────────────────────────────────

interface SelectorProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

const Selector: React.FC<SelectorProps> = ({
  label,
  value,
  placeholder,
  onPress,
  disabled,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity
      style={[
        styles.input,
        styles.selector,
        disabled && styles.selectorDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.selectorText, !value && styles.selectorPlaceholder]}>
        {value || placeholder}
      </Text>
      <Icon name="chevron-down" size={18} color={disabled ? "#ccc" : "#666"} />
    </TouchableOpacity>
  </View>
);

// ── Constants ─────────────────────────────────────────────────

const NIGERIA = Country.getAllCountries().find((c) => c.isoCode === "NG")!;

const defaultFormData = {
  label: "",
  address: "",
  city: "",
  cityName: "",
  state: "",
  stateName: "",
  country: NIGERIA.isoCode,
  countryName: NIGERIA.name,
  postalCode: "",
};

// ── Main Screen ───────────────────────────────────────────────

export default function AddressScreen() {
  const [selected, setSelected] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const navigation = useRouter();

  const {
    data: addressesData,
    isLoading,
    refetch,
  } = useGetAddressesQuery({ page: 1, size: 100 });
  const { data: cartData } = useGetCartQuery({});

  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [initializePayment, { isLoading: isInitializing }] =
    useInitializePaymentMutation();

  const addresses: Address[] = addressesData?.data || [];

  // ── Auto-select default address ───────────────────────────

  useEffect(() => {
    if (addresses.length > 0 && !selected) {
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      setSelected(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses, selected]);

  // ── Picker lists ──────────────────────────────────────────

  const countryItems: PickerItem[] = Country.getAllCountries().map((c) => ({
    label: `${c.flag} ${c.name}`,
    value: c.isoCode,
  }));

  const stateItems: PickerItem[] = formData.country
    ? State.getStatesOfCountry(formData.country).map((s) => ({
        label: s.name,
        value: s.isoCode,
      }))
    : [];

  const cityItems: PickerItem[] =
    formData.country && formData.state
      ? City.getCitiesOfState(formData.country, formData.state).map((c) => ({
          label: c.name,
          value: c.name,
        }))
      : [];

  // ── Modal ─────────────────────────────────────────────────

  const handleOpenModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      const countryObj = Country.getAllCountries().find(
        (c) => c.name === address.country || c.isoCode === address.country,
      );
      const stateObj = countryObj
        ? State.getStatesOfCountry(countryObj.isoCode).find(
            (s) => s.name === address.state || s.isoCode === address.state,
          )
        : undefined;

      setFormData({
        label: address.label || "",
        address: address.address || "",
        city: address.city || "",
        cityName: address.city || "",
        state: stateObj?.isoCode || "",
        stateName: address.state || "",
        country: countryObj?.isoCode || NIGERIA.isoCode,
        countryName: address.country || NIGERIA.name,
        postalCode: address.postalCode || "",
      });
    } else {
      setEditingAddress(null);
      setFormData(defaultFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData(defaultFormData);
  };

  // ── Save address ──────────────────────────────────────────

  const handleSaveAddress = async () => {
    console.log(formData);

    if (!formData.label.trim() || !formData.address.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Label and Street Address are required",
        position: "bottom",
        bottomOffset: 100,
      });
      return;
    }

    const payload = {
      label: formData.label,
      address: formData.address,
      city: formData.cityName,
      state: formData.stateName,
      country: formData.countryName,
      postalCode: formData.postalCode,
    };

    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, ...payload }).unwrap();
        Toast.show({
          type: "success",
          text1: "Address Updated! ✅",
          text2: "Your address has been updated successfully",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 100,
        });
      } else {
        const result = await createAddress(payload).unwrap();
        console.log(result);

        Toast.show({
          type: "success",
          text1: "Address Added! 📍",
          text2: "New address has been saved",
          position: "bottom",
          visibilityTime: 3000,
          bottomOffset: 100,
        });
        if (result?.data?.id) setSelected(result.data.id);
      }
      handleCloseModal();
      refetch();
    } catch (error: any) {
      console.log(error, "error");

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

  // ── Delete address ────────────────────────────────────────

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
              if (selected === addressId && addresses.length > 1) {
                const remaining = addresses.filter(
                  (addr) => addr.id !== addressId,
                );
                setSelected(remaining[0]?.id || "");
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

  // ── Continue → initialize payment ─────────────────────────

  const handleContinue = async () => {
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

    // Build items array from cart
    const cartItems: { productId: number; quantity: number }[] = (
      cartData?.data?.items ??
      cartData?.data?.cartItems ??
      []
    ).map((item: any) => ({
      productId: item.productId ?? item.product?.id,
      quantity: item.quantity,
    }));

    console.log(cartItems);

    if (cartItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Empty Cart",
        text2: "Your cart is empty",
        position: "bottom",
        bottomOffset: 100,
      });
      return;
    }

    try {
      const result = await initializePayment({
        items: cartItems,
        addressId: selected,
      }).unwrap();

      // Navigate to WebView payment screen with the Paystack URL
      navigation.push({
        pathname: "/checkout/PaymentScreen",
        params: {
          authorizationUrl: result.data.authorizationUrl,
          reference: result.data.reference,
          totalAmount: String(result.data.totalAmount),
          paymentAmount: String(result.data.paymentAmount),
          saleIds: JSON.stringify(result.data.saleIds),
        },
      });
    } catch (error: any) {
      const message = error?.data?.message || "Could not initialize payment";

      // Surface specific backend errors clearly
      Toast.show({
        type: "error",
        text1: "Payment Failed to Start",
        text2: message,
        position: "bottom",
        visibilityTime: 4000,
        bottomOffset: 100,
      });
    }
  };

  // ── Address card ──────────────────────────────────────────

  const renderAddress = ({ item }: { item: Address }) => {
    const fullAddress = [
      item.address,
      item.city,
      item.state,
      item.country,
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
              {selected === item.id && (
                <Icon name="checkmark-circle" size={24} color="#ff6600" />
              )}
            </View>
          </View>
          <Text style={styles.address}>{fullAddress}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Loading ───────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.safe}
        edges={["top", "bottom", "left", "right"]}
      >
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

  // ── Render ────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.container}>
        <AppBar
          title="Delivery Address"
          cartCount={cartData?.data?.itemCount ?? 0}
        />

        <View style={{ padding: 16, flex: 1 }}>
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
              <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={renderAddress}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />

              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleOpenModal()}
              >
                <Icon name="add-circle-outline" size={22} color="#ff6600" />
                <Text style={styles.addText}>Add New Address</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.nextBtn,
                  (!selected || isInitializing) && styles.nextBtnDisabled,
                ]}
                onPress={handleContinue}
                disabled={!selected || isInitializing}
              >
                {isInitializing ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.nextText}>Preparing Payment…</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.nextText}>Continue to Payment</Text>
                    <Icon name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* ── Add/Edit Address Modal ── */}
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

              <ScrollView
                style={styles.modalBody}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
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

                <Selector
                  label="Country"
                  value={formData.countryName}
                  placeholder="Select Country"
                  onPress={() => setShowCountryPicker(true)}
                />

                <Selector
                  label="State"
                  value={formData.stateName}
                  placeholder={
                    formData.country ? "Select State" : "Select a country first"
                  }
                  onPress={() => setShowStatePicker(true)}
                  disabled={!formData.country || stateItems.length === 0}
                />

                <Selector
                  label="City"
                  value={formData.cityName}
                  placeholder={
                    formData.state ? "Select City" : "Select a state first"
                  }
                  onPress={() => setShowCityPicker(true)}
                  disabled={!formData.state || cityItems.length === 0}
                />

                <View style={styles.inputGroup}>
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
              </ScrollView>

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

        {/* ── Picker Modals ── */}
        <PickerModal
          visible={showCountryPicker}
          title="Country"
          items={countryItems}
          onClose={() => setShowCountryPicker(false)}
          onSelect={(item) => {
            setFormData({
              ...formData,
              country: item.value,
              countryName:
                Country.getCountryByCode(item.value)?.name || item.label,
              state: "",
              stateName: "",
              city: "",
              cityName: "",
            });
          }}
        />

        <PickerModal
          visible={showStatePicker}
          title="State"
          items={stateItems}
          onClose={() => setShowStatePicker(false)}
          onSelect={(item) => {
            setFormData({
              ...formData,
              state: item.value,
              stateName: item.label,
              city: "",
              cityName: "",
            });
          }}
        />

        <PickerModal
          visible={showCityPicker}
          title="City"
          items={cityItems}
          onClose={() => setShowCityPicker(false)}
          onSelect={(item) => {
            setFormData({
              ...formData,
              city: item.value,
              cityName: item.label,
            });
          }}
        />

        <Toast />
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111" },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemText: { fontSize: 15, color: "#222" },
  empty: { textAlign: "center", padding: 24, color: "#999", fontSize: 14 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 16, color: "#666" },
  listContent: { paddingBottom: 20 },
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
  activeCard: { borderColor: "#ff6600", backgroundColor: "#fff5f0" },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  label: { fontSize: 16, fontWeight: "bold", color: "#111" },
  defaultBadge: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: { fontSize: 10, color: "#fff", fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 4 },
  iconButton: { padding: 4 },
  address: { color: "#666", fontSize: 14, lineHeight: 20 },
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
  nextBtnDisabled: { backgroundColor: "#ccc", shadowOpacity: 0, elevation: 0 },
  nextText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginTop: 16 },
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
  emptyButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#111" },
  modalBody: { padding: 20 },
  inputGroup: { marginBottom: 16 },
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
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorDisabled: { backgroundColor: "#f0f0f0", borderColor: "#eee" },
  selectorText: { fontSize: 15, color: "#111", flex: 1 },
  selectorPlaceholder: { color: "#aaa" },
  textArea: { height: 80, textAlignVertical: "top" },
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
  cancelText: { color: "#555", fontWeight: "bold", fontSize: 15 },
  saveBtn: {
    flex: 1,
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
  },
  saveBtnDisabled: { backgroundColor: "#FFA366", opacity: 0.7 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
