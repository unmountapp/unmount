import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { colors } from "../utils/theme";

interface VictoryScreenProps {
  habit: string;
  onReset: () => void;
}

export function VictoryScreen({ habit, onReset }: VictoryScreenProps) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const floatY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(200, withTiming(1, { duration: 1000 }));
    scale.value = withDelay(
      200,
      withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
    floatY.value = withRepeat(
      withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        <Animated.Text style={[styles.emoji, emojiStyle]}>🏔️</Animated.Text>
        <Text style={styles.title}>Mountain Conquered</Text>
        <Text style={styles.body}>
          You broke through{" "}
          <Text style={styles.habitName}>{habit}</Text>. 66 clean days. The
          mountain is dust.
        </Text>
        <Text style={styles.tagline}>
          The habit no longer controls you.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Start a New Challenge</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.accent.greenLight,
    marginBottom: 8,
    textAlign: "center",
  },
  body: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 24,
    marginBottom: 12,
  },
  habitName: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.secondary,
  },
});
