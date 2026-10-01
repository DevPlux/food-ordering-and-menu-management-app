// src/screens/admin/MenuItemFormScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../../theme/colors";
import InputField from "../../components/InputField";
import ErrorText from "../../components/ErrorText";
import {
  createMenuItem,
  updateMenuItem,
  getMenuItemById,
} from "../../api/menuService";
import { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "MenuItemForm">;

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
};

// Fixed category list for the dropdown
const CATEGORIES = [
  "Main Course",
  "Fast Food",
  "Beverage",
  "Dessert",
  "Snack",
  "Salad",
  "Breakfast",
  "Side Dish",
];

export default function MenuItemFormScreen({ route, navigation }: Props) {
  const editingId = route.params?.itemId;
  const isEditing = Boolean(editingId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState<"Available" | "Unavailable">(
    "Available",
  );
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingItem, setLoadingItem] = useState(isEditing);

  // Dropdown state
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    if (!isEditing || !editingId) return;
    const load = async () => {
      try {
        const item = await getMenuItemById(editingId);
        setName(item.name);
        setDescription(item.description);
        setPrice(String(item.price));
        setCategory(item.category);
        setAvailability(item.availabilityStatus);
        setImageUri(item.imageUrl);
      } catch (e) {
        setServerError((e as Error).message);
      } finally {
        setLoadingItem(false);
      }
    };
    load();
  }, [editingId, isEditing]);

  const pickFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Allow photo access to pick an image");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
    }
  };

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Allow camera access to take a photo");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.image;
        return copy;
      });
    }
  };

  const showImageOptions = () => {
    Alert.alert("Add Photo", "Choose a source", [
      { text: "Camera", onPress: pickFromCamera },
      { text: "Photo Library", onPress: pickFromLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const validate = () => {
    const v: Record<string, string> = {};
    if (!name.trim()) v.name = "Name is required";
    if (!category.trim()) v.category = "Category is required";
    if (!price.trim()) v.price = "Price is required";
    else if (isNaN(Number(price)) || Number(price) <= 0)
      v.price = "Enter a valid price";
    if (!imageUri) v.image = "Please choose a photo";
    return v;
  };

  const onSubmit = async () => {
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category: category.trim(),
        availabilityStatus: availability,
        imageUri,
      };
      if (isEditing && editingId) {
        await updateMenuItem(editingId, payload);
      } else {
        await createMenuItem(payload);
      }
      navigation.goBack();
    } catch (e) {
      setServerError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* ===== Header ===== */}
      <View style={styles.headerBar}>
        <View style={styles.headerStripe} />

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
          <Text style={styles.headerTitle}>
            {isEditing ? "Edit Menu Item" : "New Menu Item"}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ===== Image Picker ===== */}
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={showImageOptions}
            activeOpacity={0.85}
          >
            {imageUri ? (
              <>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <View style={styles.imageOverlay}>
                  <View style={styles.imageEditBtn}>
                    <Ionicons name="camera" size={16} color={UE.white} />
                    <Text style={styles.imageEditText}>Change</Text>
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.imagePlaceholderBox}>
                <View style={styles.imagePlaceholderIcon}>
                  <Ionicons name="camera-outline" size={28} color={UE.green} />
                </View>
                <Text style={styles.imagePlaceholderTitle}>Add a photo</Text>
                <Text style={styles.imagePlaceholderSubtitle}>
                  Tap to pick from camera or gallery
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.image ? (
            <Text style={styles.imageError}>{errors.image}</Text>
          ) : null}

          {/* ===== Basic Info ===== */}
          <Text style={styles.sectionHeading}>Basic Info</Text>
          <View style={styles.formCard}>
            <InputField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Chicken Kottu"
              error={errors.name}
            />
            <InputField
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Short description"
              multiline
              numberOfLines={3}
            />

            {/* ===== Category Dropdown ===== */}
            <Text style={styles.fieldLabel}>Category</Text>
            <TouchableOpacity
              style={[
                styles.dropdownTrigger,
                errors.category ? styles.dropdownTriggerError : null,
              ]}
              onPress={() => setCategoryOpen(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !category && styles.dropdownPlaceholder,
                ]}
              >
                {category || "Select a category"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={UE.black} />
            </TouchableOpacity>
            {errors.category ? (
              <Text style={styles.fieldError}>{errors.category}</Text>
            ) : null}
          </View>

          {/* ===== Pricing ===== */}
          <Text style={styles.sectionHeading}>Pricing</Text>
          <View style={styles.formCard}>
            <InputField
              label="Price (Rs.)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="e.g. 950"
              error={errors.price}
            />
          </View>

          {/* ===== Availability ===== */}
          <Text style={styles.sectionHeading}>Availability</Text>
          <View style={styles.toggleRow}>
            {(["Available", "Unavailable"] as const).map((opt) => {
              const isActive = availability === opt;
              const isAvail = opt === "Available";
              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.toggleOption,
                    isActive && styles.toggleOptionActive,
                    isActive &&
                      (isAvail
                        ? styles.toggleActiveAvail
                        : styles.toggleActiveUnavail),
                  ]}
                  onPress={() => setAvailability(opt)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isAvail ? "checkmark-circle" : "close-circle"}
                    size={18}
                    color={isActive ? UE.white : isAvail ? UE.green : UE.red}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      isActive && styles.toggleTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ===== Errors ===== */}
          <ErrorText>{serverError}</ErrorText>

          {/* ===== Submit ===== */}
          <TouchableOpacity
            style={[styles.submitBtn, saving && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Ionicons
              name={saving ? "hourglass-outline" : "checkmark-circle"}
              size={20}
              color={UE.white}
            />
            <Text style={styles.submitText}>
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Item"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ===== Category Dropdown Modal ===== */}
      <Modal
        visible={categoryOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCategoryOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCategoryOpen(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Category</Text>

            <FlatList
              data={CATEGORIES}
              keyExtractor={(c) => c}
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 380 }}
              renderItem={({ item }) => {
                const isSelected = item === category;
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryRow,
                      isSelected && styles.categoryRowSelected,
                    ]}
                    onPress={() => {
                      setCategory(item);
                      setCategoryOpen(false);
                      setErrors((prev) => {
                        const copy = { ...prev };
                        delete copy.category;
                        return copy;
                      });
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryRowText,
                        isSelected && styles.categoryRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={UE.green}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View style={styles.categorySeparator} />
              )}
            />

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setCategoryOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: UE.offWhite },

  // ===== Header =====
  headerBar: {
    backgroundColor: UE.green,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: "hidden",
    position: "relative",
  },
  headerStripe: {
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
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
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
  headerTitle: {
    color: UE.black,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  content: { padding: 16, paddingBottom: 40 },

  // ===== Image picker =====
  imagePicker: {
    height: 220,
    borderRadius: 12,
    backgroundColor: UE.white,
    overflow: "hidden",
    marginBottom: 6,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: UE.border,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  imageEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: UE.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 12,
  },
  imageEditText: {
    color: UE.white,
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  imagePlaceholderBox: { alignItems: "center" },
  imagePlaceholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E6F7EE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imagePlaceholderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: -0.3,
  },
  imagePlaceholderSubtitle: {
    fontSize: 12,
    color: UE.gray,
    marginTop: 4,
    fontWeight: "600",
  },
  imageError: {
    color: UE.red,
    fontSize: 13,
    marginBottom: 14,
    marginTop: 4,
    fontWeight: "700",
  },

  // ===== Section heading =====
  sectionHeading: {
    fontSize: 11,
    fontWeight: "900",
    color: UE.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 20,
  },

  // ===== Form card =====
  formCard: {
    backgroundColor: UE.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: UE.border,
  },

  // ===== Category dropdown trigger =====
  fieldLabel: {
    fontSize: 14,
    color: UE.black,
    marginBottom: 6,
    fontWeight: "700",
  },
  dropdownTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: UE.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: UE.white,
    marginBottom: 4,
  },
  dropdownTriggerError: {
    borderColor: UE.red,
  },
  dropdownTriggerText: {
    fontSize: 15,
    color: UE.black,
    fontWeight: "600",
  },
  dropdownPlaceholder: {
    color: UE.gray,
    fontWeight: "500",
  },
  fieldError: {
    color: UE.red,
    fontSize: 13,
    marginTop: 4,
    fontWeight: "700",
  },

  // ===== Toggle =====
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  toggleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: UE.white,
    borderWidth: 1.5,
    borderColor: UE.border,
  },
  toggleOptionActive: {
    borderWidth: 0,
  },
  toggleActiveAvail: { backgroundColor: UE.green },
  toggleActiveUnavail: { backgroundColor: UE.red },
  toggleText: {
    fontSize: 13,
    fontWeight: "800",
    color: UE.black,
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  toggleTextActive: { color: UE.white },

  // ===== Submit =====
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: UE.green,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  submitText: {
    color: UE.white,
    fontWeight: "900",
    fontSize: 15,
    marginLeft: 8,
    letterSpacing: 0.3,
  },

  // ===== Modal =====
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: UE.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: UE.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: UE.black,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  categoryRowSelected: {},
  categoryRowText: {
    fontSize: 15,
    color: UE.black,
    fontWeight: "600",
  },
  categoryRowTextSelected: {
    color: UE.green,
    fontWeight: "900",
  },
  categorySeparator: {
    height: 1,
    backgroundColor: UE.offWhite,
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: UE.offWhite,
    alignItems: "center",
    borderWidth: 1,
    borderColor: UE.border,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: "900",
    color: UE.black,
    letterSpacing: 0.3,
  },
});
