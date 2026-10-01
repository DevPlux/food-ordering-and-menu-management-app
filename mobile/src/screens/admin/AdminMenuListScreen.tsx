// src/screens/admin/AdminMenuListScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { MenuItem } from "../../types/menuItem";
import { getMenuItems, deleteMenuItem } from "../../api/menuService";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminMenuList">;

type FilterKey = "All" | "Available" | "Unavailable";

const FILTERS: FilterKey[] = ["All", "Available", "Unavailable"];

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
};

export default function AdminMenuListScreen({ navigation }: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const fetchItems = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await getMenuItems();
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, []),
  );

  const stats = useMemo(() => {
    const available = items.filter(
      (i) => i.availabilityStatus === "Available",
    ).length;
    const unavailable = items.length - available;
    return { total: items.length, available, unavailable };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        search.trim() === "" ||
        i.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "All" || i.availabilityStatus === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, activeFilter]);

  const confirmDelete = (item: MenuItem) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMenuItem(item._id);
              fetchItems();
            } catch (e) {
              Alert.alert("Delete Failed", (e as Error).message);
            }
          },
        },
      ],
    );
  };

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Admin Header ===== */}
      <View style={styles.topBar}>
        {/* Diagonal stripe accent */}
        <View style={styles.topBarStripe} />

        <View style={{ flex: 1 }}>
          <View style={styles.adminBadge}>
            <View style={styles.adminBadgeDot} />
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
          <Text style={styles.topBarTitle}>Manage Menu</Text>
          <Text style={styles.topBarSubtitle}>
            {stats.total} item{stats.total !== 1 ? "s" : ""} · {stats.available}{" "}
            available
          </Text>
        </View>

        <TouchableOpacity
          style={styles.ordersBtn}
          onPress={() => navigation.navigate("AdminOrders")}
          activeOpacity={0.85}
        >
          <Ionicons name="receipt-outline" size={14} color={UE.black} />
          <Text style={styles.ordersBtnText}>Orders</Text>
          <Ionicons name="chevron-forward" size={12} color={UE.black} />
        </TouchableOpacity>
      </View>

      {/* ===== Stats ===== */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: UE.black }]}>
          <View style={[styles.statIconBox, { backgroundColor: UE.offWhite }]}>
            <Ionicons name="fast-food-outline" size={16} color={UE.black} />
          </View>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>TOTAL</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: UE.green }]}>
          <View style={[styles.statIconBox, { backgroundColor: "#E6F7EE" }]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={UE.green}
            />
          </View>
          <Text style={styles.statValue}>{stats.available}</Text>
          <Text style={styles.statLabel}>AVAILABLE</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: UE.red }]}>
          <View style={[styles.statIconBox, { backgroundColor: "#FDE7E7" }]}>
            <Ionicons name="close-circle-outline" size={16} color={UE.red} />
          </View>
          <Text style={styles.statValue}>{stats.unavailable}</Text>
          <Text style={styles.statLabel}>UNAVAILABLE</Text>
        </View>
      </View>

      {/* ===== Search ===== */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={18} color={UE.black} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          placeholderTextColor={UE.gray}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={UE.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* ===== Filter Chips ===== */}
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

      {/* ===== Add Button ===== */}
      <TouchableOpacity
        style={styles.addFab}
        onPress={() => navigation.navigate("MenuItemForm", {})}
        activeOpacity={0.85}
      >
        <Ionicons name="add-circle" size={20} color={UE.white} />
        <Text style={styles.addFabText}>Add New Item</Text>
      </TouchableOpacity>

      {/* ===== List ===== */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchItems(true)}
            tintColor={UE.green}
          />
        }
        ListEmptyComponent={
          error ? (
            <View style={styles.emptyBox}>
              <View
                style={[styles.emptyIconCircle, { backgroundColor: "#FDE7E7" }]}
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
                onPress={() => fetchItems()}
                activeOpacity={0.85}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="restaurant-outline"
                  size={36}
                  color={UE.green}
                />
              </View>
              <Text style={styles.emptyTitle}>
                {search || activeFilter !== "All"
                  ? "No items match"
                  : "No menu items yet"}
              </Text>
              <Text style={styles.emptySubtitle}>
                {search || activeFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Tap 'Add New Item' to create your first dish."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const isAvail = item.availabilityStatus === "Available";
          return (
            <View style={styles.itemCard}>
              <Image
                source={{
                  uri: item.imageUrl || "https://via.placeholder.com/80",
                }}
                style={styles.itemThumb}
              />
              <View style={styles.itemBody}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.itemMetaRow}>
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{item.category}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      isAvail
                        ? styles.statusPillAvail
                        : styles.statusPillUnavail,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        isAvail ? styles.dotAvail : styles.dotUnavail,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusPillText,
                        isAvail ? styles.textAvail : styles.textUnavail,
                      ]}
                    >
                      {item.availabilityStatus}
                    </Text>
                  </View>
                </View>
                <Text style={styles.itemPrice}>
                  Rs. {item.price.toFixed(2)}
                </Text>
              </View>

              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() =>
                    navigation.navigate("MenuItemForm", { itemId: item._id })
                  }
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={16} color={UE.black} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconBtn, styles.iconBtnDanger]}
                  onPress={() => confirmDelete(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color={UE.red} />
                </TouchableOpacity>
              </View>
            </View>
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
    justifyContent: "space-between",
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

  ordersBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  ordersBtnText: {
    color: UE.black,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.3,
    marginHorizontal: 6,
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

  // ===== Search =====
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: UE.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: UE.black,
    paddingVertical: 0,
    marginLeft: 10,
    fontWeight: "500",
  },

  // ===== Chips =====
  chipsWrapper: { height: 54, marginTop: 8 },
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
  chipActive: {
    backgroundColor: UE.black,
    borderColor: UE.black,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: UE.black,
    lineHeight: 15,
    includeFontPadding: false,
  },
  chipTextActive: { color: UE.white, fontWeight: "900" },

  // ===== Add FAB =====
  addFab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UE.green,
    height: 48,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  addFabText: {
    color: UE.white,
    fontWeight: "900",
    fontSize: 14,
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  // ===== List =====
  listContent: { padding: 16, paddingBottom: 40 },

  itemCard: {
    flexDirection: "row",
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },
  itemThumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: UE.offWhite,
  },
  itemBody: { flex: 1, marginLeft: 12 },
  itemName: {
    fontSize: 15,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  categoryPill: {
    backgroundColor: UE.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 9,
    fontWeight: "900",
    color: UE.white,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusPillAvail: { backgroundColor: "#E6F7EE" },
  statusPillUnavail: { backgroundColor: "#FDE7E7" },
  statusDot: { width: 5, height: 5, borderRadius: 3, marginRight: 5 },
  dotAvail: { backgroundColor: UE.green },
  dotUnavail: { backgroundColor: UE.red },
  statusPillText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  textAvail: { color: UE.green },
  textUnavail: { color: UE.red },
  itemPrice: {
    fontSize: 15,
    fontWeight: "900",
    color: UE.black,
    marginTop: 6,
    letterSpacing: -0.3,
  },
  itemActions: { flexDirection: "column", gap: 6, marginLeft: 8 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: UE.offWhite,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },
  iconBtnDanger: {
    backgroundColor: "#FDE7E7",
    borderColor: "#F5C0C0",
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
