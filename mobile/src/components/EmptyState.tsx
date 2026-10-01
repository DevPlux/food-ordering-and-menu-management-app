import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = { message?: string };

export default function EmptyState({ message = "Nothing here yet" }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: { color: colors.textMuted, fontSize: 16, textAlign: "center" },
});
