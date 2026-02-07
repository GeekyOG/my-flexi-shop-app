import Search from "@/components/home/Search";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CategoriesGrid from "@/components/store/CategoriesGrid";
import CategoryList from "@/components/store/CategoriesList";
import * as React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton } from "react-native-paper";
import { useGetCategoriesQuery } from "../api/categoriesApi";
import { useGetProductsQuery } from "../api/productsApi";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;
const isDesktop = width >= 1024;

export default function StoreScreen() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [pageSize, setPageSize] = React.useState(12);
  const [showFilters, setShowFilters] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  // Filter states
  const [filters, setFilters] = React.useState({
    vendorId: "",
    minPrice: "",
    maxPrice: "",
  });

  const scrollViewRef = React.useRef<ScrollView>(null);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery({
      page: 1,
      size: 1000,
      search: "",
    });

  const categories = [
    { name: "All" },
    ...(categoriesData?.items).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
    })),
  ];
  // Fetch products with all filters
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching,
  } = useGetProductsQuery({
    page: 1,
    size: pageSize,
    search: searchQuery,
    categoryId:
      selectedCategory && selectedCategory !== "All"
        ? categories.find((item) => item.name === selectedCategory).id
        : undefined,
    vendorId: filters.vendorId || undefined,
    minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
  });

  console.log(categories, selectedCategory);

  const products = productsData?.items || [];
  const totalProducts = productsData?.total || 0;
  const hasMore = products.length < totalProducts;

  // Handle scroll to detect bottom
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && hasMore && !isFetching && !isLoadingMore) {
      loadMore();
    }
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setPageSize((prev) => prev + 30);
      setIsLoadingMore(false);
    }, 300);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setPageSize(12); // Reset page size on category change
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPageSize(12); // Reset page size on search
  };

  const applyFilters = () => {
    setPageSize(12); // Reset page size on filter apply
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      vendorId: "",
      minPrice: "",
      maxPrice: "",
    });
    setPageSize(12);
  };

  const activeFiltersCount = [
    filters.vendorId,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <ParallaxScrollView
      customStyle={{ paddingHorizontal: 0 }}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      {/* Search Section */}
      <View style={styles.searchWrapper}>
        <Search onSearch={handleSearch} />
      </View>

      {/* Main Layout */}
      <View style={styles.layoutContainer}>
        {/* Category Sidebar - Only show on tablet/desktop */}
        {isTablet && (
          <View style={styles.sidebar}>
            {categoriesLoading ? (
              <View style={styles.skeletonContainer}>
                {[...Array(6)].map((_, i) => (
                  <View key={i} style={styles.skeletonCategory} />
                ))}
              </View>
            ) : (
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}
          </View>
        )}

        {/* Product Section */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.contentScroll}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {/* Mobile Category Chips */}
          {!isTablet && (
            <View>
              {categoriesLoading ? (
                <View style={styles.mobileCategoryContent}>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={styles.skeletonChip} />
                  ))}
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.mobileCategoryScroll}
                  contentContainerStyle={styles.mobileCategoryContent}
                >
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleCategorySelect(category.name)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.categoryChip,
                          selectedCategory === category.name &&
                            styles.categoryChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            selectedCategory === category.name &&
                              styles.categoryChipTextActive,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Header Row with Filters */}
          <View style={styles.sectionHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.sectionHeaderText}>ALL PRODUCTS</Text>
              <Text style={styles.sectionSubtext}>
                {searchQuery
                  ? `Search results for "${searchQuery}"`
                  : selectedCategory === "All"
                    ? `${totalProducts} items available`
                    : `${totalProducts} items in ${selectedCategory}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              style={styles.filterButton}
              activeOpacity={0.7}
            >
              <IconButton icon="tune-vertical" iconColor="#DB3022" size={24} />
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <View style={styles.activeFilters}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.activeFiltersContent}
              >
                {filters.vendorId && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      Vendor: {filters.vendorId}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setFilters({ ...filters, vendorId: "" })}
                    >
                      <Text style={styles.filterTagClose}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.minPrice && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      Min: ${filters.minPrice}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setFilters({ ...filters, minPrice: "" })}
                    >
                      <Text style={styles.filterTagClose}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {filters.maxPrice && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      Max: ${filters.maxPrice}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setFilters({ ...filters, maxPrice: "" })}
                    >
                      <Text style={styles.filterTagClose}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  onPress={clearFilters}
                  style={styles.clearFiltersButton}
                >
                  <Text style={styles.clearFiltersText}>Clear all</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}

          {/* Product Grids */}
          <CategoriesGrid
            title="FEATURED PRODUCTS"
            icon=""
            products={products}
            isLoading={productsLoading && pageSize === 12}
          />

          {/* Load More Indicator */}
          {isLoadingMore && hasMore && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="large" color="#DB3022" />
              <Text style={styles.loadMoreText}>Loading more products...</Text>
            </View>
          )}

          {/* End of List Message */}
          {!hasMore && products.length > 0 && (
            <View style={styles.endOfListContainer}>
              <Text style={styles.endOfListText}>
                You&apos;ve reached the end of the list
              </Text>
            </View>
          )}

          {/* No Results */}
          {!productsLoading && products.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No products found</Text>
              <Text style={styles.noResultsSubtext}>
                Try adjusting your filters or search
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <IconButton icon="close" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Vendor ID Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Vendor ID</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Enter vendor ID"
                  value={filters.vendorId}
                  onChangeText={(text) =>
                    setFilters({ ...filters, vendorId: text })
                  }
                  placeholderTextColor="#999"
                />
              </View>

              {/* Price Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <View style={styles.priceRow}>
                  <TextInput
                    style={[styles.filterInput, styles.priceInput]}
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChangeText={(text) =>
                      setFilters({ ...filters, minPrice: text })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.priceSeparator}>—</Text>
                  <TextInput
                    style={[styles.filterInput, styles.priceInput]}
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChangeText={(text) =>
                      setFilters({ ...filters, maxPrice: text })
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={clearFilters}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFilters}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  layoutContainer: {
    flexDirection: "row",
    flex: 1,
    gap: isDesktop ? 24 : 16,
    paddingHorizontal: isTablet ? 16 : 0,
  },
  sidebar: {
    width: isDesktop ? 250 : 200,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: isTablet ? 0 : 16,
  },
  mobileCategoryScroll: {
    marginBottom: 20,
    maxHeight: 45,
  },
  mobileCategoryContent: {
    gap: 8,
    paddingRight: 16,
    flexDirection: "row",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#DB3022",
    borderColor: "#DB3022",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
  },
  sectionHeaderText: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "700",
    color: "#222",
    letterSpacing: 0.5,
  },
  sectionSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  filterButton: {
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#DB3022",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  activeFilters: {
    marginBottom: 16,
  },
  activeFiltersContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  filterTagText: {
    fontSize: 13,
    color: "#333",
    marginRight: 4,
  },
  filterTagClose: {
    fontSize: 20,
    color: "#666",
    paddingHorizontal: 4,
  },
  clearFiltersButton: {
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    fontSize: 13,
    color: "#DB3022",
    fontWeight: "600",
  },
  loadMoreContainer: {
    paddingVertical: 30,
    alignItems: "center",
    gap: 12,
  },
  loadMoreText: {
    fontSize: 14,
    color: "#666",
  },
  endOfListContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  endOfListText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  noResultsContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    fontSize: 16,
    color: "#999",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DB3022",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DB3022",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#DB3022",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  skeletonContainer: {
    gap: 12,
    padding: 16,
  },
  skeletonCategory: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  skeletonChip: {
    width: 80,
    height: 36,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
});
