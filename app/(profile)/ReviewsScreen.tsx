// screens/ReviewsScreen.tsx
//
// Assumes a reviewsApi with these endpoints (add to your apiSlice):
//   getMyReviews  → GET /reviews/me
//   createReview  → POST /reviews  { productId, rating, comment }
//   updateReview  → PUT /reviews/:id { rating, comment }
//   deleteReview  → DELETE /reviews/:id
//
// Adjust import paths to match your project structure.

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Stub API hooks (replace with real RTK Query hooks) ─────────
// import {
//   useGetMyReviewsQuery,
//   useCreateReviewMutation,
//   useUpdateReviewMutation,
//   useDeleteReviewMutation,
// } from "@/store/api/reviewsApi";

// ── Types ──────────────────────────────────────────────────────

interface Review {
  id: number;
  productId: number;
  productName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ────────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const avg = (reviews: Review[]) => {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
};

// ── Star row ───────────────────────────────────────────────────

const StarRow = ({
  rating,
  size = 16,
  interactive = false,
  onRate,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) => (
  <View style={{ flexDirection: "row", gap: 3 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <TouchableOpacity
        key={s}
        disabled={!interactive}
        onPress={() => onRate?.(s)}
        hitSlop={6}
        activeOpacity={0.7}
      >
        <Ionicons
          name={s <= rating ? "star" : "star-outline"}
          size={size}
          color={s <= rating ? "#F59E0B" : "#D1D5DB"}
        />
      </TouchableOpacity>
    ))}
  </View>
);

// ── Rating bar (summary) ───────────────────────────────────────

const RatingBar = ({
  star,
  count,
  total,
}: {
  star: number;
  count: number;
  total: number;
}) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={rbar.row}>
      <Text style={rbar.label}>{star}</Text>
      <Ionicons name="star" size={10} color="#F59E0B" />
      <View style={rbar.track}>
        <View style={[rbar.fill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={rbar.count}>{count}</Text>
    </View>
  );
};

const rbar = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { fontSize: 11, color: "#9CA3AF", width: 8, textAlign: "right" },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#F59E0B", borderRadius: 3 },
  count: { fontSize: 11, color: "#9CA3AF", width: 20, textAlign: "right" },
});

// ── Review card ────────────────────────────────────────────────

const ReviewCard = ({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <View style={rc.wrap}>
    {/* Product name + actions */}
    <View style={rc.topRow}>
      <Text style={rc.productName} numberOfLines={1}>
        {review.productName}
      </Text>
      <View style={rc.actions}>
        <TouchableOpacity onPress={onEdit} hitSlop={8} style={rc.actionBtn}>
          <Ionicons name="pencil-outline" size={15} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} hitSlop={8} style={rc.actionBtn}>
          <Ionicons name="trash-outline" size={15} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Stars + date */}
    <View style={rc.metaRow}>
      <StarRow rating={review.rating} size={14} />
      <Text style={rc.date}>{formatDate(review.createdAt)}</Text>
    </View>

    {/* Comment */}
    {review.comment ? (
      <Text style={rc.comment}>{review.comment}</Text>
    ) : (
      <Text style={rc.noComment}>No written review</Text>
    )}

    {/* Edited indicator */}
    {review.updatedAt !== review.createdAt && (
      <Text style={rc.edited}>Edited {formatDate(review.updatedAt)}</Text>
    )}
  </View>
);

const rc = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  productName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  actions: { flexDirection: "row", gap: 4 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 11, color: "#9CA3AF" },
  comment: { fontSize: 14, color: "#374151", lineHeight: 22 },
  noComment: { fontSize: 13, color: "#D1D5DB", fontStyle: "italic" },
  edited: { fontSize: 11, color: "#D1D5DB", fontStyle: "italic" },
});

// ── Write / Edit review modal ──────────────────────────────────

const ReviewModal = ({
  visible,
  onClose,
  initial,
  onSubmit,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  initial?: Partial<Review>;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isLoading: boolean;
}) => {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");

  const isEdit = !!initial?.id;
  const canSubmit = rating > 0 && !isLoading;

  const ratingLabel =
    ["", "Poor", "Fair", "Good", "Great", "Excellent"][rating] ?? "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={rm.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Handle */}
          <View style={rm.handle} />

          {/* Header */}
          <View style={rm.header}>
            <Text style={rm.title}>
              {isEdit ? "Edit Review" : "Write a Review"}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={rm.closeBtn}>
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          <View style={rm.body}>
            {/* Product */}
            {initial?.productName && (
              <View style={rm.productTag}>
                <Ionicons name="cube-outline" size={14} color="#6B7280" />
                <Text style={rm.productTagText}>{initial.productName}</Text>
              </View>
            )}

            {/* Stars */}
            <View style={rm.starSection}>
              <Text style={rm.starLabel}>Your Rating</Text>
              <StarRow
                rating={rating}
                size={36}
                interactive
                onRate={setRating}
              />
              {rating > 0 && <Text style={rm.ratingLabel}>{ratingLabel}</Text>}
            </View>

            {/* Comment */}
            <View style={rm.commentSection}>
              <Text style={rm.commentLabel}>Review (optional)</Text>
              <TextInput
                style={rm.input}
                value={comment}
                onChangeText={setComment}
                placeholder="Share your experience with this product…"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={5}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={rm.charCount}>{comment.length}/500</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[rm.submitBtn, !canSubmit && rm.submitBtnDisabled]}
              onPress={() => onSubmit({ rating, comment })}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  <Text style={rm.submitText}>
                    {isEdit ? "Save Changes" : "Submit Review"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const rm = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF9" },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  body: { flex: 1, padding: 20, gap: 24 },
  productTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  productTagText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  starSection: { alignItems: "center", gap: 14, paddingVertical: 8 },
  starLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingLabel: { fontSize: 16, fontWeight: "700", color: "#F59E0B" },
  commentSection: { gap: 8, flex: 1 },
  commentLabel: { fontSize: 13, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    minHeight: 120,
    flex: 1,
    lineHeight: 22,
  },
  charCount: { fontSize: 11, color: "#9CA3AF", textAlign: "right" },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  submitBtnDisabled: { backgroundColor: "#9CA3AF" },
  submitText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});

// ── Stub data (remove when wired to real API) ──────────────────

const STUB_REVIEWS: Review[] = [
  {
    id: 1,
    productId: 10,
    productName: "Wireless Noise-Cancelling Headphones",
    rating: 5,
    comment:
      "Absolutely incredible sound quality. The noise cancellation is top-tier and battery lasts forever.",
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-11-01T10:00:00Z",
  },
  {
    id: 2,
    productId: 22,
    productName: "Ergonomic Office Chair",
    rating: 4,
    comment:
      "Very comfortable after long work sessions. Assembly took a while but it was worth it.",
    createdAt: "2025-10-14T08:30:00Z",
    updatedAt: "2025-11-10T09:00:00Z",
  },
  {
    id: 3,
    productId: 37,
    productName: "Smart LED Desk Lamp",
    rating: 3,
    comment: "Good lamp but the app is a bit buggy.",
    createdAt: "2025-09-20T15:00:00Z",
    updatedAt: "2025-09-20T15:00:00Z",
  },
];

// ── Main screen ────────────────────────────────────────────────

const ReviewsScreen = () => {
  // ── Replace stubs with real hooks ──
  // const { data, isLoading, isFetching, refetch } = useGetMyReviewsQuery();
  // const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  // const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  // const [deleteReview] = useDeleteReviewMutation();

  const [reviews, setReviews] = useState<Review[]>(STUB_REVIEWS);
  const isLoading = false;
  const isFetching = false;

  const [modalVisible, setModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<Review | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const totalReviews = reviews.length;
  const avgRating = avg(reviews);

  // Tally per star
  const tally = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));

  const handleOpenCreate = () => {
    setEditTarget(undefined);
    setModalVisible(true);
  };

  const handleOpenEdit = (review: Review) => {
    setEditTarget(review);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete Review", "Remove this review permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // await deleteReview(id).unwrap();
          setReviews((prev) => prev.filter((r) => r.id !== id));
        },
      },
    ]);
  };

  const handleSubmit = async ({
    rating,
    comment,
  }: {
    rating: number;
    comment: string;
  }) => {
    setIsSaving(true);
    try {
      if (editTarget) {
        // await updateReview({ id: editTarget.id, rating, comment }).unwrap();
        setReviews((prev) =>
          prev.map((r) =>
            r.id === editTarget.id
              ? { ...r, rating, comment, updatedAt: new Date().toISOString() }
              : r,
          ),
        );
      } else {
        // const newReview = await createReview({ productId: ..., rating, comment }).unwrap();
        const stub: Review = {
          id: Date.now(),
          productId: 0,
          productName: "New Product",
          rating,
          comment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setReviews((prev) => [stub, ...prev]);
      }
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert("Error", e?.data?.message ?? "Could not save review.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle="dark-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>My Account</Text>
          <Text style={styles.headerTitle}>Reviews</Text>
        </View>
        <TouchableOpacity
          style={styles.writeBtn}
          onPress={handleOpenCreate}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.writeBtnText}>Write</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(r) => String(r.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {}} // refetch()
              tintColor="#111827"
            />
          }
          ListHeaderComponent={
            totalReviews > 0 ? (
              /* ── Summary card ── */
              <View style={styles.summaryCard}>
                {/* Big rating */}
                <View style={styles.summaryLeft}>
                  <Text style={styles.bigRating}>{avgRating.toFixed(1)}</Text>
                  <StarRow rating={Math.round(avgRating)} size={18} />
                  <Text style={styles.totalCount}>
                    {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                  </Text>
                </View>

                {/* Bars */}
                <View style={styles.summaryRight}>
                  {tally.map(({ star, count }) => (
                    <RatingBar
                      key={star}
                      star={star}
                      count={count}
                      total={totalReviews}
                    />
                  ))}
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIcon}>
                <Ionicons name="star-outline" size={36} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                Share your thoughts on products you&apos;ve purchased.
              </Text>
              <TouchableOpacity
                style={styles.emptyWriteBtn}
                onPress={handleOpenCreate}
              >
                <Text style={styles.emptyWriteText}>
                  Write your first review
                </Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onEdit={() => handleOpenEdit(item)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      {/* ── Modal ── */}
      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        initial={editTarget}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF9" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.8,
  },
  writeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  writeBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },

  // List
  listContent: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },

  // Summary
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  summaryLeft: { alignItems: "center", gap: 6 },
  bigRating: {
    fontSize: 48,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -2,
    lineHeight: 52,
  },
  totalCount: { fontSize: 12, color: "#9CA3AF" },
  summaryRight: { flex: 1, gap: 6 },

  // Empty
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 32,
  },
  emptyWriteBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#111827",
    borderRadius: 20,
  },
  emptyWriteText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});

export default ReviewsScreen;
