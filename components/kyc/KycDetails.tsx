// components/kyc/KycDetails.tsx
import { useGetMyKycQuery } from "@/app/api/kycApi";
import { useAuth } from "@/context/authProvider";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KycStatusBadge from "./kycStatusBadge";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Helpers ──────────────────────────────────────────────────

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatDocType = (raw?: string) => {
  if (!raw) return "Not specified";
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// ── Status config ─────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    icon: "time-outline" as const,
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    label: "Under Review",
    message:
      "We're reviewing your documents and will notify you once complete.",
  },
  approved: {
    icon: "shield-checkmark-outline" as const,
    color: "#065F46",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    label: "Verified",
    message: "Your identity has been successfully verified.",
  },
  rejected: {
    icon: "close-circle-outline" as const,
    color: "#991B1B",
    bg: "#FEF2F2",
    border: "#FECACA",
    label: "Rejected",
    message:
      "Your submission was not accepted. Please resubmit with a clearer document.",
  },
};

// ── Info row ─────────────────────────────────────────────────

const InfoRow = ({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) => (
  <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

// ── Main ─────────────────────────────────────────────────────

const KycDetails = () => {
  // Pull auth token to attach to image request
  const { token } = useAuth();

  const { data, isLoading, error, refetch } = useGetMyKycQuery({});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const kyc = data?.data;

  // Build authenticated image URI
  const imageUri = kyc ? `http://192.168.1.122:8000/api/v1/kyc/me/image` : null;
  console.log(kyc, imageUri);

  const imageHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  // ── Loading ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading your KYC details…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Empty / Error ──────────────────────────────────────────

  if (error || !kyc) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "bottom", "left", "right"]}
      >
        <View style={styles.centered}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="document-text-outline" size={40} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No KYC Found</Text>
          <Text style={styles.emptySubtitle}>
            Submit your identity documents to get verified.
          </Text>
          {error && (
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const cfg = STATUS_CONFIG[kyc.status as keyof typeof STATUS_CONFIG];
  const showUpdated = kyc.updatedAt && kyc.updatedAt !== kyc.createdAt;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page heading ──────────────────────────────── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>KYC Details</Text>
          <KycStatusBadge status={kyc.status} size="medium" />
        </View>

        {/* ── Status banner ─────────────────────────────── */}
        <View
          style={[
            styles.banner,
            { backgroundColor: cfg.bg, borderColor: cfg.border },
          ]}
        >
          <View
            style={[styles.bannerIconWrap, { backgroundColor: cfg.border }]}
          >
            <Ionicons name={cfg.icon} size={20} color={cfg.color} />
          </View>
          <View style={styles.bannerText}>
            <Text style={[styles.bannerLabel, { color: cfg.color }]}>
              {cfg.label}
            </Text>
            <Text style={[styles.bannerMessage, { color: cfg.color }]}>
              {cfg.message}
            </Text>
          </View>
        </View>

        {/* ── Document info card ────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text-outline" size={18} color="#6B7280" />
            <Text style={styles.cardTitle}>Document Information</Text>
          </View>

          <InfoRow label="Document Type" value={formatDocType(kyc.docType)} />
          <InfoRow label="File Name" value={kyc.doc ?? "—"} />
          <InfoRow label="Submitted" value={formatDate(kyc.createdAt)} />
          {showUpdated && (
            <InfoRow
              label="Last Updated"
              value={formatDate(kyc.updatedAt)}
              last
            />
          )}
          {!showUpdated && (
            <InfoRow
              label="KYC ID"
              value={`#${String(kyc.id).padStart(6, "0")}`}
              last
            />
          )}
        </View>

        {/* ── Document preview card ─────────────────────── */}
        {imageUri && !imageError && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="image-outline" size={18} color="#6B7280" />
              <Text style={styles.cardTitle}>Document Preview</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setModalVisible(true)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: imageUri, headers: imageHeaders }}
                style={styles.previewImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
              {/* Gradient overlay */}
              <View style={styles.imageOverlay}>
                <View style={styles.expandPill}>
                  <Ionicons name="expand-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.expandText}>Tap to expand</Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.imageHint}>
              Pinch or zoom in the expanded view to inspect details.
            </Text>
          </View>
        )}

        {/* image error fallback */}
        {imageError && (
          <View style={[styles.card, styles.imageErrorCard]}>
            <Ionicons name="image-outline" size={32} color="#D1D5DB" />
            <Text style={styles.imageErrorText}>
              Could not load document image
            </Text>
            <TouchableOpacity
              onPress={() => setImageError(false)}
              style={styles.retryLink}
            >
              <Text style={styles.retryLinkText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Timeline ──────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="git-branch-outline" size={18} color="#6B7280" />
            <Text style={styles.cardTitle}>Timeline</Text>
          </View>

          <TimelineStep
            icon="cloud-upload-outline"
            label="Submitted"
            date={formatDate(kyc.createdAt)}
            active
          />
          <TimelineStep
            icon="eye-outline"
            label="Under Review"
            date={
              kyc.status !== "pending" ? formatDate(kyc.updatedAt) : undefined
            }
            active={kyc.status !== "pending"}
            pending={kyc.status === "pending"}
            last={kyc.status === "pending"}
          />
          {kyc.status !== "pending" && (
            <TimelineStep
              icon={
                kyc.status === "approved"
                  ? "shield-checkmark-outline"
                  : "close-circle-outline"
              }
              label={kyc.status === "approved" ? "Approved" : "Rejected"}
              date={formatDate(kyc.updatedAt)}
              active={true}
              accent={kyc.status === "approved" ? "#059669" : "#DC2626"}
              last
            />
          )}
        </View>
      </ScrollView>

      {/* ── Full-screen image modal ───────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <Pressable
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
            hitSlop={16}
          >
            <View style={styles.modalCloseIcon}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </View>
          </Pressable>

          {imageUri && (
            <Image
              source={{ uri: imageUri, headers: imageHeaders }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}

          <Text style={styles.modalHint}>Pinch to zoom</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ── Timeline step ─────────────────────────────────────────────

const TimelineStep = ({
  icon,
  label,
  date,
  active = false,
  pending = false,
  accent,
  last = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  date?: string;
  active?: boolean;
  pending?: boolean;
  accent?: string;
  last?: boolean;
}) => {
  const dotColor = accent ?? (active ? "#111827" : "#D1D5DB");

  return (
    <View style={styles.timelineRow}>
      {/* Line + dot */}
      <View style={styles.timelineLeft}>
        <View style={[styles.timelineDot, { backgroundColor: dotColor }]}>
          {pending ? (
            <ActivityIndicator size={10} color="#FFFFFF" />
          ) : (
            <Ionicons
              name={icon}
              size={11}
              color={active ? "#FFFFFF" : "#9CA3AF"}
            />
          )}
        </View>
        {!last && (
          <View
            style={[
              styles.timelineLine,
              active && { backgroundColor: "#111827" },
            ]}
          />
        )}
      </View>

      {/* Content */}
      <View style={styles.timelineContent}>
        <Text
          style={[
            styles.timelineLabel,
            !active && styles.timelineLabelInactive,
          ]}
        >
          {label}
        </Text>
        {date ? (
          <Text style={styles.timelineDate}>{date}</Text>
        ) : pending ? (
          <Text style={styles.timelinePending}>In progress…</Text>
        ) : null}
      </View>
    </View>
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
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },

  // ── Loading / empty ──────────────────────────────
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#9CA3AF",
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Scroll ───────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
  },

  // ── Page header ──────────────────────────────────
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },

  // ── Banner ───────────────────────────────────────
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  bannerIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  bannerText: {
    flex: 1,
    gap: 3,
  },
  bannerLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  bannerMessage: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.85,
  },

  // ── Card ─────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // ── Info rows ────────────────────────────────────
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3F4F6",
    gap: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
    flex: 1,
  },

  // ── Image preview ────────────────────────────────
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    height: 210,
    backgroundColor: "#F3F4F6",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 14,
    // subtle gradient-like overlay via a semi-transparent bottom strip
    backgroundImage: undefined, // not supported in RN, handled by the View below
  },
  expandPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  expandText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  imageHint: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
  },
  imageErrorCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  imageErrorText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  retryLink: {
    paddingVertical: 4,
  },
  retryLinkText: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // ── Timeline ─────────────────────────────────────
  timelineRow: {
    flexDirection: "row",
    gap: 14,
    minHeight: 52,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    gap: 2,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  timelineLabelInactive: {
    color: "#D1D5DB",
  },
  timelineDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  timelinePending: {
    fontSize: 12,
    color: "#D97706",
    fontStyle: "italic",
  },

  // ── Modal ────────────────────────────────────────
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: Platform.OS === "ios" ? 56 : 36,
    right: 20,
    zIndex: 10,
  },
  modalCloseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: SCREEN_W,
    height: SCREEN_W * 1.4,
  },
  modalHint: {
    position: "absolute",
    bottom: 48,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.5,
  },
});

export default KycDetails;
