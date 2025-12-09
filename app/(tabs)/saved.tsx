import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_PADDING = 16;
const CARD_GAP = 12;

// Calculate card width based on screen size
const getCardWidth = () => {
  if (width < 768) return width - CARD_PADDING * 2; // Mobile: 1 column
  if (width < 1024) return (width - CARD_PADDING * 2 - CARD_GAP) / 2; // Tablet: 2 columns
  return (width - CARD_PADDING * 2 - CARD_GAP * 2) / 3; // Desktop: 3 columns
};

const Saved = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const categories = ["all", "clothing", "electronics", "home", "accessories"];

  const savedProducts = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      category: "electronics",
      savedDate: "2 days ago",
    },
    {
      id: "2",
      name: "Minimalist Watch",
      price: 159.0,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      category: "accessories",
      savedDate: "1 week ago",
    },
    {
      id: "3",
      name: "Leather Backpack",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "accessories",
      savedDate: "3 days ago",
    },
    {
      id: "4",
      name: "Ceramic Vase Set",
      price: 45.0,
      image:
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop",
      category: "home",
      savedDate: "5 days ago",
    },
    {
      id: "5",
      name: "Cotton T-Shirt",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      category: "clothing",
      savedDate: "1 day ago",
    },
    {
      id: "6",
      name: "Smart Speaker",
      price: 99.99,
      image:
        "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop",
      category: "electronics",
      savedDate: "4 days ago",
    },
  ];

  const filteredProducts = savedProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cardWidth = getCardWidth();

  const renderGridItem = ({ item }) => (
    <View style={[styles.gridCard, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <TouchableOpacity style={styles.heartButton}>
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.savedDate}>Saved {item.savedDate}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderListItem = ({ item }) => (
    <View style={styles.listCard}>
      <Image source={{ uri: item.image }} style={styles.listImage} />
      <View style={styles.listContent}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.savedDate}>Saved {item.savedDate}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.listActions}>
        <TouchableOpacity style={styles.heartButtonSmall}>
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButtonSmall}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Saved Items</Text>
            <Text style={styles.subtitle}>{filteredProducts.length} items</Text>
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "grid" && styles.toggleButtonActive,
              ]}
              onPress={() => setViewMode("grid")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "grid" && styles.toggleTextActive,
                ]}
              >
                Grid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === "list" && styles.toggleButtonActive,
              ]}
              onPress={() => setViewMode("list")}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewMode === "list" && styles.toggleTextActive,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>No saved items found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={viewMode === "grid" ? renderGridItem : renderListItem}
          keyExtractor={(item) => item.id}
          numColumns={
            viewMode === "grid" ? (width < 768 ? 1 : width < 1024 ? 2 : 3) : 1
          }
          key={viewMode === "grid" ? "grid" : "list"}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={
            viewMode === "grid" && width >= 768 ? styles.columnWrapper : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: CARD_PADDING,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#111827",
  },
  toggleText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
  searchInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    color: "#111827",
  },
  categoriesContainer: {
    marginBottom: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#111827",
  },
  categoryText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    padding: CARD_PADDING,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  gridCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: CARD_GAP,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartIcon: {
    fontSize: 16,
  },
  cardContent: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  savedDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: CARD_GAP,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  listContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  listActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heartButtonSmall: {
    padding: 4,
  },
  addButtonSmall: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default Saved;
