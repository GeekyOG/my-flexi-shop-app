import AppBar from "@/components/ui/AppBar";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import Icon from "react-native-vector-icons/Ionicons";

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export default function AddressScreen() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Home",
      address: "12 Lekki Phase 1, Lagos, Nigeria",
      isDefault: true,
    },
    {
      id: "2",
      label: "Office",
      address: "7A Banana Island, Lagos",
      isDefault: false,
    },
  ]);

  const [selected, setSelected] = useState("1");
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const navigation = useRouter();

  const handleAddAddress = () => {
    if (!newLabel || !newAddress) return;

    const newItem: Address = {
      id: Date.now().toString(),
      label: newLabel,
      address: newAddress,
    };

    setAddresses((prev) => [...prev, newItem]);
    setSelected(newItem.id);
    setShowModal(false);
    setNewLabel("");
    setNewAddress("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppBar title="Delivery Address" />

        {/* Saved Address List */}
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, selected === item.id && styles.activeCard]}
              onPress={() => setSelected(item.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.address}>{item.address}</Text>
              </View>
              {selected === item.id && (
                <Icon name="checkmark-circle" size={22} color="#ff6600" />
              )}
            </TouchableOpacity>
          )}
        />

        {/* Add Address Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowModal(true)}
        >
          <Icon name="add-circle-outline" size={22} color="#ff6600" />
          <Text style={styles.addText}>Add New Address</Text>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => navigation.push("/checkout/PaymentScreen")}
        >
          <Text style={styles.nextText}>Continue to Payment</Text>
        </TouchableOpacity>

        {/* Add Address Modal */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Address</Text>

              <TextInput
                placeholder="Label (e.g., Home, Office)"
                style={styles.input}
                value={newLabel}
                onChangeText={setNewLabel}
              />
              <TextInput
                placeholder="Full Address"
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                value={newAddress}
                onChangeText={setNewAddress}
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleAddAddress}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginBottom: 10,
  },
  activeCard: { borderColor: "#ff6600", borderWidth: 1 },
  label: { fontSize: 16, fontWeight: "bold" },
  address: { color: "#666", marginTop: 4 },
  addBtn: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addText: { marginLeft: 6, color: "#ff6600", fontWeight: "bold" },
  nextBtn: {
    backgroundColor: "#ff6600",
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "bold" },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelText: { color: "#555", fontWeight: "bold" },
  saveBtn: {
    flex: 1,
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 50,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
