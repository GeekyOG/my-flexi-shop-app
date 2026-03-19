import ParallaxScrollView from "@/components/ParallaxScrollView";
import AppBar from "@/components/ui/AppBar";
import { formatCurrency } from "@/utils/storage";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { useAddToCartMutation, useGetCartQuery } from "../api/cartApi";
import { useGetProductQuery, useGetProductsQuery } from "../api/productsApi";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../api/wishlistApi"; // adjust import path as needed

const { width } = Dimensions.get("window");

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );
  const [wishlistAnim] = useState(new Animated.Value(1));

  const { id } = useLocalSearchParams();

  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isWishlisting }] =
    useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const { data: productData } = useGetProductQuery(id);
  const { data: wishlistData, refetch: refetchWishlist } = useGetWishlistQuery(
    {},
  );
  const { data: categoryProducts } = useGetProductsQuery({
    categoryId: productData?.data?.category?.id ?? "",
  });

  const product = productData?.data;

  // Check if product is already in wishlist
  const isWishlisted = wishlistData?.data?.some(
    (item: any) =>
      item.productId === product?.id || item.product?.id === product?.id,
  );

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product?.id, quantity }).unwrap();
      Toast.show({
        type: "success",
        text1: "Added to Cart! 🛒",
        text2: `${product?.name} (${quantity} ${quantity > 1 ? "items" : "item"})`,
        position: "bottom",
        visibilityTime: 3000,
        autoHide: true,
        bottomOffset: 100,
      });
      setQuantity(1);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Add to Cart",
        text2:
          error?.data?.message || "Something went wrong. Please try again.",
        position: "bottom",
        visibilityTime: 4000,
        bottomOffset: 100,
      });
    }
  };

  const handleWishlistToggle = async () => {
    // Bounce animation
    Animated.sequence([
      Animated.spring(wishlistAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 30,
      }),
      Animated.spring(wishlistAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();

    try {
      if (isWishlisted) {
        const wishlistItem = wishlistData?.data?.find(
          (item: any) =>
            item.productId === product?.id || item.product?.id === product?.id,
        );
        await removeFromWishlist(wishlistItem?.id).unwrap();
        Toast.show({
          type: "info",
          text1: "Removed from Wishlist",
          text2: product?.name,
          position: "bottom",
          visibilityTime: 2500,
          bottomOffset: 100,
        });
      } else {
        await addToWishlist({ productId: product?.id }).unwrap();

        Toast.show({
          type: "success",
          text1: "Saved to Wishlist! 💛",
          text2: product?.name,
          position: "bottom",
          visibilityTime: 2500,
          bottomOffset: 100,
        });
      }
      refetchWishlist();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Wishlist Error",
        text2: error?.data?.message || "Something went wrong.",
        position: "bottom",
        visibilityTime: 3000,
        bottomOffset: 100,
      });
    }
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(
        product?.images?.find(
          (image: { isDisplay: boolean; id: number }) =>
            image.isDisplay === true,
        ).id,
      );
    }
  }, [product]);

  const vendor = product?.vendor;
  const { data: cartData } = useGetCartQuery({});

  const stockCount = Number(product?.quantity ?? 0);
  const isLowStock = stockCount > 0 && stockCount <= 5;
  const isOutOfStock = stockCount === 0;
  console.log(product?.id, "product?.id");
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* AppBar sits inside SafeAreaView — top inset handled */}
      <AppBar title="" cartCount={cartData?.data?.itemCount ?? 0} />

      <View style={{ flex: 1 }}>
        <ParallaxScrollView
          headerBackgroundColor={{ light: "#F8F9FB", dark: "#1D3D47" }}
        >
          {/* ── Main Image ── */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.mainImage}
              contentFit="contain"
              source={
                selectedImageIndex === 0
                  ? `https://flexi.aoudit.com/api/v1/product-images/product/${product?.id}/display`
                  : `https://flexi.aoudit.com/api/v1/product-images/${selectedImageIndex}`
              }
            />
            {/* Wishlist heart floating on image */}
            <Animated.View
              style={[
                styles.wishlistFloating,
                { transform: [{ scale: wishlistAnim }] },
              ]}
            >
              <TouchableOpacity
                onPress={handleWishlistToggle}
                disabled={isWishlisting}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon
                  name={isWishlisted ? "heart" : "heart-outline"}
                  size={22}
                  color={isWishlisted ? "#FF6B00" : "#6B7280"}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* ── Thumbnails ── */}
          <View style={styles.thumbnailContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailList}
            >
              {productData?.data?.images.map(
                (image: { id: number }, index: number) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImageIndex(image.id)}
                    style={[
                      styles.thumbnailWrapper,
                      selectedImageIndex === image?.id &&
                        styles.selectedThumbnail,
                    ]}
                  >
                    <Image
                      style={styles.thumbnailImage}
                      contentFit="cover"
                      source={`https://flexi.aoudit.com/api/v1/product-images/${image?.id}`}
                    />
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
          </View>

          <View style={styles.container}>
            {/* ── Product Name + Stock Badge ── */}
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>
                {product?.name}
              </Text>
              {isOutOfStock ? (
                <View style={[styles.stockBadge, styles.stockOut]}>
                  <Text style={styles.stockBadgeText}>Out of Stock</Text>
                </View>
              ) : isLowStock ? (
                <View style={[styles.stockBadge, styles.stockLow]}>
                  <Text style={styles.stockBadgeText}>
                    Only {stockCount} left
                  </Text>
                </View>
              ) : null}
            </View>

            {/* ── Price + Seller ── */}
            <View style={styles.rowBetween}>
              <Text style={styles.price}>
                ₦{formatCurrency(Number(product?.price))}
              </Text>
              <TouchableOpacity
                style={styles.sellerChip}
                onPress={() => router.push(`/vendor/${vendor?.id}`)}
              >
                <Icon
                  name={
                    vendor?.verified ? "shield-checkmark" : "shield-outline"
                  }
                  size={14}
                  color={vendor?.verified ? "#22C55E" : "#EF4444"}
                />
                <Text style={styles.sellerText} numberOfLines={1}>
                  {vendor?.businessName}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Rating ── */}
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name={star <= 4 ? "star" : "star-half"}
                  size={15}
                  color="#F59E0B"
                />
              ))}
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewCount}>· 320 Reviews</Text>
            </View>

            <View style={styles.divider} />

            {/* ── Tabs ── */}
            <View style={styles.tabContainer}>
              {(["desc", "specs", "reviews"] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[
                    styles.tabPill,
                    activeTab === tab && styles.tabPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab === "desc"
                      ? "Description"
                      : tab === "specs"
                        ? "Specs"
                        : "Reviews"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Tab Content ── */}
            <View style={styles.tabContentContainer}>
              {activeTab === "desc" && (
                <Text style={styles.tabContent}>
                  {product?.description ?? ""}
                </Text>
              )}
              {activeTab === "specs" && (
                <View style={styles.specsContainer}>
                  {[
                    ["Bluetooth", "5.2"],
                    ["Battery Life", "20 hours"],
                    ["Charging", "USB-C Fast Charge"],
                    ["Water Resistance", "IPX5"],
                    ["Driver Size", "40mm"],
                  ].map(([label, value], i) => (
                    <View
                      key={i}
                      style={[styles.specRow, i % 2 === 0 && styles.specRowAlt]}
                    >
                      <Text style={styles.specLabel}>{label}</Text>
                      <Text style={styles.specValue}>{value}</Text>
                    </View>
                  ))}
                </View>
              )}
              {activeTab === "reviews" && (
                <View style={styles.emptyReviews}>
                  <Icon
                    name="chatbubble-ellipses-outline"
                    size={40}
                    color="#D1D5DB"
                  />
                  <Text style={styles.emptyReviewsText}>No reviews yet</Text>
                </View>
              )}
            </View>

            {/* ── You May Also Like ── */}
            <View style={styles.recommendedSection}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>You May Also Like</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
              >
                {categoryProducts?.items.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recommendedCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image
                      source={`https://flexi.aoudit.com/api/v1/product-images/product/${item?.id}/display`}
                      style={styles.recommendedImage}
                    />
                    <View style={styles.recommendedInfo}>
                      <Text style={styles.recommendedName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.recommendedPrice}>
                        ₦{formatCurrency(item.price ?? 0)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ParallaxScrollView>

        {/* ── Fixed Bottom Bar ── */}
        <View style={styles.bottomBar}>
          {/* Qty */}
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.qtyBtn}
            >
              <Icon name="remove" size={18} color="#FF6B00" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                if (stockCount > quantity) setQuantity(quantity + 1);
              }}
              style={styles.qtyBtn}
            >
              <Icon name="add" size={18} color="#FF6B00" />
            </TouchableOpacity>
          </View>

          {/* Wishlist button */}
          <TouchableOpacity
            style={[
              styles.wishlistBtn,
              isWishlisted && styles.wishlistBtnActive,
            ]}
            onPress={handleWishlistToggle}
            disabled={isWishlisting}
          >
            <Icon
              name={isWishlisted ? "heart" : "heart-outline"}
              size={20}
              color={isWishlisted ? "#fff" : "#FF6B00"}
            />
            <Text
              style={[
                styles.wishlistBtnText,
                isWishlisted && styles.wishlistBtnTextActive,
              ]}
            >
              {isWishlisted ? "Saved" : "Save"}
            </Text>
          </TouchableOpacity>

          {/* Add to Cart button */}
          <TouchableOpacity
            style={[
              styles.cartButton,
              (isLoading || isOutOfStock) && styles.cartButtonDisabled,
            ]}
            disabled={isLoading || isOutOfStock}
            onPress={handleAddToCart}
          >
            <Icon name="cart-outline" size={20} color="#fff" />
            <Text style={styles.cartText}>
              {isOutOfStock
                ? "Out of Stock"
                : isLoading
                  ? "Adding..."
                  : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // ── Images ──
  imageContainer: {
    backgroundColor: "#F8F9FB",
    paddingVertical: 20,
    alignItems: "center",
    position: "relative",
  },
  mainImage: {
    height: 280,
    width: width - 32,
  },
  wishlistFloating: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbnailContainer: {
    backgroundColor: "#F8F9FB",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  thumbnailList: { gap: 8, paddingHorizontal: 4 },
  thumbnailWrapper: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  selectedThumbnail: {
    borderColor: "#FF6B00",
  },
  thumbnailImage: { width: "100%", height: "100%", borderRadius: 8 },

  // ── Content ──
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    lineHeight: 26,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 2,
  },
  stockOut: { backgroundColor: "#FEE2E2" },
  stockLow: { backgroundColor: "#FEF9C3" },
  stockBadgeText: { fontSize: 11, fontWeight: "700", color: "#92400E" },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FF6B00",
    letterSpacing: -0.5,
  },
  sellerChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: 160,
  },
  sellerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 16,
  },
  ratingText: { fontWeight: "700", fontSize: 14, color: "#111", marginLeft: 4 },
  reviewCount: { color: "#9CA3AF", fontSize: 13 },

  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 16 },

  // ── Tabs ──
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  tabPillActive: {
    backgroundColor: "#FF6B00",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#fff",
  },
  tabContentContainer: { marginBottom: 24 },
  tabContent: { color: "#4B5563", lineHeight: 22, fontSize: 14 },
  specsContainer: { gap: 4 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  specRowAlt: { backgroundColor: "#F9FAFB" },
  specLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  specValue: { fontSize: 14, color: "#111", fontWeight: "600" },
  emptyReviews: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyReviewsText: { color: "#9CA3AF", fontSize: 14 },

  // ── Recommended ──
  recommendedSection: { marginTop: 8, marginBottom: 16 },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  recommendedTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  seeAllText: { fontSize: 13, color: "#FF6B00", fontWeight: "600" },
  recommendedList: { gap: 12, paddingRight: 16 },
  recommendedCard: {
    width: 150,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    overflow: "hidden",
  },
  recommendedImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#E5E7EB",
  },
  recommendedInfo: { padding: 10 },
  recommendedName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
    lineHeight: 18,
    height: 36,
  },
  recommendedPrice: { fontSize: 15, fontWeight: "700", color: "#FF6B00" },

  // ── Bottom Bar ──
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4ED",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 8,
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 22,
    textAlign: "center",
    color: "#111",
  },
  wishlistBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF6B00",
    backgroundColor: "#fff",
  },
  wishlistBtnActive: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },
  wishlistBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B00",
  },
  wishlistBtnTextActive: {
    color: "#fff",
  },
  cartButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FF6B00",
    paddingVertical: 13,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartButtonDisabled: {
    backgroundColor: "#FCA572",
    shadowOpacity: 0,
    elevation: 0,
  },
  cartText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
