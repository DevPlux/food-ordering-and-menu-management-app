// src/screens/auth/LoginScreen.tsx
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
import { validateLogin } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

// Uber Eats inspired palette
const UE = {
  green: "#06C167",
  greenDark: "#048A4A",
  black: "#000000",
  white: "#FFFFFF",
  offWhite: "#F3F3F3",
  gray: "#6B6B6B",
};

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setServerError("");
    const v = validateLogin({ email, password });
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
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

          <View style={styles.logoCircle}>
            <Ionicons name="bag-handle" size={40} color={UE.green} />
          </View>

          <View style={styles.brandRow}>
            <Text style={styles.brandDark}>Food</Text>
            <Text style={styles.brandLight}>Express</Text>
          </View>

          <View style={styles.taglinePill}>
            <View style={styles.dot} />
            <Text style={styles.taglineText}>Fast delivery · Great food</Text>
          </View>
        </SafeAreaView>

        {/* ===== Form Card ===== */}
        <View style={styles.cardWrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>Enter your details to continue</Text>

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
              placeholder="Your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <ErrorText>{serverError}</ErrorText>

            <PrimaryButton
              title="Sign In"
              onPress={onSubmit}
              loading={loading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.linkWrapper}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Don't have an account? </Text>
              <Text style={styles.linkBold}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Legal / trust footnote */}
          <Text style={styles.legalText}>
            By continuing you agree to our Terms & Privacy Policy
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
    paddingTop: 36,
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
