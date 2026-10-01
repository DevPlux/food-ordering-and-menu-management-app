// src/screens/profile/ProfileScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../api/orderService";
import { Order } from "../../types/order";

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

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch {
      // silent — profile stats are non-critical
    } finally {
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
    const spent = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce(
        (sum, o) =>
          sum + (typeof o.totalAmount === "number" ? o.totalAmount : 0),
        0,
      );
    return { total: orders.length, active, spent };
  }, [orders]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const formatSpent = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Branded Top Bar ===== */}
      <View style={styles.topBar}>
        <View style={styles.topBarStripe} />
        <View>
          <Text style={styles.topBarLabel}>YOUR ACCOUNT</Text>
          <View style={styles.topBarTitleRow}>
            <Text style={styles.topBarTitleDark}>Pro</Text>
            <Text style={styles.topBarTitleLight}>file</Text>
          </View>
          <Text style={styles.topBarSubtitle}>
            Manage your account and preferences
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
            tintColor={UE.green}
          />
        }
      >
        {/* ===== Identity Card ===== */}
        <View style={styles.identityCard}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {user?.isAdmin && (
              <View style={styles.adminCrown}>
                <Ionicons name="shield-checkmark" size={12} color={UE.white} />
              </View>
            )}
          </View>

          <Text style={styles.name}>{user?.name || "Guest User"}</Text>
          <Text style={styles.email}>{user?.email || "Not signed in"}</Text>

          {user?.isAdmin && (
            <View style={styles.adminBadge}>
              <View style={styles.adminBadgeDot} />
              <Text style={styles.adminBadgeText}>ADMINISTRATOR</Text>
            </View>
          )}
        </View>

        {/* ===== Stats ===== */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconBox, { backgroundColor: UE.offWhite }]}
            >
              <Ionicons name="receipt-outline" size={16} color={UE.black} />
            </View>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>ORDERS</Text>
          </View>

          <View style={styles.statCard}>
            <View
              style={[styles.statIconBox, { backgroundColor: UE.amberLight }]}
            >
              <Ionicons name="time-outline" size={16} color={UE.amber} />
            </View>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>ACTIVE</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: "#E6F7EE" }]}>
              <Ionicons name="cash-outline" size={16} color={UE.green} />
            </View>
            <Text style={styles.statValue} numberOfLines={1}>
              {formatSpent(stats.spent)}
            </Text>
            <Text style={styles.statLabel}>SPENT (RS.)</Text>
          </View>
        </View>

        {/* ===== Account ===== */}
        <Text style={styles.sectionHeading}>Account</Text>
        <View style={styles.group}>
          <SettingRow
            icon="person-outline"
            label="Full Name"
            value={user?.name || "—"}
          />
          <Divider />
          <SettingRow
            icon="mail-outline"
            label="Email"
            value={user?.email || "—"}
          />
          <Divider />
          <SettingRow
            icon="finger-print-outline"
            label="User ID"
            value={`#${user?._id?.slice(-8).toUpperCase() || "—"}`}
          />
        </View>

        {/* ===== Quick Actions ===== */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <View style={styles.group}>
          <ActionRow
            icon="fast-food-outline"
            label="Browse Menu"
            onPress={() => navigation.getParent()?.navigate("MenuTab" as never)}
          />
          <Divider />
          <ActionRow
            icon="receipt-outline"
            label="My Orders"
            onPress={() =>
              navigation.getParent()?.navigate("OrdersTab" as never)
            }
          />
          {user?.isAdmin && (
            <>
              <Divider />
              <ActionRow
                icon="settings-outline"
                label="Admin Panel"
                onPress={() =>
                  navigation.getParent()?.navigate("AdminTab" as never)
                }
              />
            </>
          )}
        </View>

        {/* ===== About ===== */}
        <Text style={styles.sectionHeading}>About</Text>
        <View style={styles.group}>
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            value="1.0.0"
          />
          <Divider />
          <SettingRow
            icon="shield-outline"
            label="Account Type"
            value={user?.isAdmin ? "Administrator" : "Customer"}
          />
        </View>

        {/* ===== Logout ===== */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={UE.red} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          MADE WITH ♥ FOR SE2020 · {new Date().getFullYear()}
        </Text>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== Sub-components =====

function SettingRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconBox}>
          <Ionicons name={icon as any} size={16} color={UE.black} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Text style={styles.settingValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconBox}>
          <Ionicons name={icon as any} size={16} color={UE.black} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={UE.gray} />
    </TouchableOpacity>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Branded Top Bar =====
  topBar: {
    backgroundColor: UE.green,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 56,
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
    marginBottom: 8,
  },
  topBarTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  topBarTitleDark: {
    color: UE.black,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  topBarTitleLight: {
    color: UE.white,
    fontSize: 30,
    fontWeight: "300",
    letterSpacing: -1.2,
  },
  topBarSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },

  content: { padding: 16, paddingBottom: 40 },

  // ===== Identity Card =====
  identityCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: -48,
    borderWidth: 1,
    borderColor: UE.border,
  },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: UE.black,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: UE.green,
  },
  avatarText: {
    color: UE.white,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
  },
  adminCrown: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: UE.green,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: UE.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "900",
    color: UE.black,
    marginTop: 16,
    letterSpacing: -0.5,
  },
  email: {
    fontSize: 13,
    color: UE.gray,
    marginTop: 4,
    fontWeight: "600",
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 14,
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

  // ===== Stats =====
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: UE.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "flex-start",
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

  // ===== Section heading =====
  sectionHeading: {
    fontSize: 11,
    fontWeight: "900",
    color: UE.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 10,
  },

  // ===== Group card =====
  group: {
    backgroundColor: UE.white,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: UE.border,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: UE.offWhite,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: UE.black,
    fontWeight: "700",
  },
  settingValue: {
    fontSize: 13,
    color: UE.gray,
    fontWeight: "700",
    maxWidth: "55%",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: UE.offWhite,
    marginLeft: 58,
  },

  // ===== Logout =====
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UE.white,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 28,
    borderWidth: 1.5,
    borderColor: UE.red,
  },
  logoutText: {
    color: UE.red,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  // ===== Footer =====
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: UE.gray,
    marginTop: 24,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
});
