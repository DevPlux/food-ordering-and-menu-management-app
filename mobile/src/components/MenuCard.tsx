// src/components/MenuCard.tsx

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { MenuItem } from "../types/menuItem";

type Props = {
  item: MenuItem;
  onPress: () => void;
};

export default function MenuCard({ item, onPress }: Props) {
  const isAvailable = item.availabilityStatus === "Available";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: item.imageUrl || "https://via.placeholder.com/400",
          }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Category pill */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {item.category}
          </Text>
        </View>

        {/* Availability pill */}
        <View
          style={[
            styles.statusPill,
            isAvailable ? styles.availPill : styles.unavailPill,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isAvailable ? styles.availText : styles.unavailText,
            ]}
            numberOfLines={1}
          >
            {item.availabilityStatus}
          </Text>
        </View>
      </View>

      {/* Card body */}
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>

        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>

        {/* Footer always stays at bottom */}
        <View style={styles.footer}>
          <Text style={styles.price} numberOfLines={1}>
            Rs. {item.price.toFixed(2)}
          </Text>

          <View style={[styles.addBtn, !isAvailable && styles.addBtnDisabled]}>
            <Ionicons
              name="add"
              size={20}
              color={isAvailable ? colors.white : colors.textMuted}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,

    // Fixed height for all cards
    height: 300,

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 170,
    backgroundColor: colors.surface,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  categoryPill: {
    position: "absolute",
    top: 12,
    left: 12,

    maxWidth: "55%",

    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  categoryText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  statusPill: {
    position: "absolute",
    top: 12,
    right: 12,

    maxWidth: "45%",

    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  availPill: {
    backgroundColor: "#E8F5E9",
  },

  unavailPill: {
    backgroundColor: "#FFEBEE",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  availText: {
    color: colors.success,
  },

  unavailText: {
    color: colors.danger,
  },

  body: {
    flex: 1,
    padding: 14,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,

    // 2 lines × 18px
    height: 33,

    marginBottom: 12,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // Push footer to bottom
    marginTop: "auto",
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,

    flexShrink: 1,
    marginRight: 8,
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,

    backgroundColor: colors.primary,

    justifyContent: "center",
    alignItems: "center",
  },

  addBtnDisabled: {
    backgroundColor: colors.surface,
  },
});
