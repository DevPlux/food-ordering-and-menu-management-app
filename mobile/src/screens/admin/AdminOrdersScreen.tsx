// src/screens/admin/AdminOrdersScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { Order, OrderStatus } from "../../types/order";
import { getAllOrders } from "../../api/orderService";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import StatusBadge from "../../components/StatusBadge";
import { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminOrders">;

type FilterKey = "All" | "Active" | OrderStatus;

const FILTERS: FilterKey[] = [
  "All",
  "Active",
  "Pending",
  "Preparing",
  "Completed",
  "Cancelled",
];

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
  amberLight: "#FFF8E1",
};

// ===== Helper: safely extract a display string from order.user =====
const getUserLabel = (user: any): string => {
  if (!user) return "—";
  if (typeof user === "string") return user;
  if (typeof user === "object") {
    if (user.name) return user.name;
    if (user._id) return user._id;
  }
  return "—";
};

export default function AdminOrdersScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  const stats = useMemo(() => {
    const active = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Confirmed" ||
        o.status === "Preparing" ||
        o.status === "Ready",
    ).length;
    const completed = orders.filter((o) => o.status === "Completed").length;
    return { total: orders.length, active, completed };
  }, [orders]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return orders;
    if (activeFilter === "Active") {
      return orders.filter(
        (o) =>
          o.status === "Pending" ||
          o.status === "Confirmed" ||
          o.status === "Preparing" ||
          o.status === "Ready",
      );
    }
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Header ===== */}
      <View style={styles.topBar}>
        <View style={styles.topBarStripe} />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={UE.black} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.adminBadge}>
            <View style={styles.adminBadgeDot} />
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
          <Text style={styles.topBarTitle}>All Orders</Text>
          <Text style={styles.topBarSubtitle}>
            {stats.total} order{stats.total !== 1 ? "s" : ""} · {stats.active}{" "}
            active
          </Text>
        </View>

        <TouchableOpacity
          style={styles.topBarIcon}
          onPress={() => fetchOrders(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color={UE.black} />
        </TouchableOpacity>
      </View>

      {/* ===== Stats ===== */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: UE.black }]}>
          <View style={[styles.statIconBox, { backgroundColor: UE.offWhite }]}>
            <Ionicons name="receipt-outline" size={16} color={UE.black} />
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: UE.amber }]}>
          <View
            style={[styles.statIconBox, { backgroundColor: UE.amberLight }]}
          >
            <Ionicons name="time-outline" size={16} color={UE.amber} />
          </View>
          <Text style={styles.statValue}>{stats.active}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: UE.green }]}>
          <View style={[styles.statIconBox, { backgroundColor: "#E6F7EE" }]}>
            <Ionicons
              name="checkmark-done-outline"
              size={16}
              color={UE.green}
            />
          </View>
          <Text style={styles.statValue}>{stats.completed}</Text>
          <Text style={styles.statLabel}>COMPLETED</Text>
        </View>
      </View>

      {/* ===== Chips ===== */}
      <View style={styles.chipsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FILTERS.map((f) => {
            const isActive = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.7}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.chipText, isActive && styles.chipTextActive]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ===== List ===== */}
      <FlatList
        data={filtered}
        keyExtractor={(o) => o._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
            tintColor={UE.green}
          />
        }
        ListEmptyComponent={
          error ? (
            <View style={styles.emptyBox}>
              <View
                style={[
                  styles.emptyIconCircle,
                  { backgroundColor: UE.redLight },
                ]}
              >
                <Ionicons
                  name="cloud-offline-outline"
                  size={36}
                  color={UE.red}
                />
              </View>
              <Text style={styles.emptyTitle}>Something went wrong</Text>
              <ErrorText>{error}</ErrorText>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => fetchOrders()}
                activeOpacity={0.85}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={36} color={UE.green} />
              </View>
              <Text style={styles.emptyTitle}>
                {activeFilter === "All"
                  ? "No orders yet"
                  : `No ${activeFilter.toLowerCase()} orders`}
              </Text>
              <Text style={styles.emptySubtitle}>
                Orders placed by customers will appear here.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const itemName = item.menuItem?.name ?? "Unknown item";
          const itemImage =
            item.menuItem?.imageUrl || "https://via.placeholder.com/150";
          const total =
            typeof item.totalAmount === "number"
              ? item.totalAmount.toFixed(2)
              : "0.00";
          const date = new Date(item.orderDate);
          const customerLabel = getUserLabel(item.user);

          return (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() =>
                navigation.navigate("AdminOrderDetail", { orderId: item._id })
              }
              activeOpacity={0.9}
            >
              <Image source={{ uri: itemImage }} style={styles.orderThumb} />
              <View style={styles.orderBody}>
                <View style={styles.orderTopRow}>
                  <Text style={styles.orderId}>
                    #{item._id.slice(-6).toUpperCase()}
                  </Text>
                  <StatusBadge status={item.status} />
                </View>
                <Text style={styles.orderName} numberOfLines={1}>
                  {itemName}
                </Text>
                <View style={styles.orderMeta}>
                  <Ionicons name="person-outline" size={11} color={UE.gray} />
                  <Text style={styles.orderMetaText}>{customerLabel}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Text style={styles.orderMetaText}>Qty {item.quantity}</Text>
                </View>
                <View style={styles.orderBottomRow}>
                  <Text style={styles.orderDate}>
                    {date.toLocaleDateString()}{" "}
                    {date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  <Text style={styles.orderTotal}>Rs. {total}</Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={UE.gray}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Top bar =====
  topBar: {
    backgroundColor: UE.green,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 22,
    overflow: "hidden",
    position: "relative",
  },
  topBarStripe: {
    position: "absolute",
    top: -70,
    right: -110,
    width: 300,
    height: 140,
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
    marginTop: 4,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 10,
  },
  adminBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: UE.green,
    marginRight: 6,
  },
  adminBadgeText: {
    color: UE.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  topBarTitle: {
    color: UE.black,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -1,
  },
  topBarSubtitle: {
    color: "rgba(0,0,0,0.65)",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  topBarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  // ===== Stats =====
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: -14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: UE.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: UE.border,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.4,
  },
  statLabel: {
    fontSize: 9,
    color: UE.gray,
    fontWeight: "900",
    marginTop: 3,
    letterSpacing: 1.2,
  },

  // ===== Chips =====
  chipsWrapper: { height: 54, marginTop: 10 },
  chipsRow: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 10,
  },
  chip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: UE.white,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: UE.border,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  chipActive: { backgroundColor: UE.black, borderColor: UE.black },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: UE.black,
    lineHeight: 15,
    includeFontPadding: false,
  },
  chipTextActive: { color: UE.white, fontWeight: "900" },

  // ===== List =====
  listContent: { padding: 16, paddingBottom: 40 },

  orderCard: {
    flexDirection: "row",
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },
  orderThumb: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: UE.offWhite,
  },
  orderBody: { flex: 1, marginLeft: 12 },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 10,
    fontWeight: "900",
    color: UE.gray,
    letterSpacing: 0.8,
  },
  orderName: {
    fontSize: 14,
    fontWeight: "900",
    color: UE.black,
    marginTop: 3,
    letterSpacing: -0.2,
  },
  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  orderMetaText: {
    fontSize: 11,
    color: UE.gray,
    marginLeft: 3,
    fontWeight: "600",
  },
  dot: { color: UE.gray, marginHorizontal: 5, fontSize: 11 },
  orderBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  orderDate: { fontSize: 10, color: UE.gray, fontWeight: "600" },
  orderTotal: {
    fontSize: 14,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },

  // ===== Empty =====
  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#E6F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 13,
    color: UE.gray,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
  retryBtn: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: UE.green,
    borderRadius: 8,
  },
  retryText: {
    color: UE.white,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
