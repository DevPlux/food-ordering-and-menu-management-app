// src/components/OrderCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { Order, OrderStatus } from "../types/order";

type Props = {
  order: Order;
  onPress: () => void;
};

// Status → color accent for the left rail and badge
const STATUS_COLORS: Record<
  OrderStatus,
  { rail: string; bg: string; text: string }
> = {
  Pending: { rail: "#F57F17", bg: "#FFF8E1", text: "#F57F17" },
  Confirmed: { rail: "#1565C0", bg: "#E3F2FD", text: "#1565C0" },
  Preparing: { rail: "#E65100", bg: "#FFF3E0", text: "#E65100" },
  Ready: { rail: "#4527A0", bg: "#EDE7F6", text: "#4527A0" },
  Completed: { rail: "#2E7D32", bg: "#E8F5E9", text: "#2E7D32" },
  Cancelled: { rail: "#D32F2F", bg: "#FFEBEE", text: "#D32F2F" },
};

export default function OrderCard({ order, onPress }: Props) {
  const item = order.menuItem;
  const date = new Date(order.orderDate);
  const itemName = item?.name ?? "Unknown item";
  const itemImage = item?.imageUrl || "https://via.placeholder.com/150";
  const total =
    typeof order.totalAmount === "number"
      ? order.totalAmount.toFixed(2)
      : "0.00";

  const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Left colored rail — reflects status */}
      <View style={[styles.rail, { backgroundColor: sc.rail }]} />

      <Image source={{ uri: itemImage }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.orderId}>
            #{order._id.slice(-6).toUpperCase()}
          </Text>
          <View style={[styles.badge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.badgeText, { color: sc.text }]}>
              {order.status}
            </Text>
          </View>
        </View>

        <Text style={styles.itemName} numberOfLines={1}>
          {itemName}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="cube-outline" size={12} color={colors.textMuted} />
            <Text style={styles.metaText}>Qty {order.quantity}</Text>
          </View>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.total}>Rs. {total}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 110,
  },
  rail: {
    width: 5,
    height: "100%",
  },
  image: {
    width: 92,
    height: "100%",
    backgroundColor: colors.surface,
  },
  body: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 2,
    fontWeight: "500",
  },
  dot: {
    color: colors.textMuted,
    marginHorizontal: 5,
    fontSize: 11,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  total: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.primary,
  },
});
