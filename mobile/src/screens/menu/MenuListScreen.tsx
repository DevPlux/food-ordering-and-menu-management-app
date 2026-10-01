// src/screens/menu/MenuListScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import { MenuStackParamList } from "../../navigation/types";
import { MenuItem } from "../../types/menuItem";
import { getMenuItems } from "../../api/menuService";
import MenuCard from "../../components/MenuCard";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuList">;

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
  gray: "#6B6B6B",
  border: "#E5E5E5",
};

export default function MenuListScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchMenu = async (isRefresh = false) => {
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
      fetchMenu();
    }, []),
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category)));
    return ["All", ...unique];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch =
        search.trim() === "" ||
        i.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || i.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, activeCategory]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  if (loading) return <Loading />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Branded Top Bar ===== */}
      <View style={styles.topBar}>
        <View style={styles.topBarStripe} />

        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Ionicons name="bag-handle" size={18} color={UE.green} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandNameDark}>Food</Text>
              <Text style={styles.brandNameLight}>Express</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-sharp"
                size={11}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.locationText}>Deliver to · Colombo 07</Text>
            </View>
          </View>
        </View>

        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.topBarIcon} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={20} color={UE.black} />
            <View style={styles.dot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarIcon} activeOpacity={0.7}>
            <Ionicons name="bag-outline" size={20} color={UE.black} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        key={filtered.length === 0 ? "menu-empty" : "menu-grid"}
        data={filtered}
        keyExtractor={(i) => i._id}
        numColumns={2}
        columnWrapperStyle={
          filtered.length > 0 ? styles.columnWrapper : undefined
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchMenu(true)}
            tintColor={UE.green}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Greeting row */}
            <View style={styles.greetingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greetingSmall}>WELCOME BACK</Text>
                <Text style={styles.greetingBig}>Hi, {firstName}</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>
              What are you craving{"\n"}today?
            </Text>

            {/* Search bar */}
            <View style={styles.searchWrapper}>
              <Ionicons
                name="search"
                size={18}
                color={UE.black}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search dishes, restaurants..."
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

            {/* Category chips */}
            <View style={styles.chipsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
              >
                {categories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.chip, isActive && styles.chipActive]}
                      onPress={() => setActiveCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.chipText,
                          isActive && styles.chipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Section title */}
            {!error && (
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>
                  {activeCategory === "All" ? "Popular now" : activeCategory}
                </Text>
                <Text style={styles.sectionCount}>
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MenuCard
              item={item}
              onPress={() =>
                navigation.navigate("MenuDetail", { itemId: item._id })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={36}
                  color={UE.green}
                />
              </View>
              <Text style={styles.emptyTitle}>Something went wrong</Text>
              <ErrorText>{error}</ErrorText>
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
              <Text style={styles.emptyTitle}>No dishes found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different search or category.
              </Text>
            </View>
          )
        }
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
    paddingVertical: 14,
    overflow: "hidden",
    position: "relative",
  },
  topBarStripe: {
    position: "absolute",
    top: -60,
    right: -100,
    width: 260,
    height: 120,
    backgroundColor: UE.greenDark,
    transform: [{ rotate: "-32deg" }],
    opacity: 0.35,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
  },
  brandNameRow: { flexDirection: "row", alignItems: "baseline" },
  brandNameDark: {
    color: UE.black,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  brandNameLight: {
    color: UE.white,
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: -0.6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  locationText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3,
    letterSpacing: 0.2,
  },
  topBarActions: { flexDirection: "row", alignItems: "center" },
  topBarIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    position: "relative",
  },
  dot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD54F",
    borderWidth: 1.5,
    borderColor: UE.white,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: UE.black,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: UE.green,
  },
  cartBadgeText: { color: UE.white, fontSize: 9, fontWeight: "900" },

  // ===== List content + grid =====
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridItem: {
    width: "48%",
  },

  // ===== Header block =====
  header: { marginBottom: 12 },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  greetingSmall: {
    fontSize: 10,
    color: UE.gray,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  greetingBig: {
    fontSize: 22,
    fontWeight: "900",
    color: UE.black,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: UE.black,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: UE.green,
  },
  avatarText: {
    color: UE.white,
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 26,
    fontWeight: "900",
    color: UE.black,
    marginBottom: 18,
    lineHeight: 32,
    letterSpacing: -0.8,
  },

  // ===== Search =====
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: UE.border,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: UE.black,
    paddingVertical: 0,
    fontWeight: "500",
  },

  // ===== Chips =====
  chipsWrapper: { height: 42, marginBottom: 4 },
  chipsRow: { alignItems: "center", paddingVertical: 6 },
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
    fontSize: 13,
    fontWeight: "700",
    color: UE.black,
    lineHeight: 16,
    includeFontPadding: false,
  },
  chipTextActive: { color: UE.white, fontWeight: "800" },

  // ===== Section header =====
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.4,
  },
  sectionCount: {
    fontSize: 12,
    color: UE.gray,
    fontWeight: "700",
    letterSpacing: 0.3,
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
    fontWeight: "800",
    color: UE.black,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 13,
    color: UE.gray,
    marginTop: 6,
    textAlign: "center",
    fontWeight: "500",
  },
});
