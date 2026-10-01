import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { colors } from "../theme/colors";
import ErrorText from "./ErrorText";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function InputField({ label, error, ...props }: Props) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      <ErrorText>{error}</ErrorText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputError: { borderColor: colors.danger },
});
