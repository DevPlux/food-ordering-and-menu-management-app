// src/screens/orders/OrderDetailScreen.tsx
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
import { Order, OrderStatus } from "../../types/order";
import { getOrderById, cancelOrder } from "../../api/orderService";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import PrimaryButton from "../../components/PrimaryButton";
import { OrdersStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<OrdersStackParamList, "OrderDetail">;

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
  Cancelled: { bg: "#FDE7E7", text: UE.red, icon: "close-circle-outline" },
};

export default function OrderDetailScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCancel = () => {
    Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          setCancelling(true);
          try {
            const updated = await cancelOrder(order!._id);
            setOrder(updated);
          } catch (e) {
            Alert.alert("Failed", (e as Error).message);
          } finally {
            setCancelling(false);
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
            <Ionicons name="arrow-back" size={22} color={UE.black} />
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

  // Safe values
  const item = order.menuItem;
  const itemName = item?.name ?? "Unknown item";
  const itemCategory = item?.category ?? "—";
  const itemImage = item?.imageUrl || "https://via.placeholder.com/400";
  const itemPrice =
    typeof item?.price === "number" ? item.price.toFixed(2) : "0.00";
  const total =
    typeof order.totalAmount === "number"
      ? order.totalAmount.toFixed(2)
      : "0.00";
  const date = new Date(order.orderDate);
  const canCancel = order.status === "Pending" || order.status === "Confirmed";
  const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Custom Header ===== */}
      <View style={styles.headerBar}>
        <View style={styles.headerStripe} />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={UE.black} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.headerSubtitle}>
            #{order._id.slice(-6).toUpperCase()}
          </Text>
        </View>

        <View style={styles.headerStatusChip}>
          <Ionicons
            name={statusStyle.icon as any}
            size={16}
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
          <View style={styles.statusHeader}>
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
          </View>

          {/* Progress tracker (hidden if cancelled) */}
          {!isCancelled && (
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
          )}

          {isCancelled && (
            <View style={styles.cancelledBanner}>
              <Ionicons name="close-circle" size={16} color={UE.red} />
              <Text style={styles.cancelledText}>
                This order has been cancelled.
              </Text>
            </View>
          )}
        </View>

        {/* ===== Item Card ===== */}
        <Text style={styles.sectionHeading}>Item</Text>
        <View style={styles.itemCard}>
          <Image source={{ uri: itemImage }} style={styles.itemImage} />
          <View style={styles.itemBody}>
            <Text style={styles.itemName} numberOfLines={2}>
              {itemName}
            </Text>
            <View style={styles.itemCategoryPill}>
              <Text style={styles.itemCategoryText}>{itemCategory}</Text>
            </View>
            <Text style={styles.itemPrice}>Rs. {itemPrice}</Text>
          </View>
        </View>

        {/* ===== Order Summary ===== */}
        <Text style={styles.sectionHeading}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <SummaryRow
            icon="cube-outline"
            label="Quantity"
            value={String(order.quantity)}
          />
          <View style={styles.divider} />
          <SummaryRow
            icon="pricetag-outline"
            label="Unit Price"
            value={`Rs. ${itemPrice}`}
          />
          <View style={styles.divider} />
          <SummaryRow
            icon="cash-outline"
            label="Total"
            value={`Rs. ${total}`}
            bold
          />
        </View>

        {/* ===== Order Info ===== */}
        <Text style={styles.sectionHeading}>Order Info</Text>
        <View style={styles.summaryCard}>
          <SummaryRow
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
          <SummaryRow
            icon="receipt-outline"
            label="Order ID"
            value={`#${order._id.slice(-8).toUpperCase()}`}
          />
        </View>

        {/* ===== Cancel Button ===== */}
        {canCancel && (
          <View style={styles.cancelWrapper}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              disabled={cancelling}
              activeOpacity={0.85}
            >
              {cancelling ? (
                <>
                  <Ionicons name="hourglass-outline" size={18} color={UE.red} />
                  <Text style={styles.cancelBtnText}>Cancelling...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color={UE.red}
                  />
                  <Text style={styles.cancelBtnText}>Cancel Order</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.cancelHint}>
              You can only cancel while the order is Pending or Confirmed.
            </Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  bold,
}: {
  icon: string;
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryLeft}>
        <Ionicons name={icon as any} size={16} color={UE.gray} />
        <Text style={styles.summaryLabel}>{label}</Text>
      </View>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>
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

  // ===== Scroll =====
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  // ===== Status Card =====
  statusCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: UE.border,
  },
  statusHeader: {
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
  trackerStep: {
    alignItems: "center",
    flex: 0,
    width: 54,
  },
  trackerDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  trackerDotDone: {
    backgroundColor: UE.green,
  },
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
  trackerLabelDone: {
    color: UE.black,
    fontWeight: "900",
  },
  trackerLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginTop: 10,
    marginHorizontal: -12,
  },
  trackerLineDone: {
    backgroundColor: UE.green,
  },

  // ===== Cancelled Banner =====
  cancelledBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#FDE7E7",
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

  // ===== Item Card =====
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
    width: 110,
    height: 110,
    backgroundColor: UE.offWhite,
  },
  itemBody: {
    flex: 1,
    padding: 14,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "900",
    color: UE.black,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  itemCategoryPill: {
    alignSelf: "flex-start",
    backgroundColor: UE.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  itemCategoryText: {
    fontSize: 9,
    color: UE.white,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },

  // ===== Summary Card =====
  summaryCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: UE.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    color: UE.gray,
    marginLeft: 8,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 13,
    color: UE.black,
    fontWeight: "700",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  summaryValueBold: {
    fontSize: 17,
    fontWeight: "900",
    color: UE.green,
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: UE.offWhite,
  },

  // ===== Cancel =====
  cancelWrapper: {
    marginTop: 4,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UE.white,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: UE.red,
  },
  cancelBtnText: {
    color: UE.red,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  cancelHint: {
    fontSize: 11,
    color: UE.gray,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },

  // ===== Error state =====
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
    backgroundColor: "#FDE7E7",
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
