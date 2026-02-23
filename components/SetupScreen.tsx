import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { colors } from "../utils/theme";

interface SetupScreenProps {
  onComplete: (habit: string) => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [habit, setHabit] = useState("");
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  useEffect(() => {
    fadeIn.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    slideUp.value = withDelay(200, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
    transform: [{ translateY: slideUp.value }],
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View style={[styles.content, animStyle]}>
        <Text style={styles.emoji}>⛰️</Text>
        <Text style={styles.title}>UnMount</Text>
        <Text style={styles.subtitle}>
          Your bad habit is a mountain. Chip away at it for 66 days and watch it{" "}
          crumble to nothing.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>What habit will you break?</Text>
          <TextInput
            style={styles.input}
            value={habit}
            onChangeText={setHabit}
            onSubmitEditing={() => habit.trim() && onComplete(habit.trim())}
            placeholder="e.g. Late-night snacking"
            placeholderTextColor={colors.text.dimmed}
            maxLength={50}
            returnKeyType="go"
            autoFocus
          />
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: habit.trim() ? colors.accent.green : colors.surface },
            ]}
            onPress={() => habit.trim() && onComplete(habit.trim())}
            disabled={!habit.trim()}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.buttonText,
                { color: habit.trim() ? "#fff" : colors.text.muted },
              ]}
            >
              Begin the Climb
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    marginBottom: 40,
    textAlign: "center",
    maxWidth: 340,
    lineHeight: 24,
  },
  form: {
    width: "100%",
    maxWidth: 360,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 16,
    paddingHorizontal: 20,
    fontSize: 17,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: colors.text.primary,
  },
  button: {
    width: "100%",
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
