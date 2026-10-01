// src/screens/admin/AdminOrderDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import {
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../../api/orderService";
import { Order, OrderStatus } from "../../types/order";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import StatusBadge from "../../components/StatusBadge";
import PrimaryButton from "../../components/PrimaryButton";
import { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminOrderDetail">;

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
  gray: "#6B6B6B",
  border: "#E5E5E5",
  red: "#E11900",
  redLight: "#FDE7E7",
  amber: "#F57F17",
  blue: "#1565C0",
  purple: "#4527A0",
};

const STEPS: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
];

const STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string; icon: string }
> = {
  Pending: { bg: "#FFF8E1", text: UE.amber, icon: "time-outline" },
  Confirmed: {
    bg: "#E3F2FD",
    text: UE.blue,
    icon: "checkmark-circle-outline",
  },
  Preparing: { bg: "#FFF3E0", text: "#E65100", icon: "restaurant-outline" },
  Ready: { bg: "#EDE7F6", text: UE.purple, icon: "bag-check-outline" },
  Completed: {
    bg: "#E6F7EE",
    text: UE.green,
    icon: "checkmark-done-circle-outline",
  },
  Cancelled: { bg: UE.redLight, text: UE.red, icon: "close-circle-outline" },
};

const NEXT_ACTIONS: Record<
  OrderStatus,
  {
    label: string;
    status: OrderStatus;
    icon: string;
    variant: "primary" | "danger";
  }[]
> = {
  Pending: [
    {
      label: "Confirm Order",
      status: "Confirmed",
      icon: "checkmark-circle",
      variant: "primary",
    },
    {
      label: "Cancel Order",
      status: "Cancelled",
      icon: "close-circle",
      variant: "danger",
    },
  ],
  Confirmed: [
    {
      label: "Start Preparing",
      status: "Preparing",
      icon: "restaurant",
      variant: "primary",
    },
    {
      label: "Cancel Order",
      status: "Cancelled",
      icon: "close-circle",
      variant: "danger",
    },
  ],
  Preparing: [
    {
      label: "Mark as Ready",
      status: "Ready",
      icon: "bag-check",
      variant: "primary",
    },
  ],
  Ready: [
    {
      label: "Mark as Completed",
      status: "Completed",
      icon: "checkmark-done-circle",
      variant: "primary",
    },
  ],
  Completed: [],
  Cancelled: [],
};

// ===== Helper: safely extract a display string from order.user =====
const getCustomerLabel = (user: any): string => {
  if (!user) return "—";
  if (typeof user === "string") return user;
  if (typeof user === "object") {
    if (user.name) return user.name;
    if (user._id) return user._id;
  }
  return "—";
};

export default function AdminOrderDetailScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [orderId]);

  const changeStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await updateOrderStatus(order._id, newStatus);
      setOrder(updated);
      Alert.alert("Updated", `Order is now ${updated.status}`);
    } catch (e) {
      Alert.alert("Update Failed", (e as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert("Delete Order", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteOrder(order!._id);
            navigation.goBack();
          } catch (e) {
            Alert.alert("Delete Failed", (e as Error).message);
          }
        },
      },
    ]);
  };

  if (loading) return <Loading />;

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.headerBar}>
          <View style={styles.headerStripe} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={UE.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerBox}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={36} color={UE.red} />
          </View>
          <Text style={styles.errorTitle}>Couldn't load order</Text>
          <ErrorText>{error || "Order not found"}</ErrorText>
        </View>
      </SafeAreaView>
    );
  }

  const item = order.menuItem;
  const itemName = item?.name ?? "Unknown item";
  const itemImage = item?.imageUrl || "https://via.placeholder.com/150";
  const itemPrice =
    typeof item?.price === "number" ? item.price.toFixed(2) : "0.00";
  const total =
    typeof order.totalAmount === "number"
      ? order.totalAmount.toFixed(2)
      : "0.00";
  const date = new Date(order.orderDate);
  const actions = NEXT_ACTIONS[order.status] || [];
  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const customerLabel = getCustomerLabel(order.user);
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Header ===== */}
      <View style={styles.headerBar}>
        <View style={styles.headerStripe} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={UE.black} />
        </TouchableOpacity>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={styles.headerLabel}>ADMIN</Text>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSubtitle}>
            #{order._id.slice(-6).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerStatusChip}>
          <Ionicons
            name={statusStyle.icon as any}
            size={18}
            color={statusStyle.text}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Status Card with Tracker ===== */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View
              style={[
                styles.statusIconBox,
                { backgroundColor: statusStyle.bg },
              ]}
            >
              <Ionicons
                name={statusStyle.icon as any}
                size={22}
                color={statusStyle.text}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.statusLabelSmall}>CURRENT STATUS</Text>
              <Text
                style={[styles.statusLabelBig, { color: statusStyle.text }]}
              >
                {order.status}
              </Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          {!isCancelled ? (
            <View style={styles.trackerRow}>
              {STEPS.map((step, index) => {
                const isDone = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <React.Fragment key={step}>
                    <View style={styles.trackerStep}>
                      <View
                        style={[
                          styles.trackerDot,
                          isDone && styles.trackerDotDone,
                          isCurrent && styles.trackerDotCurrent,
                        ]}
                      >
                        {isDone && (
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={UE.white}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.trackerLabel,
                          isDone && styles.trackerLabelDone,
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                    {index < STEPS.length - 1 && (
                      <View
                        style={[
                          styles.trackerLine,
                          index < currentStepIndex && styles.trackerLineDone,
                        ]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          ) : (
            <View style={styles.cancelledBanner}>
              <Ionicons name="close-circle" size={16} color={UE.red} />
              <Text style={styles.cancelledText}>
                This order has been cancelled.
              </Text>
            </View>
          )}
        </View>

        {/* ===== Item ===== */}
        <Text style={styles.sectionHeading}>Item</Text>
        <View style={styles.itemCard}>
          <Image source={{ uri: itemImage }} style={styles.itemImage} />
          <View style={styles.itemBody}>
            <Text style={styles.itemName} numberOfLines={2}>
              {itemName}
            </Text>
            <Text style={styles.itemMeta}>
              Qty {order.quantity} · Rs. {itemPrice} each
            </Text>
            <Text style={styles.itemTotal}>Rs. {total}</Text>
          </View>
        </View>

        {/* ===== Order Info ===== */}
        <Text style={styles.sectionHeading}>Order Info</Text>
        <View style={styles.infoCard}>
          <InfoRow
            icon="person-outline"
            label="Customer"
            value={customerLabel}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="calendar-outline"
            label="Ordered On"
            value={`${date.toLocaleDateString()} · ${date.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            )}`}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="receipt-outline"
            label="Order ID"
            value={`#${order._id.slice(-8).toUpperCase()}`}
          />
        </View>

        {/* ===== Actions ===== */}
        {actions.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Actions</Text>
            <View style={styles.actionsBlock}>
              {actions.map((a) => {
                const isDanger = a.variant === "danger";
                return (
                  <TouchableOpacity
                    key={a.status}
                    style={[
                      styles.actionBtn,
                      isDanger && styles.actionBtnDanger,
                      updating && { opacity: 0.6 },
                    ]}
                    onPress={() => changeStatus(a.status)}
                    disabled={updating}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={a.icon as any}
                      size={18}
                      color={isDanger ? UE.red : UE.white}
                    />
                    <Text
                      style={[
                        styles.actionText,
                        isDanger && styles.actionTextDanger,
                      ]}
                    >
                      {a.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ===== Delete ===== */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={confirmDelete}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={UE.red} />
          <Text style={styles.deleteText}>Delete Order</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon as any} size={16} color={UE.gray} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Header =====
  headerBar: {
    backgroundColor: UE.green,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    overflow: "hidden",
    position: "relative",
  },
  headerStripe: {
    position: "absolute",
    top: -60,
    right: -110,
    width: 280,
    height: 120,
    backgroundColor: UE.greenDark,
    transform: [{ rotate: "-32deg" }],
    opacity: 0.35,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: "rgba(0,0,0,0.55)",
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: {
    color: UE.black,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: "rgba(0,0,0,0.6)",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 1,
    letterSpacing: 0.3,
  },
  headerStatusChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
  },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  // ===== Status card =====
  statusCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: UE.border,
  },
  statusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  statusIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusLabelSmall: {
    fontSize: 10,
    color: UE.gray,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  statusLabelBig: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 3,
    letterSpacing: -0.4,
  },

  // ===== Tracker =====
  trackerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  trackerStep: { alignItems: "center", flex: 0, width: 54 },
  trackerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  trackerDotDone: { backgroundColor: UE.green },
  trackerDotCurrent: {
    backgroundColor: UE.black,
  },
  trackerLabel: {
    fontSize: 9,
    color: UE.gray,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  trackerLabelDone: { color: UE.black, fontWeight: "900" },
  trackerLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginTop: 10,
    marginHorizontal: -12,
  },
  trackerLineDone: { backgroundColor: UE.green },

  cancelledBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: UE.redLight,
    borderWidth: 1,
    borderColor: "#F5C0C0",
  },
  cancelledText: {
    color: UE.red,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 8,
  },

  // ===== Section heading =====
  sectionHeading: {
    fontSize: 11,
    fontWeight: "900",
    color: UE.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 6,
  },

  // ===== Item card =====
  itemCard: {
    flexDirection: "row",
    backgroundColor: UE.white,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: UE.border,
  },
  itemImage: {
    width: 100,
    height: 100,
    backgroundColor: UE.offWhite,
  },
  itemBody: { flex: 1, padding: 14, justifyContent: "center" },
  itemName: {
    fontSize: 15,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },
  itemMeta: {
    fontSize: 12,
    color: UE.gray,
    marginTop: 6,
    fontWeight: "600",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "900",
    color: UE.green,
    marginTop: 8,
    letterSpacing: -0.3,
  },

  // ===== Info card =====
  infoCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: UE.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoLabel: {
    fontSize: 13,
    color: UE.gray,
    marginLeft: 8,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: UE.black,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  divider: { height: 1, backgroundColor: UE.offWhite },

  // ===== Actions =====
  actionsBlock: { marginBottom: 16 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UE.green,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionBtnDanger: {
    backgroundColor: UE.white,
    borderWidth: 1.5,
    borderColor: UE.red,
  },
  actionText: {
    color: UE.white,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  actionTextDanger: { color: UE.red },

  // ===== Delete =====
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: UE.border,
    backgroundColor: UE.white,
    marginTop: 4,
  },
  deleteText: {
    color: UE.red,
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 6,
    letterSpacing: 0.3,
  },

  // ===== Error =====
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: UE.redLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: UE.black,
    marginTop: 4,
    letterSpacing: -0.3,
  },
});
