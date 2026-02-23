import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { MountainData, computeWeeklyStats, computeRelapsePatterns, TOTAL_DAYS } from "../app/storage";
import { colors } from "../utils/theme";

interface AnalyticsScreenProps {
  mountain: MountainData;
}

export function AnalyticsScreen({ mountain }: AnalyticsScreenProps) {
  const weeklyStats = computeWeeklyStats(mountain.log);
  const relapsePatterns = computeRelapsePatterns(mountain.log);

  const maxRelapse = Math.max(...relapsePatterns.map((r) => r.count), 1);
  const maxWeekly = Math.max(
    ...weeklyStats.map((w) => Math.max(w.cleanDays, w.relapses)),
    1
  );

  const progress = Math.round((mountain.cleanDays / TOTAL_DAYS) * 100);
  const daysActive = mountain.log.length;
  const successRate =
    daysActive > 0
      ? Math.round((mountain.log.filter((e) => e.type === "clean").length / daysActive) * 100)
      : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>{mountain.habitName}</Text>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{progress}%</Text>
          <Text style={styles.summaryLabel}>Complete</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.accent.greenLight }]}>
            {successRate}%
          </Text>
          <Text style={styles.summaryLabel}>Success Rate</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: colors.accent.yellow }]}>
            {mountain.bestStreak}
          </Text>
          <Text style={styles.summaryLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Weekly progress chart */}
      {weeklyStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.chart}>
            {weeklyStats.slice(-8).map((week, i) => (
              <View key={i} style={styles.barGroup}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.barClean,
                      { height: `${(week.cleanDays / maxWeekly) * 100}%` as any },
                    ]}
                  />
                </View>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      styles.barRelapse,
                      { height: `${(week.relapses / maxWeekly) * 100}%` as any },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{week.weekLabel}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent.green }]} />
              <Text style={styles.legendText}>Clean</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.accent.red }]} />
              <Text style={styles.legendText}>Relapse</Text>
            </View>
          </View>
        </View>
      )}

      {/* Relapse patterns by day of week */}
      {mountain.totalRelapses > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relapse Patterns</Text>
          <Text style={styles.sectionSubtitle}>Which days are hardest for you?</Text>
          <View style={styles.patternGrid}>
            {relapsePatterns.map((rp) => {
              const intensity = rp.count / maxRelapse;
              return (
                <View key={rp.dayOfWeek} style={styles.patternItem}>
                  <View
                    style={[
                      styles.patternBar,
                      {
                        height: Math.max(4, intensity * 80),
                        backgroundColor:
                          intensity > 0.6
                            ? colors.accent.red
                            : intensity > 0.3
                            ? "rgba(248,113,113,0.5)"
                            : "rgba(248,113,113,0.15)",
                      },
                    ]}
                  />
                  <Text style={styles.patternLabel}>{rp.dayOfWeek}</Text>
                  {rp.count > 0 && (
                    <Text style={styles.patternCount}>{rp.count}</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Journey timeline */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journey Timeline</Text>
        <View style={styles.timeline}>
          {mountain.log.slice(-20).map((entry, i) => {
            const isClean = entry.type === "clean";
            return (
              <View key={i} style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor: isClean ? colors.accent.greenBg : colors.accent.redBg,
                      borderColor: isClean ? colors.accent.greenBorder : colors.accent.redBorder,
                    },
                  ]}
                >
                  <Text style={{ color: isClean ? colors.accent.greenLight : colors.accent.red, fontSize: 10 }}>
                    {isClean ? "✓" : "×"}
                  </Text>
                </View>
                {i < mountain.log.slice(-20).length - 1 && (
                  <View style={styles.timelineLine} />
                )}
                <Text style={styles.timelineDate}>{entry.date.slice(0, 10)}</Text>
                <Text
                  style={[
                    styles.timelineType,
                    { color: isClean ? colors.accent.greenLight : colors.accent.red },
                  ]}
                >
                  {isClean ? "Clean day" : "Relapse"}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.bg.cardBorder,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.text.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    gap: 6,
    marginTop: 16,
    paddingBottom: 24,
  },
  barGroup: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    flexDirection: "row",
    gap: 2,
    position: "relative",
  },
  barContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    borderRadius: 3,
    minHeight: 2,
  },
  barClean: { backgroundColor: colors.accent.green },
  barRelapse: { backgroundColor: colors.accent.red },
  barLabel: {
    position: "absolute",
    bottom: -20,
    fontSize: 9,
    color: colors.text.dimmed,
    width: "100%",
    textAlign: "center",
  },
  legendRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.text.muted },
  patternGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    gap: 8,
  },
  patternItem: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  patternBar: { width: "80%", borderRadius: 4, marginBottom: 6 },
  patternLabel: { fontSize: 11, color: colors.text.muted, fontWeight: "600" },
  patternCount: { fontSize: 10, color: colors.text.dimmed, marginTop: 2 },
  timeline: { marginTop: 12 },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  timelineLine: {
    position: "absolute",
    left: 11.5,
    top: 24,
    width: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  timelineDate: { fontSize: 13, color: colors.text.secondary, flex: 1 },
  timelineType: { fontSize: 12, fontWeight: "600" },
});
