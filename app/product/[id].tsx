import ParallaxScrollView from "@/components/ParallaxScrollView";
import AppBar from "@/components/ui/AppBar";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const COLORS = ["#A5071A", "#000", "#123F9F", "#9F5A23", "#E0E0E0"];

const PRODUCT_IMAGES = [
  require("../../assets/images/image.png"),
  require("../../assets/images/image1.png"),
  require("../../assets/images/image.png"),
  require("../../assets/images/image1.png"),
];

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    name: "Smart Watch Pro",
    price: 299.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
  {
    id: 2,
    name: "Bluetooth Speaker",
    price: 149.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
  },
  {
    id: 3,
    name: "Laptop Stand",
    price: 79.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  },
  {
    id: 4,
    name: "Wireless Mouse",
    price: 59.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
  },
];

const ProductDetails = () => {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc"
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const vendor = {
    name: "Tariqul Islam",
    verified: true,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppBar title="" cartCount={5} />

      <ParallaxScrollView
        headerBackgroundColor={{ light: "#F8F9FB", dark: "#1D3D47" }}
      >
        {/* Main Product Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.mainImage}
            contentFit="contain"
            source={PRODUCT_IMAGES[selectedImageIndex]}
          />
        </View>

        {/* Thumbnail Images */}
        <View style={styles.thumbnailContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailList}
          >
            {PRODUCT_IMAGES.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnailWrapper,
                  selectedImageIndex === index && styles.selectedThumbnail,
                ]}
              >
                <Image
                  style={styles.thumbnailImage}
                  contentFit="cover"
                  source={image}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.container}>
          {/* Product Info */}
          <Text style={styles.title}>Wireless Headphone</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.price}>$520.00</Text>
            <View style={styles.row}>
              <Icon
                name={vendor.verified ? "shield-checkmark" : "shield-outline"}
                size={18}
                color={vendor.verified ? "#22C55E" : "#EF4444"}
              />
              <Text style={styles.seller}>
                Seller: <Text style={styles.bold}>{vendor.name}</Text>
              </Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>4.8</Text>
            <Text style={styles.reviewCount}>(320 Reviews)</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Key Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name="battery-charging" size={20} color="#FF6B00" />
              </View>
              <Text style={styles.featureLabel}>20h Battery</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name="wifi" size={20} color="#FF6B00" />
              </View>
              <Text style={styles.featureLabel}>Bluetooth 5.2</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name="water" size={20} color="#FF6B00" />
              </View>
              <Text style={styles.featureLabel}>Waterproof</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Icon name="volume-high" size={20} color="#FF6B00" />
              </View>
              <Text style={styles.featureLabel}>Noise Cancel</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab("desc")}>
              <Text
                style={[styles.tab, activeTab === "desc" && styles.activeTab]}
              >
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("specs")}>
              <Text
                style={[styles.tab, activeTab === "specs" && styles.activeTab]}
              >
                Specifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("reviews")}>
              <Text
                style={[
                  styles.tab,
                  activeTab === "reviews" && styles.activeTab,
                ]}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContentContainer}>
            {activeTab === "desc" && (
              <Text style={styles.tabContent}>
                Experience crystal-clear sound and deep bass with our premium
                wireless headphones. Engineered with advanced noise cancellation
                technology, these headphones deliver an immersive audio
                experience whether you're traveling, working, or working out.
                The ergonomic design ensures all-day comfort.
              </Text>
            )}
            {activeTab === "specs" && (
              <View style={styles.specsContainer}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Bluetooth</Text>
                  <Text style={styles.specValue}>5.2</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Battery Life</Text>
                  <Text style={styles.specValue}>20 hours</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Charging</Text>
                  <Text style={styles.specValue}>USB-C Fast Charge</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Water Resistance</Text>
                  <Text style={styles.specValue}>IPX5</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Driver Size</Text>
                  <Text style={styles.specValue}>40mm</Text>
                </View>
              </View>
            )}
            {activeTab === "reviews" && (
              <Text style={styles.tabContent}>
                User reviews will appear here.
              </Text>
            )}
          </View>

          {/* Recommended Section */}
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
              {RECOMMENDED_PRODUCTS.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.recommendedCard}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.recommendedImage}
                  />
                  <View style={styles.recommendedInfo}>
                    <Text style={styles.recommendedName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.recommendedFooter}>
                      <Text style={styles.recommendedPrice}>
                        ${product.price}
                      </Text>
                      <View style={styles.recommendedRating}>
                        <Icon name="star" size={12} color="#F59E0B" />
                        <Text style={styles.recommendedRatingText}>
                          {product.rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ParallaxScrollView>

      {/* Fixed Add to Cart Row */}
      <View style={styles.cartRow}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Icon name="remove" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Icon name="add" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    marginBottom: 90,
  },
  imageContainer: {
    backgroundColor: "#F8F9FB",
    paddingVertical: 20,
    alignItems: "center",
  },
  mainImage: {
    height: 280,
    width: width - 32,
  },
  thumbnailContainer: {
    backgroundColor: "#F8F9FB",
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  thumbnailList: {
    gap: 8,
    paddingHorizontal: 4,
  },
  thumbnailWrapper: {
    width: 70,
    height: 70,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: "transparent",
    // backgroundColor: "#fff",
    overflow: "hidden",
    // padding: 4,
  },
  selectedThumbnail: {
    borderColor: "#FF6B00",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF6B00",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seller: {
    fontSize: 13,
    color: "#6B7280",
  },
  bold: {
    fontWeight: "600",
    color: "#111",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  ratingText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111",
  },
  reviewCount: {
    color: "#6B7280",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontWeight: "600",
  },
  activeTab: {
    color: "#FF6B00",
    fontWeight: "700",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  tabContentContainer: {
    marginBottom: 24,
  },
  tabContent: {
    color: "#4B5563",
    lineHeight: 22,
    fontSize: 14,
  },
  specsContainer: {
    gap: 12,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  specLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  specValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  recommendedSection: {
    marginTop: 8,
    marginBottom: 100,
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: "600",
  },
  recommendedList: {
    gap: 12,
    paddingRight: 16,
  },
  recommendedCard: {
    width: 160,
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    overflow: "hidden",
  },
  recommendedImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#E5E7EB",
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
    height: 36,
  },
  recommendedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6B00",
  },
  recommendedRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111",
  },
  cartRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  cartButton: {
    backgroundColor: "#FF6B00",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
