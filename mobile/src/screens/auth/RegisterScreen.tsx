// src/screens/auth/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import ErrorText from "../../components/ErrorText";
import { validateRegister } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
  gray: "#6B6B6B",
};

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setServerError("");
    const v = validateRegister({ name, email, password, confirmPassword });
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setServerError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: UE.green }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ===== Hero ===== */}
        <SafeAreaView edges={["top"]} style={styles.hero}>
          {/* Diagonal accent stripe */}
          <View style={styles.stripe} />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={UE.white} />
          </TouchableOpacity>

          <View style={styles.logoCircle}>
            <Ionicons name="bag-handle" size={38} color={UE.green} />
          </View>

          <View style={styles.brandRow}>
            <Text style={styles.brandDark}>Food</Text>
            <Text style={styles.brandLight}>Express</Text>
          </View>

          <View style={styles.taglinePill}>
            <View style={styles.dot} />
            <Text style={styles.taglineText}>
              Join 10,000+ hungry customers
            </Text>
          </View>
        </SafeAreaView>

        {/* ===== Form Card ===== */}
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              It only takes a minute to get started
            </Text>

            <InputField
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <InputField
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <InputField
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />
            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />

            <ErrorText>{serverError}</ErrorText>

            <PrimaryButton
              title="Create Account"
              onPress={onSubmit}
              loading={loading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.linkWrapper}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Already have an account? </Text>
              <Text style={styles.linkBold}>Sign in</Text>
            </TouchableOpacity>
          </View>

          {/* Legal / trust footnote */}
          <Text style={styles.legalText}>
            By creating an account you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ===== Hero =====
  hero: {
    backgroundColor: UE.green,
    paddingTop: 24,
    paddingBottom: 68,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },

  // Diagonal stripe in top-right corner
  stripe: {
    position: "absolute",
    top: -70,
    right: -120,
    width: 340,
    height: 150,
    backgroundColor: UE.greenDark,
    transform: [{ rotate: "-32deg" }],
    opacity: 0.35,
  },

  // Back button (top-left)
  backBtn: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  logoCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: UE.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  brandDark: {
    color: UE.black,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  brandLight: {
    color: UE.white,
    fontSize: 30,
    fontWeight: "300",
    letterSpacing: -1.2,
  },

  taglinePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: UE.green,
    marginRight: 8,
  },

  taglineText: {
    color: UE.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // ===== Card =====
  cardWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -46,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: UE.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    color: UE.gray,
    marginBottom: 26,
    marginTop: 6,
    fontWeight: "500",
  },

  linkWrapper: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  linkText: {
    color: UE.gray,
    fontSize: 14,
    fontWeight: "500",
  },

  linkBold: {
    color: UE.green,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  legalText: {
    textAlign: "center",
    fontSize: 10,
    color: "rgba(0,0,0,0.45)",
    letterSpacing: 0.3,
    fontWeight: "600",
    marginTop: 4,
  },
});
