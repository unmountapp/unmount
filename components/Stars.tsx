import React, { useMemo, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  useSharedValue,
  Easing,
} from "react-native-reanimated";

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  delay: number;
  duration: number;
}

function StarDot({ star }: { star: Star }) {
  const opacity = useSharedValue(star.baseOpacity * 0.5);

  useEffect(() => {
    opacity.value = withDelay(
      star.delay,
      withRepeat(
        withTiming(star.baseOpacity, {
          duration: star.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: `${star.x}%` as any,
          top: `${star.y}%` as any,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: "#e2e8f0",
        },
        animStyle,
      ]}
    />
  );
}

export function Stars() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: Math.random() * 2.5 + 0.5,
        baseOpacity: Math.random() * 0.6 + 0.3,
        delay: Math.random() * 3000,
        duration: Math.random() * 3000 + 2000,
      })),
    []
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((star, i) => (
        <StarDot key={i} star={star} />
      ))}
    </View>
  );
}
