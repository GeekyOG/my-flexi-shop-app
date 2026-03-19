// app/(tabs)/saved.tsx
import { formatCurrency } from "@/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useGetWishlistQuery,
  useMoveToCartMutation,
  useRemoveFromWishlistMutation,
} from "../api/wishlistApi";

// ── Constants ─────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get("window");
const H_PAD = 16;
const COL_GAP = 10;
// Always 2-column grid on mobile; 3 on tablet
const NUM_COLS = SCREEN_W >= 768 ? 3 : 2;
const CARD_W = (SCREEN_W - H_PAD * 2 - COL_GAP * (NUM_COLS - 1)) / NUM_COLS;

const IMAGE_BASE = "https://flexi.aoudit.com/api/v1/product-images";

// ── Types ─────────────────────────────────────────────────────

interface WishlistItem {
  id: string;
  savedDate?: string;
  product: {
    id: string;
    name: string;
    price: number;
    category?: { name: string };
  };
}

// ── Product card ──────────────────────────────────────────────

// eslint-disable-next-line react/display-name
const ProductCard = React.memo(
  ({
    item,
    onRemove,
    onMoveToCart,
    isRemoving,
    isMoving,
  }: {
    item: WishlistItem;
    onRemove: () => void;
    onMoveToCart: () => void;
    isRemoving: boolean;
    isMoving: boolean;
  }) => {
    return (
      <View style={[card.wrap, { width: CARD_W }]}>
        {/* Image */}
        <View style={card.imgWrap}>
          <Image
            source={`${IMAGE_BASE}/${item.product.id}`}
            style={card.img}
            contentFit="cover"
            transition={200}
          />

          {/* Remove button — always visible, top-right */}
          <TouchableOpacity
            style={card.removeBtn}
            onPress={onRemove}
            disabled={isRemoving}
            hitSlop={6}
            activeOpacity={0.75}
          >
            {isRemoving ? (
              <ActivityIndicator size={12} color="#DC2626" />
            ) : (
              <Ionicons name="close" size={14} color="#DC2626" />
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={card.body}>
          <Text style={card.name} numberOfLines={2}>
            {item.product.name}
          </Text>

          <View style={card.footer}>
            <Text style={card.price}>
              ₦{formatCurrency(item.product.price)}
            </Text>
            <TouchableOpacity
              style={[card.cartBtn, isMoving && card.cartBtnBusy]}
              onPress={onMoveToCart}
              disabled={isMoving}
              activeOpacity={0.8}
            >
              {isMoving ? (
                <ActivityIndicator size={12} color="#fff" />
              ) : (
                <Ionicons name="bag-add-outline" size={14} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

const card = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: COL_GAP,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  imgWrap: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F3F4F6",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
      },
      android: { elevation: 3 },
    }),
  },
  body: {
    padding: 10,
    gap: 6,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 17,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    flexShrink: 1,
  },
  cartBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  cartBtnBusy: {
    backgroundColor: "#9CA3AF",
  },
});

// ── Main screen ───────────────────────────────────────────────

const Saved = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Per-item loading states
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [movingIds, setMovingIds] = useState<Set<string>>(new Set());

  const {
    data: wishlistData,
    isLoading,
    isFetching,
    refetch,
  } = useGetWishlistQuery({});

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();

  const allItems: WishlistItem[] = wishlistData?.data ?? [];

  // Build category list
  const categories = [
    "All",
    ...Array.from(
      new Set(allItems.map((i) => i.product?.category?.name ?? "Other")),
    ),
  ];

  // Filter
  const filtered = allItems.filter((item) => {
    const matchSearch = item.product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCat =
      activeCategory === "All" ||
      (item.product?.category?.name ?? "Other") === activeCategory;
    return matchSearch && matchCat;
  });

  // ── Handlers ─────────────────────────────────────────────────

  const handleRemove = useCallback(
    async (id: string, name: string) => {
      Alert.alert("Remove Item", `Remove "${name}" from your saved items?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setRemovingIds((prev) => new Set(prev).add(id));
            try {
              await removeFromWishlist(id).unwrap();
            } catch {
              Alert.alert("Error", "Could not remove item. Please try again.");
            } finally {
              setRemovingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
              });
            }
          },
        },
      ]);
    },
    [removeFromWishlist],
  );

  const handleMoveToCart = useCallback(
    async (id: string) => {
      setMovingIds((prev) => new Set(prev).add(id));
      try {
        await moveToCart(id).unwrap();
      } catch {
        Alert.alert("Error", "Could not add to cart. Please try again.");
      } finally {
        setMovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [moveToCart],
  );

  // ── Loading ───────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading saved items…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* ── Sticky header ── */}
      <View style={styles.header}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.eyebrow}>My Account</Text>
            <Text style={styles.title}>Saved</Text>
          </View>
          {allItems.length > 0 && (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{allItems.length}</Text>
            </View>
          )}
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search saved items…"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category chips */}
        {categories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContent}
            style={styles.chipsScroll}
          >
            {categories.map((cat) => {
              const active = cat === activeCategory;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ── Empty state ── */}
      {filtered.length === 0 ? (
        <View style={styles.centered}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="heart-outline" size={32} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>
            {search || activeCategory !== "All"
              ? "No results"
              : "Nothing saved yet"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {search || activeCategory !== "All"
              ? "Try a different search or category"
              : "Tap the heart on any product to save it here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#111827"
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onRemove={() => handleRemove(item.id, item.product.name)}
              onMoveToCart={() => handleMoveToCart(item.id)}
              isRemoving={removingIds.has(item.id)}
              isMoving={movingIds.has(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  // Header
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: H_PAD,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.6,
  },
  countPill: {
    backgroundColor: "#111827",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 3,
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
  },

  // Category chips
  chipsScroll: {
    flexGrow: 0,
  },
  chipsContent: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  chipTextActive: {
    color: "#fff",
  },

  // List
  listContent: {
    padding: H_PAD,
    paddingBottom: 32,
  },
  row: {
    gap: COL_GAP,
  },

  // Empty
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Saved;
