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
import { MountainData } from "../app/storage";
import { colors } from "../utils/theme";

interface VictoryScreenProps {
  mountain: MountainData;
  onContinue: () => void;
}

export function VictoryScreen({ mountain, onContinue }: VictoryScreenProps) {
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
        <Animated.Text style={[styles.emoji, emojiStyle]}>⛰️</Animated.Text>
        <Text style={styles.title}>Mountain Conquered</Text>
        <Text style={styles.body}>
          You broke through{" "}
          <Text style={styles.habitName}>{mountain.habitName}</Text>. 66 clean
          days. The mountain is dust.
        </Text>
        <Text style={styles.tagline}>
          The habit no longer controls you.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>View Trophy Room →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  body: {
    fontSize: 18,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 12,
  },
  habitName: {
    color: colors.accent.green,
    fontWeight: "700",
  },
  tagline: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    marginBottom: 40,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: colors.accent.green,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: colors.accent.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
