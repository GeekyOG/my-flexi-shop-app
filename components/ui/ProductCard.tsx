import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ProductCardProps {
  product: {
    name: string;
    price: string;
    description: string;
  };

  itemWidth: number;
}

const ProductCard = ({ product, itemWidth }: ProductCardProps) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  return (
    <>
      <Pressable
        style={{ width: itemWidth, position: "relative" }}
        onPress={() => router.push("/product/9")}
      >
        <View style={styles.imageContainer}>
          <Image
            style={{ height: 150, width: "100%" }}
            contentFit="cover"
            source={require("../../assets/images/image.png")}
          />
        </View>

        <Text style={styles.productName}>
          {product.name.length > 15
            ? product.name.substring(0, 15) + "..."
            : product.name}
        </Text>

        <Text style={styles.productPrice}>N {product.price}</Text>
      </Pressable>

      {/* <View>
        <View style={styles.modal}>
          <View style={styles.modalPadding}>
            <Text style={styles.modalTitle}>{product.name}</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalDescription}>{product.description}</Text>
              <Text style={styles.modalPrice}>N{product.price}</Text>
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={hideModal}>
                <Text style={styles.actionText}> ADD TO CART</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/product/9");
                  hideModal();
                }}
              >
                <Text style={styles.actionText}> VIEW DETAILS</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View> */}
    </>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  productName: {
    fontSize: 14,
    color: "#a3a3a3", // neutral-400
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#404040", // neutral-700
    fontWeight: "500",
    marginBottom: 8,
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
  modalPadding: {
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    paddingBottom: 12,
  },
  modalSection: {
    paddingBottom: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: "#737373", // neutral-500
  },
  modalPrice: {
    fontWeight: "700",
    paddingVertical: 8,
    fontSize: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionText: {
    color: "#fafafa", // neutral-50
  },
});
