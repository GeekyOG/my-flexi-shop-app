// app/(tabs)/store.tsx
import ParallaxScrollView from "@/components/ParallaxScrollView";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Surface, Text } from "react-native-paper";

export default function StoreScreen() {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View style={styles.container}>
        {/* Trigger Button */}
        <Button mode="contained" onPress={showModal}>
          Select Size
        </Button>

        {/* Bottom Sheet Modal */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            <Text style={styles.title}>Select size</Text>

            <View style={styles.sizes}>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <Surface key={size} style={styles.sizeBox}>
                  <Text>{size}</Text>
                </Surface>
              ))}
            </View>

            <Button
              mode="contained"
              onPress={hideModal}
              style={styles.addToCart}
              buttonColor="red"
            >
              ADD TO CART
            </Button>
          </Modal>
        </Portal>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: -40,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sizes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sizeBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "28%",
  },
  addToCart: {
    borderRadius: 30,
    paddingVertical: 5,
  },
});
