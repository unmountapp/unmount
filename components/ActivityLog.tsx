import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LogEntry } from "../utils/storage";
import { colors } from "../utils/theme";

interface ActivityLogProps {
  log: LogEntry[];
}

export function ActivityLog({ log }: ActivityLogProps) {
  if (log.length === 0) return null;

  const recent = log.slice(-14);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      <View style={styles.grid}>
        {recent.map((entry, i) => {
          const isClean = entry.type === "clean";
          return (
            <View
              key={i}
              style={[
                styles.cell,
                {
                  backgroundColor: isClean
                    ? colors.accent.greenBg
                    : colors.accent.redBg,
                  borderColor: isClean
                    ? colors.accent.greenBorder
                    : colors.accent.redBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.cellText,
                  { color: isClean ? colors.accent.greenLight : colors.accent.red },
                ]}
              >
                {isClean ? "✓" : "×"}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.bg.cardBorder,
  },
  title: {
    fontSize: 10,
    color: colors.text.dimmed,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cell: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
