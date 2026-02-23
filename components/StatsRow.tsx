import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MountainData } from "../app/storage";
import { colors } from "../utils/theme";

interface StatsRowProps {
  mountain: MountainData;
}

const stats = [
  { key: "cleanDays", label: "Clean Days", color: colors.accent.greenLight },
  { key: "currentStreak", label: "Streak", color: colors.text.primary },
  { key: "bestStreak", label: "Best", color: colors.accent.yellow },
  { key: "totalRelapses", label: "Relapses", color: colors.accent.red },
] as const;

export function StatsRow({ mountain }: StatsRowProps) {
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.key} style={styles.statItem}>
          <Text style={[styles.value, { color: stat.color }]}>
            {mountain[stat.key]}
          </Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginBottom: 28,
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
});
