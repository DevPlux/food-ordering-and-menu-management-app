// src/components/StatusBadge.tsx
import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";
import { OrderStatus } from "../types/order";

type Props = { status: OrderStatus };

const statusColors: Record<OrderStatus, { bg: string; text: string }> = {
  Pending: { bg: "#FFF8E1", text: "#F57F17" },
  Confirmed: { bg: "#E3F2FD", text: "#1565C0" },
  Preparing: { bg: "#FFF3E0", text: "#E65100" },
  Ready: { bg: "#EDE7F6", text: "#4527A0" },
  Completed: { bg: "#E8F5E9", text: colors.success },
  Cancelled: { bg: "#FFEBEE", text: colors.danger },
};

export default function StatusBadge({ status }: Props) {
  const c = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  text: { fontSize: 12, fontWeight: "700" },
});
