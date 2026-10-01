// src/screens/orders/MyOrdersScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { Order, OrderStatus } from "../../types/order";
import { getMyOrders } from "../../api/orderService";
import OrderCard from "../../components/OrderCard";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import { OrdersStackParamList } from "../../navigation/types";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<OrdersStackParamList, "MyOrders">;

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
  amber: "#F57F17",
  amberLight: "#FFF8E1",
  red: "#E11900",
  redLight: "#FDE7E7",
};

export default function MyOrdersScreen({ navigation }: Props) {
  const { user } = useAuth();
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
      const data = await getMyOrders();
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

  // Stats
  const stats = useMemo(() => {
    const active = orders.filter(
      (o) =>
        o.status === "Pending" ||
        o.status === "Confirmed" ||
        o.status === "Preparing" ||
        o.status === "Ready",
    ).length;
    const spent = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce(
        (sum, o) =>
          sum + (typeof o.totalAmount === "number" ? o.totalAmount : 0),
        0,
      );
    return { total: orders.length, active, spent };
  }, [orders]);

  // Filter
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

  const firstName = user?.name?.split(" ")[0] || "there";

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Branded Top Bar ===== */}
      <View style={styles.topBar}>
        {/* Diagonal stripe accent */}
        <View style={styles.topBarStripe} />

        <View style={{ flex: 1 }}>
          <Text style={styles.topBarLabel}>YOUR HISTORY</Text>
          <View style={styles.topBarTitleRow}>
            <Text style={styles.topBarTitleDark}>My </Text>
            <Text style={styles.topBarTitleLight}>Orders</Text>
          </View>
          <Text style={styles.topBarSubtitle}>
            Hi {firstName} · {stats.total} order{stats.total !== 1 ? "s" : ""}
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
            <Ionicons name="cash-outline" size={16} color={UE.green} />
          </View>
          <Text style={styles.statValue} numberOfLines={1}>
            {stats.spent >= 1000
              ? `${(stats.spent / 1000).toFixed(1)}k`
              : stats.spent.toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>SPENT (RS.)</Text>
        </View>
      </View>

      {/* ===== Filter chips ===== */}
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
                {activeFilter === "All"
                  ? "Browse the menu and place your first order."
                  : "Try a different filter to see your orders."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() =>
              navigation.navigate("OrderDetail", { orderId: item._id })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Branded Top Bar =====
  topBar: {
    backgroundColor: UE.green,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  topBarLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 2,
    marginBottom: 6,
  },
  topBarTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  topBarTitleDark: {
    color: UE.black,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -1,
  },
  topBarTitleLight: {
    color: UE.white,
    fontSize: 26,
    fontWeight: "300",
    letterSpacing: -1,
  },
  topBarSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  topBarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
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
    borderLeftColor: UE.black,
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
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

  // ===== Filter chips =====
  chipsWrapper: {
    height: 58,
    marginTop: 4,
  },
  chipsRow: {
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 12,
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
  chipActive: {
    backgroundColor: UE.black,
    borderColor: UE.black,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: UE.black,
    lineHeight: 16,
    includeFontPadding: false,
  },
  chipTextActive: {
    color: UE.white,
    fontWeight: "900",
  },

  // ===== List =====
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // ===== Empty state =====
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
