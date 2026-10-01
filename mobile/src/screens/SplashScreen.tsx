// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
};

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top-right diagonal accent stripe */}
      <View style={styles.stripe} />

      {/* Center: logo mark */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.logoCircle}>
          <Ionicons name="bag-handle" size={52} color={UE.green} />
        </View>
      </Animated.View>

      {/* Center: wordmark + tagline */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <View style={styles.brandRow}>
          <Text style={styles.brandDark}>Food</Text>
          <Text style={styles.brandLight}>Express</Text>
        </View>

        <View style={styles.taglinePill}>
          <View style={styles.dot} />
          <Text style={styles.tagline}>Open now · Delivering in 30 min</Text>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>SE2020 · WEB & MOBILE</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UE.green,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  // Decorative diagonal stripe in the top-right corner
  stripe: {
    position: "absolute",
    top: -60,
    right: -120,
    width: 340,
    height: 140,
    backgroundColor: UE.greenDark,
    transform: [{ rotate: "-32deg" }],
    opacity: 0.35,
  },

  logoWrapper: { marginBottom: 30 },

  logoCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  brandDark: {
    color: UE.black,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.8,
  },

  brandLight: {
    color: UE.white,
    fontSize: 42,
    fontWeight: "300",
    letterSpacing: -1.8,
  },

  taglinePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: UE.green,
    marginRight: 8,
  },

  tagline: {
    color: UE.white,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  footer: {
    position: "absolute",
    bottom: 44,
  },

  footerText: {
    color: UE.black,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: "800",
    opacity: 0.55,
  },
});
