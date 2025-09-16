import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";

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
      <Pressable style={{ width: itemWidth }} onPress={showModal}>
        <View className="rounded-md overflow-hidden ">
          <Image
            style={{ height: 150, width: "100%" }}
            contentFit="cover"
            className=""
            source={require("../../assets/images/image.png")}
          />
        </View>

        <Text className="text-[0.865rem] text-neutral-400">
          {product.name.length > 20
            ? product.name.substring(0, 20) + "..."
            : product.name}
        </Text>
        <Text className="text-[1rem] text-neutral-700 font-[500]">
          N {product.price}
        </Text>
      </Pressable>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <View className="pb-6">
            <Text className="text-[1.5rem] text-center font-bold pb-3">
              {product.name}
            </Text>

            <View className="pb-5">
              <Text className="text-[0.865rem] text-neutral-500">
                {product.description}
              </Text>
              <Text className="font-[700] py-2 text-[1.25rem]">
                N{product.price}
              </Text>
            </View>

            <View className="flex- justify-between gap-3">
              <Button
                mode="contained"
                onPress={hideModal}
                buttonColor={"#DB3022"}
              >
                <Text className="text-neutral-50"> ADD TO CART</Text>
              </Button>
              <Button
                mode="contained"
                onPress={() => {
                  router.push("/product/9");
                  hideModal();
                }}
                buttonColor={"#ec762c"}
              >
                <Text className="text-neutral-50"> VIEW DETAILS</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default ProductCard;

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
});
