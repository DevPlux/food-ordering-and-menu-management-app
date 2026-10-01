// src/screens/menu/MenuDetailScreen.tsx
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
import { MenuStackParamList } from "../../navigation/types";
import { MenuItem } from "../../types/menuItem";
import { getMenuItemById } from "../../api/menuService";
import { createOrder } from "../../api/orderService";
import Loading from "../../components/Loading";
import ErrorText from "../../components/ErrorText";

type Props = NativeStackScreenProps<MenuStackParamList, "MenuDetail">;

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

export default function MenuDetailScreen({ route, navigation }: Props) {
  const { itemId } = route.params;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getMenuItemById(itemId);
        setItem(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId]);

  const handlePlaceOrder = async () => {
    if (!item) return;
    setPlacing(true);
    try {
      const order = await createOrder({ menuItem: item, quantity });
      Alert.alert(
        "Order Placed!",
        `Order #${order._id.slice(-6).toUpperCase()}\nTotal: Rs. ${order.totalAmount.toFixed(
          2,
        )}\nStatus: ${order.status}`,
        [
          { text: "Keep Browsing" },
          {
            text: "View My Orders",
            onPress: () =>
              navigation.getParent()?.navigate("OrdersTab" as never),
          },
        ],
      );
    } catch (e) {
      Alert.alert("Order Failed", (e as Error).message);
    } finally {
      setPlacing(false);
    }
  };

  // ===== Loading =====
  if (loading) return <Loading />;

  // ===== Error =====
  if (error || !item) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.floatingBackLight}>
          <TouchableOpacity
            style={styles.backBtnLight}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={UE.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerBox}>
          <View style={styles.errorIconCircle}>
            <Ionicons name="alert-circle-outline" size={36} color={UE.red} />
          </View>
          <Text style={styles.errorTitle}>Couldn't load dish</Text>
          <ErrorText>{error || "Item not found"}</ErrorText>
        </View>
      </SafeAreaView>
    );
  }

  const isAvailable = item.availabilityStatus === "Available";
  const totalAmount = item.price * quantity;
  const itemImage = item.imageUrl || "https://via.placeholder.com/400";

  return (
    <View style={styles.safe}>
      {/* ===== Hero image ===== */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <Image source={{ uri: itemImage }} style={styles.hero} />

          {/* Floating back button */}
          <SafeAreaView
            edges={["top"]}
            style={styles.floatingBackWrapper}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-back" size={22} color={UE.white} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Availability badge */}
          <View
            style={[
              styles.availPill,
              isAvailable ? styles.availPillOk : styles.availPillNo,
            ]}
          >
            <View
              style={[
                styles.availDot,
                {
                  backgroundColor: isAvailable ? UE.green : UE.red,
                },
              ]}
            />
            <Text
              style={[
                styles.availText,
                { color: isAvailable ? UE.green : UE.red },
              ]}
            >
              {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
            </Text>
          </View>
        </View>

        {/* ===== Body card ===== */}
        <View style={styles.body}>
          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>

          {/* Name */}
          <Text style={styles.name}>{item.name}</Text>

          {/* Rating row */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={11} color={UE.white} />
              <Text style={styles.ratingBadgeText}>4.6</Text>
            </View>
            <Text style={styles.ratingText}>· 120+ ratings</Text>
          </View>

          {/* Price */}
          <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>

          {/* ===== Description ===== */}
          <Text style={styles.sectionHeading}>Description</Text>
          <View style={styles.descCard}>
            <Text style={styles.description}>
              {item.description || "No description provided for this dish."}
            </Text>
          </View>

          {/* ===== Quantity ===== */}
          {isAvailable && (
            <>
              <Text style={styles.sectionHeading}>Quantity</Text>
              <View style={styles.qtyCard}>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    quantity <= 1 && styles.qtyBtnDisabled,
                  ]}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    color={quantity <= 1 ? UE.gray : UE.black}
                  />
                </TouchableOpacity>

                <Text style={styles.qtyValue}>{quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => q + 1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add" size={20} color={UE.black} />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <Text style={styles.qtyTotal}>
                  Rs. {totalAmount.toFixed(2)}
                </Text>
              </View>
            </>
          )}

          {/* Unavailable message */}
          {!isAvailable && (
            <View style={styles.unavailableBox}>
              <Ionicons name="information-circle" size={18} color={UE.red} />
              <Text style={styles.unavailableText}>
                This item is currently unavailable. You cannot place an order
                right now.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ===== Sticky bottom bar ===== */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomLabel}>TOTAL</Text>
            <Text style={styles.bottomTotal}>Rs. {totalAmount.toFixed(2)}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.orderBtn,
              (!isAvailable || placing) && styles.orderBtnDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={!isAvailable || placing}
            activeOpacity={0.85}
          >
            {placing ? (
              <>
                <Ionicons name="hourglass-outline" size={18} color={UE.white} />
                <Text style={styles.orderBtnText}>Placing...</Text>
              </>
            ) : (
              <>
                <Ionicons name="bag-add" size={18} color={UE.white} />
                <Text style={styles.orderBtnText}>
                  {isAvailable ? "Place Order" : "Unavailable"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Hero =====
  heroWrapper: { position: "relative" },
  hero: {
    width: "100%",
    height: 340,
    backgroundColor: UE.offWhite,
  },
  floatingBackWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UE.black,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  floatingBackLight: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  backBtnLight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },

  // ===== Availability pill =====
  availPill: {
    position: "absolute",
    bottom: 48,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    zIndex: 10,
    elevation: 5,
  },
  availPillOk: { backgroundColor: "#E6F7EE" },
  availPillNo: { backgroundColor: "#FDE7E7" },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  availText: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  // ===== Body =====
  body: {
    backgroundColor: UE.offWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -32,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
  },

  // Category pill
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: UE.black,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "900",
    color: UE.white,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Name
  name: {
    fontSize: 28,
    fontWeight: "900",
    color: UE.black,
    lineHeight: 34,
    letterSpacing: -0.8,
  },

  // Rating
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  ratingBadgeText: {
    color: UE.white,
    fontSize: 11,
    fontWeight: "900",
    marginLeft: 3,
  },
  ratingText: {
    fontSize: 12,
    color: UE.gray,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Price
  price: {
    fontSize: 26,
    fontWeight: "900",
    color: UE.black,
    marginTop: 14,
    letterSpacing: -0.6,
  },

  // ===== Section heading =====
  sectionHeading: {
    fontSize: 11,
    fontWeight: "900",
    color: UE.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 28,
    marginBottom: 10,
  },

  // ===== Description =====
  descCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: UE.border,
  },
  description: {
    fontSize: 14,
    color: UE.black,
    lineHeight: 22,
    fontWeight: "500",
  },

  // ===== Quantity =====
  qtyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: UE.border,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: UE.offWhite,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },
  qtyBtnDisabled: { opacity: 0.4 },
  qtyValue: {
    fontSize: 20,
    fontWeight: "900",
    color: UE.black,
    marginHorizontal: 20,
    minWidth: 24,
    textAlign: "center",
  },
  qtyTotal: {
    fontSize: 18,
    fontWeight: "900",
    color: UE.green,
  },

  // ===== Unavailable box =====
  unavailableBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FDE7E7",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#F5C0C0",
  },
  unavailableText: {
    flex: 1,
    fontSize: 13,
    color: UE.red,
    fontWeight: "700",
    marginLeft: 8,
    lineHeight: 19,
  },

  // ===== Bottom bar =====
  bottomBarWrapper: {
    backgroundColor: UE.white,
    borderTopWidth: 1,
    borderTopColor: UE.border,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  bottomLabel: {
    fontSize: 10,
    color: UE.gray,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  bottomTotal: {
    fontSize: 22,
    fontWeight: "900",
    color: UE.black,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  orderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.green,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 8,
  },
  orderBtnDisabled: {
    backgroundColor: UE.gray,
  },
  orderBtnText: {
    color: UE.white,
    fontSize: 15,
    fontWeight: "900",
    marginLeft: 8,
    letterSpacing: 0.3,
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
