import React, { ReactNode } from "react";
import { Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = { children?: ReactNode };

export default function ErrorText({ children }: Props) {
  if (!children) return null;
  return <Text style={styles.text}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: { color: colors.danger, fontSize: 13, marginTop: 4, marginBottom: 4 },
});
