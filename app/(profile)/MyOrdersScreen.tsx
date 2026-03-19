// screens/MyOrdersScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCancelSaleMutation, useGetSalesQuery } from "../api/salesApi";

// ── Types ──────────────────────────────────────────────────────

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  customer?: { name: string; email: string };
}

// ── Constants ──────────────────────────────────────────────────

const FILTERS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const STATUS_META: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
  }
> = {
  pending: {
    label: "Pending",
    color: "#92400E",
    bg: "#FEF3C7",
    icon: "time-outline",
  },
  processing: {
    label: "Processing",
    color: "#1E40AF",
    bg: "#DBEAFE",
    icon: "refresh-outline",
  },
  completed: {
    label: "Completed",
    color: "#065F46",
    bg: "#D1FAE5",
    icon: "checkmark-circle-outline",
  },
  cancelled: {
    label: "Cancelled",
    color: "#991B1B",
    bg: "#FEE2E2",
    icon: "close-circle-outline",
  },
};

// ── Helpers ────────────────────────────────────────────────────

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const orderId = (id: number) => `#${String(id).padStart(5, "0")}`;

// ── Status badge ───────────────────────────────────────────────

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const meta = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <View style={[badge.wrap, { backgroundColor: meta.bg }]}>
      <Ionicons name={meta.icon} size={11} color={meta.color} />
      <Text style={[badge.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

const badge = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

// ── Order card ─────────────────────────────────────────────────

const OrderCard = ({
  order,
  onPress,
}: {
  order: Order;
  onPress: () => void;
}) => (
  <TouchableOpacity style={card.wrap} onPress={onPress} activeOpacity={0.75}>
    {/* Top row */}
    <View style={card.topRow}>
      <Text style={card.orderId}>{orderId(order.id)}</Text>
      <StatusBadge status={order.status} />
    </View>

    {/* Divider */}
    <View style={card.divider} />

    {/* Items preview */}
    {order.items && order.items.length > 0 && (
      <View style={card.itemsWrap}>
        {order.items.slice(0, 2).map((item) => (
          <View key={item.id} style={card.itemRow}>
            <View style={card.itemDot} />
            <Text style={card.itemName} numberOfLines={1}>
              {item.productName}
            </Text>
            <Text style={card.itemQty}>×{item.quantity}</Text>
          </View>
        ))}
        {order.items.length > 2 && (
          <Text style={card.moreItems}>
            +{order.items.length - 2} more item
            {order.items.length - 2 > 1 ? "s" : ""}
          </Text>
        )}
      </View>
    )}

    {/* Bottom row */}
    <View style={card.bottomRow}>
      <View style={card.dateWrap}>
        <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
        <Text style={card.date}>{formatDate(order.createdAt)}</Text>
      </View>
      <Text style={card.total}>{formatCurrency(order.total)}</Text>
    </View>
  </TouchableOpacity>
);

const card = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  itemsWrap: {
    gap: 7,
    marginBottom: 14,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  itemQty: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  moreItems: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 13,
    fontStyle: "italic",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  total: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
});

// ── Order detail modal ─────────────────────────────────────────

const OrderDetailModal = ({
  orderId: id,
  visible,
  onClose,
  onCancel,
}: {
  orderId: number | null;
  visible: boolean;
  onClose: () => void;
  onCancel: (id: number) => void;
}) => {
  const { data, isLoading } = useGetSalesQuery(
    { page: 1, size: 1 },
    { skip: !id },
  );
  // In real usage you'd call useGetSaleQuery(id) — using the list query as a stub
  // Replace with: const { data, isLoading } = useGetSaleQuery(id!, { skip: !id });

  const order: Order | null = (data?.data ?? data?.sales)?.[0] ?? null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modal.safeArea} edges={["top", "bottom"]}>
        {/* Handle */}
        <View style={modal.handle} />

        {/* Header */}
        <View style={modal.header}>
          <Text style={modal.headerTitle}>Order Details</Text>
          <Pressable onPress={onClose} hitSlop={12} style={modal.closeBtn}>
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
        </View>

        {isLoading || !order ? (
          <View style={modal.loading}>
            <ActivityIndicator color="#111827" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={modal.scroll}
            showsVerticalScrollIndicator={false}
          >
            {/* Summary */}
            <View style={modal.section}>
              <View style={modal.summaryRow}>
                <Text style={modal.summaryId}>{orderId(order.id)}</Text>
                <StatusBadge status={order.status} />
              </View>
              <Text style={modal.summaryDate}>
                Placed on {formatDate(order.createdAt)}
              </Text>
            </View>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <View style={modal.section}>
                <Text style={modal.sectionLabel}>Items</Text>
                {order.items.map((item, i) => (
                  <View
                    key={item.id}
                    style={[
                      modal.itemRow,
                      i < order.items!.length - 1 && modal.itemBorder,
                    ]}
                  >
                    <View style={modal.itemLeft}>
                      <Text style={modal.itemName}>{item.productName}</Text>
                      <Text style={modal.itemQty}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={modal.itemPrice}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Total */}
            <View style={modal.totalRow}>
              <Text style={modal.totalLabel}>Total</Text>
              <Text style={modal.totalValue}>
                {formatCurrency(order.total)}
              </Text>
            </View>

            {/* Cancel */}
            {(order.status === "pending" || order.status === "processing") && (
              <TouchableOpacity
                style={modal.cancelBtn}
                onPress={() => onCancel(order.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#DC2626"
                />
                <Text style={modal.cancelText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const modal = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF9" },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
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
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 6,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryId: { fontSize: 20, fontWeight: "800", color: "#111827" },
  summaryDate: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
  },
  itemLeft: { flex: 1, gap: 3, marginRight: 12 },
  itemName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemQty: { fontSize: 12, color: "#9CA3AF" },
  itemPrice: { fontSize: 14, fontWeight: "700", color: "#111827" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  totalLabel: { fontSize: 14, color: "#9CA3AF", fontWeight: "600" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: "#FEF2F2",
  },
  cancelText: { fontSize: 15, fontWeight: "700", color: "#DC2626" },
});

// ── Main screen ────────────────────────────────────────────────

const MyOrdersScreen = () => {
  const [activeFilter, setActiveFilter] = useState<string | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetSalesQuery({
    page,
    size: 20,
    status: activeFilter,
  });

  const [cancelSale, { isLoading: isCancelling }] = useCancelSaleMutation();

  const orders: Order[] = data?.data ?? data?.sales ?? [];
  const total: number = data?.total ?? 0;

  const handleCancel = useCallback(
    (id: number) => {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order? This action cannot be undone.",
        [
          { text: "Keep Order", style: "cancel" },
          {
            text: "Cancel Order",
            style: "destructive",
            onPress: async () => {
              try {
                await cancelSale(id).unwrap();
                setSelectedOrderId(null);
                Alert.alert("Cancelled", "Your order has been cancelled.");
              } catch (e: any) {
                Alert.alert(
                  "Error",
                  e?.data?.message ?? "Could not cancel order.",
                );
              }
            },
          },
        ],
      );
    },
    [cancelSale],
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Ionicons name="bag-outline" size={36} color="#9CA3AF" />
        </View>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySubtitle}>
          {activeFilter
            ? `You have no ${activeFilter} orders.`
            : "Your order history will appear here."}
        </Text>
      </View>
    );
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
          <Text style={styles.headerEyebrow}>My Account</Text>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        {total > 0 && (
          <View style={styles.totalPill}>
            <Text style={styles.totalPillText}>{total}</Text>
          </View>
        )}
      </View>

      {/* ── Filter tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f.value;
          return (
            <TouchableOpacity
              key={f.label}
              style={[styles.filterTab, active && styles.filterTabActive]}
              onPress={() => {
                setActiveFilter(f.value);
                setPage(1);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.filterLabel, active && styles.filterLabelActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── List ── */}
      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => String(o.id)}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => setSelectedOrderId(item.id)}
            />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              tintColor="#111827"
            />
          }
        />
      )}

      {/* ── Detail modal ── */}
      <OrderDetailModal
        orderId={selectedOrderId}
        visible={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAF9" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerEyebrow: {
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
  totalPill: {
    backgroundColor: "#111827",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  totalPillText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // Filters
  filterScroll: { flexGrow: 0 },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  filterTabActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterLabelActive: { color: "#FFFFFF" },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

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
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 32,
  },
});

export default MyOrdersScreen;
